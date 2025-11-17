-- Migration 023: Fix infinite recursion in RLS policies
-- Problem: Policy with EXISTS subquery to same table creates infinite recursion

-- Drop the problematic policy
DROP POLICY IF EXISTS "Superadmins can read all admins" ON admins;

-- Keep only the simple policy without recursion
-- This allows each authenticated user to read their own admin record
-- (Policy "Authenticated users can read their own admin record" already exists from migration 022)

-- For superadmin functionality (viewing all admins), we'll handle it in the application layer
-- by using service_role key in server-side code, not through RLS policies
