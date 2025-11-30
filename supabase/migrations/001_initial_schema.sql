-- ================================================================
-- MojService Database Rebuild - Initial Schema
-- Generated: 2025-11-30
--
-- Complete database schema with:
-- ✅ All tables with proper constraints
-- ✅ Security functions (is_admin with SECURITY DEFINER)
-- ✅ Audit logging (correct admin_id mapping)
-- ✅ RLS policies (public read, admin write)
-- ✅ Triggers (updated_at, audit_log)
-- ✅ Indexes for performance
-- ✅ category_services_view with correct order field
-- ================================================================

BEGIN;

-- ================================================================
-- 1. ENUM TYPES
-- ================================================================

CREATE TYPE service_type_enum AS ENUM ('main', 'extra');
CREATE TYPE price_type_enum AS ENUM ('fixed', 'from', 'free', 'on_request');
CREATE TYPE discount_type_enum AS ENUM ('percentage', 'fixed', 'bonus');

-- ================================================================
-- 2. TABLES
-- ================================================================

-- 2.1 Device Categories
CREATE TABLE device_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_cz TEXT NOT NULL,
  icon TEXT,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.2 Device Models
CREATE TABLE device_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES device_categories(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  series TEXT,
  image_url TEXT,
  release_year INTEGER,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.3 Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_cz TEXT NOT NULL,
  description_ru TEXT,
  description_en TEXT,
  description_cz TEXT,
  service_type service_type_enum NOT NULL DEFAULT 'main',
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.4 Category Services (Many-to-Many)
CREATE TABLE category_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES device_categories(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, service_id)
);

-- 2.5 Prices
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES device_models(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  price_type price_type_enum NOT NULL DEFAULT 'fixed',
  duration_minutes INTEGER,
  warranty_months INTEGER DEFAULT 24,
  note_ru TEXT,
  note_en TEXT,
  note_cz TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(model_id, service_id)
);

-- 2.6 Discounts
CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_cz TEXT NOT NULL,
  discount_type discount_type_enum NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  conditions_ru TEXT,
  conditions_en TEXT,
  conditions_cz TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.7 Admins
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('editor', 'admin', 'superadmin')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- 2.8 Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSON,
  new_data JSON,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 3. INDEXES
-- ================================================================

-- Device Categories
CREATE INDEX idx_device_categories_slug ON device_categories(slug);
CREATE INDEX idx_device_categories_order ON device_categories("order");

-- Device Models
CREATE INDEX idx_device_models_category_id ON device_models(category_id);
CREATE INDEX idx_device_models_slug ON device_models(slug);
CREATE INDEX idx_device_models_series ON device_models(series);
CREATE INDEX idx_device_models_order ON device_models("order");
CREATE INDEX idx_device_models_release_year ON device_models(release_year DESC);

-- Services
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_type ON services(service_type);
CREATE INDEX idx_services_order ON services("order");

-- Category Services
CREATE INDEX idx_category_services_category_id ON category_services(category_id);
CREATE INDEX idx_category_services_service_id ON category_services(service_id);
CREATE INDEX idx_category_services_active ON category_services(is_active);
CREATE INDEX idx_category_services_order ON category_services("order");

-- Prices
CREATE INDEX idx_prices_model_id ON prices(model_id);
CREATE INDEX idx_prices_service_id ON prices(service_id);
CREATE INDEX idx_prices_price_type ON prices(price_type);

-- Discounts
CREATE INDEX idx_discounts_active ON discounts(active);

-- Admins
CREATE INDEX idx_admins_user_id_active ON admins(user_id, is_active, role) WHERE is_active = true;

-- Audit Log
CREATE INDEX idx_audit_log_admin_id ON audit_log(admin_id, created_at DESC);

-- ================================================================
-- 4. FUNCTIONS
-- ================================================================

-- 4.1 Update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4.2 Check if user is admin (SECURITY DEFINER - critical!)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'superadmin')
  );
END;
$$;

-- 4.3 Audit log trigger function (correct admin_id mapping)
CREATE OR REPLACE FUNCTION public.log_audit_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_id_pk UUID;
BEGIN
  -- Get admins.id (PK) from auth.uid() (user_id)
  SELECT id INTO admin_id_pk
  FROM public.admins
  WHERE user_id = auth.uid() AND is_active = true
  LIMIT 1;

  IF admin_id_pk IS NULL THEN
    RAISE WARNING 'Audit skipped: No active admin found for user_id=%', auth.uid();
    RETURN COALESCE(NEW, OLD);
  END IF;

  INSERT INTO public.audit_log (admin_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    admin_id_pk,
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ================================================================
-- 5. TRIGGERS
-- ================================================================

-- 5.1 Updated_at triggers
CREATE TRIGGER update_device_categories_updated_at
  BEFORE UPDATE ON device_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_models_updated_at
  BEFORE UPDATE ON device_models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_services_updated_at
  BEFORE UPDATE ON category_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prices_updated_at
  BEFORE UPDATE ON prices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discounts_updated_at
  BEFORE UPDATE ON discounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5.2 Audit log triggers
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

CREATE TRIGGER audit_category_services
  AFTER INSERT OR UPDATE OR DELETE ON category_services
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_discounts
  AFTER INSERT OR UPDATE OR DELETE ON discounts
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

-- ================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE device_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- 6.1 Public tables (read for everyone, write for admins)
CREATE POLICY "Public read access for device_categories"
ON device_categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage device_categories"
ON device_categories FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Public read access for device_models"
ON device_models FOR SELECT USING (true);

CREATE POLICY "Admins can manage device_models"
ON device_models FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Public read access for services"
ON services FOR SELECT USING (true);

CREATE POLICY "Admins can manage services"
ON services FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Public read access for category_services"
ON category_services FOR SELECT USING (true);

CREATE POLICY "Admins can manage category_services"
ON category_services FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Public read access for prices"
ON prices FOR SELECT USING (true);

CREATE POLICY "Admins can manage prices"
ON prices FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Public read access for discounts"
ON discounts FOR SELECT USING (true);

CREATE POLICY "Admins can manage discounts"
ON discounts FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 6.2 Admins table (special policies)
CREATE POLICY "Service role full access to admins"
ON admins FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated can read active admins"
ON admins FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Users can update own last_login"
ON admins FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 6.3 Audit log (read for admins)
CREATE POLICY "Admins can read audit_log"
ON audit_log FOR SELECT
TO authenticated
USING (is_admin());

-- ================================================================
-- 7. VIEWS
-- ================================================================

CREATE OR REPLACE VIEW category_services_view AS
SELECT
  cs.id,
  cs.category_id,
  dc.slug as category_slug,
  dc.name_ru as category_name_ru,
  dc.name_en as category_name_en,
  dc.name_cz as category_name_cz,
  cs.service_id,
  s.slug as service_slug,
  s.name_ru as service_name_ru,
  s.name_en as service_name_en,
  s.name_cz as service_name_cz,
  s.service_type,
  cs."order" as "order",
  cs.is_active,
  cs.created_at,
  cs.updated_at
FROM category_services cs
JOIN device_categories dc ON cs.category_id = dc.id
JOIN services s ON cs.service_id = s.id;

-- Grant permissions on view
GRANT SELECT ON category_services_view TO anon, authenticated;

COMMIT;

-- ================================================================
-- VERIFICATION
-- ================================================================

-- Check tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
