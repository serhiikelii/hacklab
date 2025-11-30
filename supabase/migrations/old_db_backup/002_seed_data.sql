-- Seed data for MojService
-- Test data for categories, models, services and prices
-- Date: 2025-11-04
-- Author: Blueprint Architect

-- ==========================================
-- 1. DEVICE CATEGORIES
-- ==========================================
INSERT INTO device_categories (slug, name_ru, name_en, name_cz, "order") VALUES
  ('iphone', 'iPhone', 'iPhone', 'iPhone', 1),
  ('ipad', 'iPad', 'iPad', 'iPad', 2),
  ('macbook', 'MacBook', 'MacBook', 'MacBook', 3),
  ('apple-watch', 'Apple Watch', 'Apple Watch', 'Apple Watch', 4)
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- 2. DEVICE MODELS
-- ==========================================

-- iPhone models
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'iphone-16-pro-max', 'iPhone 16 Pro Max', 2024, 'iPhone 16', 1 FROM device_categories WHERE slug = 'iphone';
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'iphone-16-pro', 'iPhone 16 Pro', 2024, 'iPhone 16', 2 FROM device_categories WHERE slug = 'iphone';
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'iphone-15-pro-max', 'iPhone 15 Pro Max', 2023, 'iPhone 15', 3 FROM device_categories WHERE slug = 'iphone';
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'iphone-15-pro', 'iPhone 15 Pro', 2023, 'iPhone 15', 4 FROM device_categories WHERE slug = 'iphone';
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'iphone-14-pro-max', 'iPhone 14 Pro Max', 2022, 'iPhone 14', 5 FROM device_categories WHERE slug = 'iphone';
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'iphone-14-pro', 'iPhone 14 Pro', 2022, 'iPhone 14', 6 FROM device_categories WHERE slug = 'iphone';

-- iPad models
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'ipad-pro-12-9', 'iPad Pro 12.9"', 2024, 'iPad Pro', 1 FROM device_categories WHERE slug = 'ipad';
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'ipad-air-4', 'iPad Air 4', 2020, 'iPad Air', 2 FROM device_categories WHERE slug = 'ipad';
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'ipad-mini-5', 'iPad mini 5', 2019, 'iPad mini', 3 FROM device_categories WHERE slug = 'ipad';

-- MacBook models
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'macbook-pro-13-m2-2022', 'MacBook Pro 13" M2', 2022, 'MacBook Pro M2', 1 FROM device_categories WHERE slug = 'macbook';
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'macbook-air-13-m2-2022', 'MacBook Air 13" M2', 2022, 'MacBook Air M2', 2 FROM device_categories WHERE slug = 'macbook';
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'macbook-pro-14-2021', 'MacBook Pro 14"', 2021, 'MacBook Pro', 3 FROM device_categories WHERE slug = 'macbook';

-- Apple Watch models
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'apple-watch-9', 'Apple Watch 9', 2023, 'Apple Watch', 1 FROM device_categories WHERE slug = 'apple-watch';
INSERT INTO device_models (category_id, slug, name, release_year, series, "order")
SELECT id, 'apple-watch-se', 'Apple Watch SE', 2020, 'Apple Watch', 2 FROM device_categories WHERE slug = 'apple-watch';

-- ==========================================
-- 3. SERVICES
-- ==========================================
INSERT INTO services (slug, name_ru, name_en, name_cz, service_type, "order") VALUES
-- iPhone services
('iphone-display-original-prc', 'Замена дисплея оригинал PRC', 'Display Replacement Original PRC', 'Výměna displeje originál PRC', 'main', 10),
('iphone-display-analog', 'Замена дисплея (аналог)', 'Display Replacement (Analog)', 'Výměna displeje (analog)', 'main', 20),
('iphone-battery', 'Замена аккумулятора', 'Battery Replacement', 'Výměna baterie', 'main', 30),
('iphone-back-glass', 'Замена заднего стеклокорпуса', 'Back Glass Replacement', 'Výměna zadního skla', 'main', 40),
('iphone-housing', 'Замена корпуса', 'Housing Replacement', 'Výměna krytu', 'main', 50),
('iphone-camera-main', 'Замена основной камеры', 'Main Camera Replacement', 'Výměna hlavní kamery', 'main', 60),
('iphone-charging-cable', 'Замена шлейфа зарядки', 'Charging Cable Replacement', 'Výměna nabíjecího kabelu', 'main', 70),
('iphone-water-damage', 'Восстановление от повреждения водой', 'Water Damage Recovery', 'Obnova po poškození vodou', 'main', 80),

-- iPad services
('ipad-glass', 'Замена стекла дисплея', 'Display Glass Replacement', 'Výměna skla displeje', 'main', 10),
('ipad-digitizer', 'Замена сенсора дисплея', 'Digitizer Replacement', 'Výměna digitizéru', 'main', 20),
('ipad-display-original', 'Замена дисплея оригинал', 'Display Replacement Original', 'Výměna displeje originál', 'main', 30),
('ipad-battery', 'Замена аккумулятора', 'Battery Replacement', 'Výměna baterie', 'main', 40),
('ipad-water-damage', 'Восстановление от повреждения водой', 'Water Damage Recovery', 'Obnova po poškození vodou', 'main', 50),
('ipad-charging-port', 'Замена разъема зарядки', 'Charging Port Replacement', 'Výměna nabíjecího portu', 'main', 60),

-- MacBook services
('macbook-display', 'Замена дисплея', 'Display Replacement', 'Výměna displeje', 'main', 10),
('macbook-battery', 'Замена аккумулятора', 'Battery Replacement', 'Výměna baterie', 'main', 20),
('macbook-keyboard', 'Замена клавиатуры', 'Keyboard Replacement', 'Výměna klávesnice', 'main', 30),
('macbook-thermal-paste', 'Чистка, замена термопасты', 'Cleaning, Thermal Paste Replacement', 'Čištění, výměna termální pasty', 'main', 40),

-- Apple Watch services
('watch-glass', 'Замена стекла', 'Glass Replacement', 'Výměna skla', 'main', 10),
('watch-digitizer', 'Замена сенсора', 'Digitizer Replacement', 'Výměna senzoru', 'main', 20),
('watch-display', 'Замена дисплея', 'Display Replacement', 'Výměna displeje', 'main', 30),
('watch-battery', 'Замена аккумулятора', 'Battery Replacement', 'Výměna baterie', 'main', 40),
('watch-nfc', 'Восстановление NFC', 'NFC Recovery', 'Obnova NFC', 'main', 50)
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- 4. LINK SERVICES TO CATEGORIES
-- ==========================================
DO $$
DECLARE
  iphone_id UUID;
  ipad_id UUID;
  macbook_id UUID;
  watch_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO iphone_id FROM device_categories WHERE slug = 'iphone';
  SELECT id INTO ipad_id FROM device_categories WHERE slug = 'ipad';
  SELECT id INTO macbook_id FROM device_categories WHERE slug = 'macbook';
  SELECT id INTO watch_id FROM device_categories WHERE slug = 'apple-watch';

  -- Link iPhone services
  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT iphone_id, id, true FROM services WHERE slug IN (
    'iphone-display-original-prc',
    'iphone-display-analog',
    'iphone-battery',
    'iphone-back-glass',
    'iphone-housing',
    'iphone-camera-main',
    'iphone-charging-cable',
    'iphone-water-damage'
  ) ON CONFLICT DO NOTHING;

  -- Link iPad services
  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT ipad_id, id, true FROM services WHERE slug IN (
    'ipad-glass',
    'ipad-digitizer',
    'ipad-display-original',
    'ipad-battery',
    'ipad-water-damage',
    'ipad-charging-port'
  ) ON CONFLICT DO NOTHING;

  -- Link MacBook services
  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT macbook_id, id, true FROM services WHERE slug IN (
    'macbook-display',
    'macbook-battery',
    'macbook-keyboard',
    'macbook-thermal-paste'
  ) ON CONFLICT DO NOTHING;

  -- Link Apple Watch services
  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT watch_id, id, true FROM services WHERE slug IN (
    'watch-glass',
    'watch-digitizer',
    'watch-display',
    'watch-battery',
    'watch-nfc'
  ) ON CONFLICT DO NOTHING;
END $$;

-- ==========================================
-- 5. SAMPLE PRICES (for iPhone 15 Pro Max)
-- ==========================================
DO $$
DECLARE
  model_id UUID;
BEGIN
  SELECT id INTO model_id FROM device_models WHERE slug = 'iphone-15-pro-max';

  -- Diagnostics (free)
  INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes)
  SELECT model_id, id, 0, 'free', 15 FROM services WHERE slug = 'iphone-display-original-prc'
  ON CONFLICT DO NOTHING;

  -- Screen replacement Original PRC
  INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes)
  SELECT model_id, id, 3999, 'fixed', 120 FROM services WHERE slug = 'iphone-display-original-prc'
  ON CONFLICT DO NOTHING;

  -- Screen replacement Analog
  INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes)
  SELECT model_id, id, 2499, 'from', 90 FROM services WHERE slug = 'iphone-display-analog'
  ON CONFLICT DO NOTHING;

  -- Battery replacement
  INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes)
  SELECT model_id, id, 1499, 'fixed', 60 FROM services WHERE slug = 'iphone-battery'
  ON CONFLICT DO NOTHING;

  -- Back glass replacement
  INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes)
  SELECT model_id, id, 2499, 'fixed', 180 FROM services WHERE slug = 'iphone-back-glass'
  ON CONFLICT DO NOTHING;

  -- Camera replacement
  INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes)
  SELECT model_id, id, 1999, 'fixed', 90 FROM services WHERE slug = 'iphone-camera-main'
  ON CONFLICT DO NOTHING;

  -- Water damage repair
  INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes)
  SELECT model_id, id, 2999, 'from', 2880 FROM services WHERE slug = 'iphone-water-damage'
  ON CONFLICT DO NOTHING;
END $$;

-- ==========================================
-- 6. DISCOUNTS
-- ==========================================
INSERT INTO discounts (name_ru, name_en, name_cz, discount_type, value, conditions_ru, conditions_en, conditions_cz, active) VALUES
('Скидка 10% при ремонте 2+ устройств', '10% discount for 2+ devices', 'Sleva 10% při opravě 2+ zařízení', 'percentage', 10, 'При одновременном ремонте двух и более устройств', 'When repairing two or more devices simultaneously', 'Při současné opravě dvou a více zařízení', true),
('Бесплатная диагностика при ремонте', 'Free diagnostics with repair', 'Bezplatná diagnostika při opravě', 'bonus', 0, 'При заказе любого ремонта диагностика бесплатно', 'Free diagnostics when ordering any repair', 'Bezplatná diagnostika při objednání jakékoli opravy', true),
('Гарантия 24 месяца', '24 months warranty', 'Záruka 24 měsíců', 'bonus', 0, 'Гарантия 2 года на все виды ремонта', '2-year warranty on all repairs', 'Záruka 2 roky na všechny druhy oprav', true);
