-- Migration 022: Allow authenticated users to read their own admin record
-- Problem: After disabling RLS, we need a simple policy for authenticated users

-- Re-enable RLS (was disabled in 020)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create simple policy: authenticated users can read their own record
CREATE POLICY "Authenticated users can read their own admin record"
  ON admins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Superadmins can read all admins
CREATE POLICY "Superadmins can read all admins"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins a
      WHERE a.user_id = auth.uid()
        AND a.role = 'superadmin'
        AND a.is_active = true
    )
  );
