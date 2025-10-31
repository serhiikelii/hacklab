-- MojService Database Schema - CLEAN MIGRATION
-- Версия без предварительной очистки (для первого запуска)
-- После этой миграции используйте migration_safe.sql для обновлений

-- ============================================================================
-- СОЗДАНИЕ ОБЪЕКТОВ БАЗЫ ДАННЫХ
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. DEVICE CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS device_categories (
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
CREATE INDEX IF NOT EXISTS idx_device_categories_slug ON device_categories(slug);
CREATE INDEX IF NOT EXISTS idx_device_categories_order ON device_categories("order");

-- ============================================================================
-- 2. DEVICE MODELS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS device_models (
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
CREATE INDEX IF NOT EXISTS idx_device_models_category_id ON device_models(category_id);
CREATE INDEX IF NOT EXISTS idx_device_models_slug ON device_models(slug);
CREATE INDEX IF NOT EXISTS idx_device_models_series ON device_models(series);
CREATE INDEX IF NOT EXISTS idx_device_models_order ON device_models("order");

-- ============================================================================
-- 3. SERVICES TABLE
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE service_type_enum AS ENUM ('main', 'extra');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS services (
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
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_type ON services(service_type);
CREATE INDEX IF NOT EXISTS idx_services_order ON services("order");

-- ============================================================================
-- 4. PRICES TABLE
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE price_type_enum AS ENUM ('fixed', 'from', 'free', 'on_request');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS prices (
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
CREATE INDEX IF NOT EXISTS idx_prices_model_id ON prices(model_id);
CREATE INDEX IF NOT EXISTS idx_prices_service_id ON prices(service_id);
CREATE INDEX IF NOT EXISTS idx_prices_price_type ON prices(price_type);

-- ============================================================================
-- 5. DISCOUNTS TABLE
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE discount_type_enum AS ENUM ('percentage', 'fixed', 'bonus');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS discounts (
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
CREATE INDEX IF NOT EXISTS idx_discounts_active ON discounts(active);

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

-- Создаем триггеры только если их еще нет
DO $$ BEGIN
  CREATE TRIGGER update_device_categories_updated_at
    BEFORE UPDATE ON device_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_device_models_updated_at
    BEFORE UPDATE ON device_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_prices_updated_at
    BEFORE UPDATE ON prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_discounts_updated_at
    BEFORE UPDATE ON discounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE device_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- Создаем политики только если их еще нет
DO $$ BEGIN
  CREATE POLICY "Public read access for device_categories" ON device_categories
    FOR SELECT USING (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read access for device_models" ON device_models
    FOR SELECT USING (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read access for services" ON services
    FOR SELECT USING (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read access for prices" ON prices
    FOR SELECT USING (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read access for discounts" ON discounts
    FOR SELECT USING (active = true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- ГОТОВО! Таблицы созданы и готовы к использованию
-- Теперь можно запускать seed_full.sql для заполнения данных
-- ============================================================================
