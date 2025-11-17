-- Migration 020: Temporary disable RLS on admins table to test auth
-- This is a DIAGNOSTIC migration to confirm RLS is the problem

-- STEP 1: Drop ALL policies on admins table
DROP POLICY IF EXISTS "Admins can view their own record" ON admins;
DROP POLICY IF EXISTS "Superadmins can view all admins" ON admins;
DROP POLICY IF EXISTS "Only superadmins can manage admins" ON admins;
DROP POLICY IF EXISTS "Authenticated users can read admins if they are admin" ON admins;
DROP POLICY IF EXISTS "Service role can do anything" ON admins;

-- STEP 2: Temporarily DISABLE RLS on admins table
-- This is UNSAFE for production but needed for diagnosis
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- STEP 3: Keep the SECURITY DEFINER functions as they are
-- (already fixed in migration 019)

-- NOTE: After confirming login works, we'll create a migration 021 to:
-- 1. Re-enable RLS on admins
-- 2. Create CORRECT policies that don't create circular dependency
