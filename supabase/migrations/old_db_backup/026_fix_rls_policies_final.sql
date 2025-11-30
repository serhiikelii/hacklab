-- Migration 026: Fix RLS policies - remove recursive policy
-- The "Only superadmins can manage admins" policy creates recursion
-- We need to drop it and keep only simple SELECT policies for authenticated users

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Authenticated users can read active admins" ON admins;
DROP POLICY IF EXISTS "Authenticated users can read their own admin record" ON admins;
DROP POLICY IF EXISTS "Only superadmins can manage admins" ON admins;
DROP POLICY IF EXISTS "Service role can manage admins" ON admins;
DROP POLICY IF EXISTS "Service role has full access to admins" ON admins;

-- Create new simple policies

-- Policy 1: Service role can do everything
CREATE POLICY "Service role full access"
ON admins
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 2: Authenticated users can read all active admins
-- This is SAFE because:
-- 1. Only reads (SELECT), no writes
-- 2. Simple condition without subqueries
-- 3. No recursion possible
CREATE POLICY "Authenticated can read active admins"
ON admins
FOR SELECT
TO authenticated
USING (is_active = true);

-- Policy 3: Authenticated users can update their own last_login_at
-- This allows updating last login time without admin check
CREATE POLICY "Users can update own last_login"
ON admins
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Note: For INSERT/DELETE operations on admins,
-- we'll use service_role key in Server Actions
-- This avoids any recursion issues with admin role checking
