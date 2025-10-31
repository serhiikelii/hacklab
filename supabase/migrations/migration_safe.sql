-- MojService Database Schema - SAFE MIGRATION
-- Автоматическая очистка + создание всех объектов
-- Можно запускать повторно без ошибок

-- ============================================================================
-- ОЧИСТКА СУЩЕСТВУЮЩИХ ОБЪЕКТОВ (в правильном порядке)
-- ============================================================================

-- Удаляем политики RLS (если существуют)
DROP POLICY IF EXISTS "Public read access for device_categories" ON device_categories;
DROP POLICY IF EXISTS "Public read access for device_models" ON device_models;
DROP POLICY IF EXISTS "Public read access for services" ON services;
DROP POLICY IF EXISTS "Public read access for prices" ON prices;
DROP POLICY IF EXISTS "Public read access for discounts" ON discounts;

-- Удаляем триггеры (если существуют)
DROP TRIGGER IF EXISTS update_device_categories_updated_at ON device_categories;
DROP TRIGGER IF EXISTS update_device_models_updated_at ON device_models;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS update_prices_updated_at ON prices;
DROP TRIGGER IF EXISTS update_discounts_updated_at ON discounts;

-- Удаляем функцию триггера
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Удаляем таблицы (CASCADE удалит все зависимости)
DROP TABLE IF EXISTS prices CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS device_models CASCADE;
DROP TABLE IF EXISTS device_categories CASCADE;

-- Удаляем ENUM типы
DROP TYPE IF EXISTS price_type_enum CASCADE;
DROP TYPE IF EXISTS service_type_enum CASCADE;
DROP TYPE IF EXISTS discount_type_enum CASCADE;

-- ============================================================================
-- СОЗДАНИЕ НОВЫХ ОБЪЕКТОВ
-- ============================================================================

-- Enable UUID extension
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
  icon TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
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
-- 4. PRICES TABLE
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
-- 5. DISCOUNTS TABLE
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
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (anyone can view pricelist)
CREATE POLICY "Public read access for device_categories" ON device_categories
  FOR SELECT USING (true);

CREATE POLICY "Public read access for device_models" ON device_models
  FOR SELECT USING (true);

CREATE POLICY "Public read access for services" ON services
  FOR SELECT USING (true);

CREATE POLICY "Public read access for prices" ON prices
  FOR SELECT USING (true);

CREATE POLICY "Public read access for discounts" ON discounts
  FOR SELECT USING (active = true);

-- ============================================================================
-- ГОТОВО! Таблицы созданы и готовы к использованию
-- ============================================================================
