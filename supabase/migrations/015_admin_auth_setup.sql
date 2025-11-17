-- Migration: Admin authentication and authorization setup
-- Creates admins table, RLS policies, audit logging, and helper functions

-- 1. Create enum for admin roles
CREATE TYPE admin_role_enum AS ENUM ('editor', 'admin', 'superadmin');

-- 2. Create admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role admin_role_enum NOT NULL DEFAULT 'editor',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  last_login_at TIMESTAMPTZ
);

-- 3. Create audit_log table for tracking changes
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  action TEXT NOT NULL,  -- 'INSERT', 'UPDATE', 'DELETE'
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1
    FROM admins
    WHERE user_id = auth.uid()
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 5. Create helper function to get admin role
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 6. Enable RLS on admins and audit_log tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- 7. RLS policies for admins table
-- Admins can read their own record
CREATE POLICY "Admins can view their own record"
  ON admins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Superadmins can view all admins
CREATE POLICY "Superadmins can view all admins"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS(
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

-- Only superadmins can insert/update/delete admins
CREATE POLICY "Only superadmins can manage admins"
  ON admins
  FOR ALL
  TO authenticated
  USING (
    EXISTS(
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
        AND role = 'superadmin'
        AND is_active = true
    )
  );

-- 8. RLS policies for audit_log
-- Admins and superadmins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS(
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('admin', 'superadmin')
    )
  );

-- 9. Add RLS policies for write operations on main tables
-- These policies allow INSERT/UPDATE/DELETE only for active admins

-- device_models policies
CREATE POLICY "Admins can insert device_models"
  ON device_models
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update device_models"
  ON device_models
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete device_models"
  ON device_models
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- prices policies
CREATE POLICY "Admins can insert prices"
  ON prices
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update prices"
  ON prices
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete prices"
  ON prices
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- services policies
CREATE POLICY "Admins can insert services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete services"
  ON services
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- device_categories policies
CREATE POLICY "Admins can insert device_categories"
  ON device_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update device_categories"
  ON device_categories
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete device_categories"
  ON device_categories
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- 10. Create function to log changes (trigger function)
CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS TRIGGER AS $$
DECLARE
  admin_record UUID;
BEGIN
  -- Get admin_id from current user
  SELECT id INTO admin_record
  FROM admins
  WHERE user_id = auth.uid();

  -- Log the change
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create triggers for audit logging
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

-- 12. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.device_models TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.device_categories TO authenticated;
GRANT SELECT ON public.admins TO authenticated;
GRANT SELECT ON public.audit_log TO authenticated;

-- 13. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 14. Add updated_at trigger to admins table
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 15. Create indexes for performance
CREATE INDEX idx_admins_user_id ON admins(user_id);
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_role ON admins(role);
CREATE INDEX idx_admins_active ON admins(is_active) WHERE is_active = true;
CREATE INDEX idx_audit_log_admin_id ON audit_log(admin_id);
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- 16. Insert initial superadmin (you'll need to update this with your actual user_id after first login)
-- This is a placeholder - you should manually add your first superadmin after creating a user via Supabase Auth
-- Example:
-- INSERT INTO admins (user_id, email, role, created_at)
-- VALUES ('your-user-id-here', 'admin@example.com', 'superadmin', NOW());
