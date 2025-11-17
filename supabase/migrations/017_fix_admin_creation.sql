-- Migration: Fix admin creation issues
-- Allow service_role to manage admins table

-- 1. Grant full access to service_role for admins table
GRANT ALL ON public.admins TO service_role;
GRANT ALL ON public.audit_log TO service_role;

-- 2. Add policy to allow service_role to insert/update/delete admins
CREATE POLICY "Service role can manage admins"
  ON admins
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. Function to create superadmin (can be called from SQL)
CREATE OR REPLACE FUNCTION create_superadmin(
  p_email TEXT,
  p_user_id UUID
)
RETURNS void AS $$
BEGIN
  -- Delete existing admin record if exists
  DELETE FROM admins WHERE email = p_email OR user_id = p_user_id;

  -- Insert new superadmin
  INSERT INTO admins (user_id, email, role, is_active)
  VALUES (p_user_id, p_email, 'superadmin', true);

  RAISE NOTICE 'Superadmin created: % (user_id: %)', p_email, p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_superadmin(TEXT, UUID) TO service_role, postgres;

COMMENT ON FUNCTION create_superadmin IS 'Creates or recreates a superadmin user in admins table';
