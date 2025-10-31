-- Seed data для MojService
-- Тестовые данные для категорий, моделей, услуг и цен

-- ==========================================
-- 1. КАТЕГОРИИ
-- ==========================================
INSERT INTO categories (slug, name, icon) VALUES
  ('iphone', 'iPhone', 'smartphone'),
  ('ipad', 'iPad', 'tablet'),
  ('mac', 'Mac', 'laptop'),
  ('watch', 'Watch & TV', 'watch');

-- ==========================================
-- 2. МОДЕЛИ УСТРОЙСТВ
-- ==========================================

-- iPhone модели
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'iphone-16-pro-max', 'iPhone 16 Pro Max', 2024, 'iPhone 16' FROM categories WHERE slug = 'iphone';
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'iphone-16-pro', 'iPhone 16 Pro', 2024, 'iPhone 16' FROM categories WHERE slug = 'iphone';
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'iphone-15-pro-max', 'iPhone 15 Pro Max', 2023, 'iPhone 15' FROM categories WHERE slug = 'iphone';
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'iphone-15-pro', 'iPhone 15 Pro', 2023, 'iPhone 15' FROM categories WHERE slug = 'iphone';
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'iphone-14-pro-max', 'iPhone 14 Pro Max', 2022, 'iPhone 14' FROM categories WHERE slug = 'iphone';
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'iphone-14-pro', 'iPhone 14 Pro', 2022, 'iPhone 14' FROM categories WHERE slug = 'iphone';

-- iPad модели
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'ipad-air-4', 'iPad Air 4', 2020, 'iPad Air' FROM categories WHERE slug = 'ipad';
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'ipad-pro-12-9', 'iPad Pro 12.9"', 2024, 'iPad Pro' FROM categories WHERE slug = 'ipad';
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'ipad-mini-5', 'iPad mini 5', 2019, 'iPad mini' FROM categories WHERE slug = 'ipad';

-- Mac модели
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'macbook-pro-13-m2-2022', 'MacBook Pro 13" M2', 2022, 'MacBook Pro M2' FROM categories WHERE slug = 'mac';
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'macbook-air-13-m2-2022', 'MacBook Air 13" M2', 2022, 'MacBook Air M2' FROM categories WHERE slug = 'mac';
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'macbook-pro-14-2021', 'MacBook Pro 14"', 2021, 'MacBook Pro' FROM categories WHERE slug = 'mac';

-- Watch модели
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'apple-watch-9', 'Apple Watch 9', 2023, 'Apple Watch' FROM categories WHERE slug = 'watch';
INSERT INTO device_models (category_id, slug, name, year, series)
SELECT id, 'apple-watch-se', 'Apple Watch SE', 2020, 'Apple Watch' FROM categories WHERE slug = 'watch';

-- ==========================================
-- 3. УСЛУГИ РЕМОНТА
-- ==========================================
INSERT INTO services (slug, name_en, name_ru, name_cs, description) VALUES
  ('diagnostics', 'Diagnostics', 'Диагностика', 'Diagnostika', 'Free diagnostics with repair'),
  ('screen-replacement', 'Screen Replacement', 'Замена экрана', 'Výměna displeje', 'Replacing broken or cracked screen'),
  ('battery-replacement', 'Battery Replacement', 'Замена батареи', 'Výměna baterie', 'Battery replacement for better performance'),
  ('back-glass-replacement', 'Back Glass Replacement', 'Замена заднего стекла', 'Výměna zadního skla', 'Replacing cracked back glass'),
  ('camera-replacement', 'Camera Replacement', 'Замена камеры', 'Výměna kamery', 'Front or rear camera replacement'),
  ('charging-port-repair', 'Charging Port Repair', 'Ремонт порта зарядки', 'Oprava nabíjecího portu', 'Fixing charging port issues'),
  ('speaker-replacement', 'Speaker Replacement', 'Замена динамика', 'Výměna reproduktoru', 'Speaker or microphone replacement'),
  ('water-damage-repair', 'Water Damage Repair', 'Ремонт после воды', 'Oprava po styku s vodou', 'Repair after liquid damage'),
  ('button-repair', 'Button Repair', 'Ремонт кнопок', 'Oprava tlačítek', 'Power, volume, or home button repair'),
  ('motherboard-repair', 'Motherboard Repair', 'Ремонт материнской платы', 'Oprava základní desky', 'Logic board repair');

-- ==========================================
-- 4. ЦЕНЫ (примеры для iPhone 15 Pro Max)
-- ==========================================
INSERT INTO prices (model_id, service_id, price, duration, price_type)
SELECT
  dm.id,
  s.id,
  0,
  '15 min',
  'free'
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-15-pro-max' AND s.slug = 'diagnostics';

INSERT INTO prices (model_id, service_id, price, duration, price_type)
SELECT
  dm.id,
  s.id,
  3999,
  '1-2 hours',
  'fixed'
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-15-pro-max' AND s.slug = 'screen-replacement';

INSERT INTO prices (model_id, service_id, price, duration, price_type)
SELECT
  dm.id,
  s.id,
  1499,
  '1 hour',
  'fixed'
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-15-pro-max' AND s.slug = 'battery-replacement';

INSERT INTO prices (model_id, service_id, price, duration, price_type)
SELECT
  dm.id,
  s.id,
  2499,
  '2-3 hours',
  'fixed'
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-15-pro-max' AND s.slug = 'back-glass-replacement';

INSERT INTO prices (model_id, service_id, price, duration, price_type)
SELECT
  dm.id,
  s.id,
  1999,
  '1-2 hours',
  'fixed'
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-15-pro-max' AND s.slug = 'camera-replacement';

INSERT INTO prices (model_id, service_id, price, duration, price_type)
SELECT
  dm.id,
  s.id,
  1299,
  '1-2 hours',
  'fixed'
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-15-pro-max' AND s.slug = 'charging-port-repair';

INSERT INTO prices (model_id, service_id, price, duration, price_type)
SELECT
  dm.id,
  s.id,
  2999,
  '2-5 days',
  'from'
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-15-pro-max' AND s.slug = 'water-damage-repair';

INSERT INTO prices (model_id, service_id, price, duration, price_type)
SELECT
  dm.id,
  s.id,
  NULL,
  '3-7 days',
  'on_request'
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-15-pro-max' AND s.slug = 'motherboard-repair';
