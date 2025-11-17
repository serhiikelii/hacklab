-- Migration: Fix RLS circular dependency in admin authentication
-- Problem: is_admin() queries admins table which has RLS policies creating circular dependency
-- Solution: Disable RLS on admins temporarily during auth, use SECURITY DEFINER properly

-- 1. Drop problematic RLS policies that create circular dependency
DROP POLICY IF EXISTS "Superadmins can view all admins" ON admins;
DROP POLICY IF EXISTS "Only superadmins can manage admins" ON admins;
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_log;

-- 2. Recreate is_admin() with SECURITY DEFINER to bypass RLS during check
-- This function will execute with the privileges of the function owner (postgres/supabase_admin)
-- thereby avoiding RLS circular dependency
DROP FUNCTION IF EXISTS is_admin() CASCADE;
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  -- SECURITY DEFINER allows this function to bypass RLS on admins table
  -- This breaks the circular dependency: auth -> check policies -> is_admin() -> admins with RLS
  RETURN EXISTS(
    SELECT 1
    FROM admins
    WHERE user_id = auth.uid()
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, auth;

-- 3. Recreate get_admin_role() with same approach
DROP FUNCTION IF EXISTS get_admin_role() CASCADE;
CREATE OR REPLACE FUNCTION get_admin_role()
RETURNS admin_role_enum AS $$
DECLARE
  user_role admin_role_enum;
BEGIN
  SELECT role INTO user_role
  FROM admins
  WHERE user_id = auth.uid()
    AND is_active = true;

  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, auth;

-- 4. Create new RLS policies WITHOUT nested subqueries to admins
-- Simplified: Use the SECURITY DEFINER functions instead of EXISTS queries

-- Superadmins can view all admins (using get_admin_role function)
CREATE POLICY "Superadmins can view all admins"
  ON admins
  FOR SELECT
  TO authenticated
  USING (get_admin_role() = 'superadmin');

-- Only superadmins can manage admins (insert/update/delete)
CREATE POLICY "Only superadmins can manage admins"
  ON admins
  FOR ALL
  TO authenticated
  USING (get_admin_role() = 'superadmin');

-- 5. Fix audit_log policy to use function instead of subquery
CREATE POLICY "Admins can view audit logs"
  ON audit_log
  FOR SELECT
  TO authenticated
  USING (
    get_admin_role() IN ('admin', 'superadmin')
  );

-- 6. Ensure the audit log trigger doesn't fail during auth flow
-- Make it handle cases where admin_record might not exist yet
DROP FUNCTION IF EXISTS log_audit_changes() CASCADE;
CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS TRIGGER AS $$
DECLARE
  admin_record UUID;
BEGIN
  -- Try to get admin_id, but don't fail if it doesn't exist
  -- This prevents errors during auth flow
  BEGIN
    SELECT id INTO admin_record
    FROM admins
    WHERE user_id = auth.uid();
  EXCEPTION WHEN OTHERS THEN
    admin_record := NULL;
  END;

  -- Log the change (admin_id can be NULL for system operations)
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_log (admin_id, action, table_name, record_id, old_data)
    VALUES (admin_record, 'DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_log (admin_id, action, table_name, record_id, old_data, new_data)
    VALUES (admin_record, 'UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_log (admin_id, action, table_name, record_id, new_data)
    VALUES (admin_record, 'INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth;

-- 7. Recreate audit triggers with the fixed function
CREATE TRIGGER audit_device_models
  AFTER INSERT OR UPDATE OR DELETE ON device_models
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_prices
  AFTER INSERT OR UPDATE OR DELETE ON prices
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_services
  AFTER INSERT OR UPDATE OR DELETE ON services
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_device_categories
  AFTER INSERT OR UPDATE OR DELETE ON device_categories
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

-- 8. Grant execute permissions on the SECURITY DEFINER functions
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_role() TO authenticated;

-- 9. Comment explaining the fix
COMMENT ON FUNCTION is_admin() IS 'Checks if current user is an active admin. Uses SECURITY DEFINER to bypass RLS and avoid circular dependency during authentication.';
COMMENT ON FUNCTION get_admin_role() IS 'Returns the role of current admin user. Uses SECURITY DEFINER to bypass RLS and avoid circular dependency.';
