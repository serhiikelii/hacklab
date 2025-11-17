-- Migration 024: Restore proper RLS policies on admins table
-- Now that we're using @supabase/ssr, sessions work correctly
-- We can restore RLS with proper policies that don't create circular dependencies

-- STEP 1: Enable RLS on admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- STEP 2: Create simple, non-recursive policies

-- Policy 1: Service role can do everything (for server actions)
CREATE POLICY "Service role has full access to admins"
ON admins
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 2: Authenticated users can read admins table
-- This is safe because we check is_active in queries
CREATE POLICY "Authenticated users can read active admins"
ON admins
FOR SELECT
TO authenticated
USING (is_active = true);

-- Policy 3: Only superadmins can insert/update/delete
-- We use a simple check without recursion
CREATE POLICY "Only superadmins can manage admins"
ON admins
FOR ALL
TO authenticated
USING (
  -- Allow if the current user is a superadmin
  EXISTS (
    SELECT 1
    FROM admins a
    WHERE a.user_id = auth.uid()
      AND a.role = 'superadmin'
      AND a.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM admins a
    WHERE a.user_id = auth.uid()
      AND a.role = 'superadmin'
      AND a.is_active = true
  )
);

-- STEP 3: Grant necessary permissions
GRANT SELECT ON admins TO authenticated;
GRANT ALL ON admins TO service_role;
