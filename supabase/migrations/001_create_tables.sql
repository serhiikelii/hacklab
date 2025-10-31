-- MojService Database Schema
-- Создание таблиц для каталога устройств и прайс-листа

-- Категории устройств (iPhone, iPad, Mac, Watch)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Модели устройств
CREATE TABLE device_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  year INTEGER,
  series TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Типы услуг ремонта
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_cs TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Цены на услуги для каждой модели
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES device_models(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'CZK',
  duration TEXT,
  price_type TEXT DEFAULT 'fixed', -- 'fixed', 'from', 'free', 'on_request'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(model_id, service_id)
);

-- Индексы для быстрого поиска
CREATE INDEX idx_device_models_category ON device_models(category_id);
CREATE INDEX idx_device_models_slug ON device_models(slug);
CREATE INDEX idx_prices_model ON prices(model_id);
CREATE INDEX idx_prices_service ON prices(service_id);

-- Enable Row Level Security (опционально, но рекомендуется)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;

-- Разрешить чтение всем (для публичного сайта)
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on device_models" ON device_models FOR SELECT USING (true);
CREATE POLICY "Allow public read access on services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read access on prices" ON prices FOR SELECT USING (true);
