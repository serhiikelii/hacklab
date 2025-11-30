-- MojService Database Schema
-- Initial migration: Clean architecture with correct category slugs
-- Date: 2025-11-04
-- Author: Blueprint Architect
--
-- Categories: iphone, ipad, macbook, apple-watch

-- ============================================================================
-- ENABLE EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. DEVICE CATEGORIES TABLE
-- ============================================================================
CREATE TABLE device_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_cz TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_device_categories_slug ON device_categories(slug);
CREATE INDEX idx_device_categories_order ON device_categories("order");

-- ============================================================================
-- 2. DEVICE MODELS TABLE
-- ============================================================================
CREATE TABLE device_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES device_categories(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  series TEXT,
  image_url TEXT,
  release_year INTEGER,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_device_models_category_id ON device_models(category_id);
CREATE INDEX idx_device_models_slug ON device_models(slug);
CREATE INDEX idx_device_models_series ON device_models(series);
CREATE INDEX idx_device_models_order ON device_models("order");

-- ============================================================================
-- 3. SERVICES TABLE
-- ============================================================================
CREATE TYPE service_type_enum AS ENUM ('main', 'extra');

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_cz TEXT NOT NULL,
  description_ru TEXT,
  description_en TEXT,
  description_cz TEXT,
  service_type service_type_enum NOT NULL DEFAULT 'main',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_type ON services(service_type);
CREATE INDEX idx_services_order ON services("order");

-- ============================================================================
-- 4. CATEGORY SERVICES (Many-to-Many)
-- ============================================================================
CREATE TABLE category_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES device_categories(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique combination of category and service
  UNIQUE(category_id, service_id)
);

-- Indexes for faster lookups
CREATE INDEX idx_category_services_category_id ON category_services(category_id);
CREATE INDEX idx_category_services_service_id ON category_services(service_id);
CREATE INDEX idx_category_services_active ON category_services(is_active);

-- ============================================================================
-- 5. PRICES TABLE
-- ============================================================================
CREATE TYPE price_type_enum AS ENUM ('fixed', 'from', 'free', 'on_request');

CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID NOT NULL REFERENCES device_models(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  price DECIMAL(10, 2),
  price_type price_type_enum NOT NULL DEFAULT 'fixed',
  duration_minutes INTEGER,
  warranty_months INTEGER DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique combination of model and service
  UNIQUE(model_id, service_id)
);

-- Indexes
CREATE INDEX idx_prices_model_id ON prices(model_id);
CREATE INDEX idx_prices_service_id ON prices(service_id);
CREATE INDEX idx_prices_price_type ON prices(price_type);

-- ============================================================================
-- 6. DISCOUNTS TABLE
-- ============================================================================
CREATE TYPE discount_type_enum AS ENUM ('percentage', 'fixed', 'bonus');

CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_cz TEXT NOT NULL,
  discount_type discount_type_enum NOT NULL,
  value DECIMAL(10, 2),
  conditions_ru TEXT,
  conditions_en TEXT,
  conditions_cz TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_discounts_active ON discounts(active);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_device_categories_updated_at BEFORE UPDATE ON device_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_models_updated_at BEFORE UPDATE ON device_models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_services_updated_at BEFORE UPDATE ON category_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prices_updated_at BEFORE UPDATE ON prices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discounts_updated_at BEFORE UPDATE ON discounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE device_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (anyone can view pricelist)
CREATE POLICY "Public read access for device_categories" ON device_categories
  FOR SELECT USING (true);

CREATE POLICY "Public read access for device_models" ON device_models
  FOR SELECT USING (true);

CREATE POLICY "Public read access for services" ON services
  FOR SELECT USING (true);

CREATE POLICY "Public read access for category_services" ON category_services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for prices" ON prices
  FOR SELECT USING (true);

CREATE POLICY "Public read access for discounts" ON discounts
  FOR SELECT USING (active = true);

-- ============================================================================
-- VIEW FOR CATEGORY-SPECIFIC SERVICES
-- ============================================================================
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
  s."order" as service_order,
  cs.is_active,
  cs.created_at,
  cs.updated_at
FROM category_services cs
JOIN device_categories dc ON cs.category_id = dc.id
JOIN services s ON cs.service_id = s.id
WHERE cs.is_active = true
ORDER BY dc."order", s."order";

-- Grant public read access to view
GRANT SELECT ON category_services_view TO anon, authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON TABLE device_categories IS 'Device categories: iPhone, iPad, MacBook, Apple Watch';
COMMENT ON TABLE device_models IS 'Specific device models for each category';
COMMENT ON TABLE services IS 'Repair services offered (main services and extra services)';
COMMENT ON TABLE category_services IS 'Many-to-many relationship: which services are available for which categories';
COMMENT ON TABLE prices IS 'Prices for each service per device model';
COMMENT ON TABLE discounts IS 'Available discounts and promotions';
COMMENT ON VIEW category_services_view IS 'Convenient view for fetching category-specific services with all related data';
