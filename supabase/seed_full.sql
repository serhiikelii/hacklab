-- MojService ПОЛНЫЙ Seed Data
-- ВСЕ 107 моделей устройств + услуги + скидки
-- Основано на анализе appleguru.cz

-- ============================================================================
-- 1. DEVICE CATEGORIES
-- ============================================================================
INSERT INTO device_categories (slug, name_ru, name_en, name_cz, icon, "order") VALUES
  ('iphone', 'iPhone', 'iPhone', 'iPhone', '📱', 1),
  ('ipad', 'iPad', 'iPad', 'iPad', '📱', 2),
  ('mac', 'MacBook', 'MacBook', 'MacBook', '💻', 3),
  ('watch', 'Apple Watch', 'Apple Watch', 'Apple Watch', '⌚', 4);

-- ============================================================================
-- 2. ВСЕ МОДЕЛИ УСТРОЙСТВ (107 моделей)
-- ============================================================================
DO $$
DECLARE
  iphone_category_id UUID;
  ipad_category_id UUID;
  mac_category_id UUID;
  watch_category_id UUID;
BEGIN
  -- Получаем ID категорий
  SELECT id INTO iphone_category_id FROM device_categories WHERE slug = 'iphone';
  SELECT id INTO ipad_category_id FROM device_categories WHERE slug = 'ipad';
  SELECT id INTO mac_category_id FROM device_categories WHERE slug = 'mac';
  SELECT id INTO watch_category_id FROM device_categories WHERE slug = 'watch';

  -- ========================================================================
  -- IPHONE (40 моделей)
  -- ========================================================================

  -- iPhone 16 series (2024)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-16-pro-max', 'iPhone 16 Pro Max', 'iPhone 16', 2024, 1),
    (iphone_category_id, 'iphone-16-pro', 'iPhone 16 Pro', 'iPhone 16', 2024, 2),
    (iphone_category_id, 'iphone-16-plus', 'iPhone 16 Plus', 'iPhone 16', 2024, 3),
    (iphone_category_id, 'iphone-16', 'iPhone 16', 'iPhone 16', 2024, 4);

  -- iPhone 15 series (2023)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-15-pro-max', 'iPhone 15 Pro Max', 'iPhone 15', 2023, 5),
    (iphone_category_id, 'iphone-15-pro', 'iPhone 15 Pro', 'iPhone 15', 2023, 6),
    (iphone_category_id, 'iphone-15-plus', 'iPhone 15 Plus', 'iPhone 15', 2023, 7),
    (iphone_category_id, 'iphone-15', 'iPhone 15', 'iPhone 15', 2023, 8);

  -- iPhone 14 series (2022)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-14-pro-max', 'iPhone 14 Pro Max', 'iPhone 14', 2022, 9),
    (iphone_category_id, 'iphone-14-pro', 'iPhone 14 Pro', 'iPhone 14', 2022, 10),
    (iphone_category_id, 'iphone-14-plus', 'iPhone 14 Plus', 'iPhone 14', 2022, 11),
    (iphone_category_id, 'iphone-14', 'iPhone 14', 'iPhone 14', 2022, 12);

  -- iPhone 13 series (2021)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-13-pro-max', 'iPhone 13 Pro Max', 'iPhone 13', 2021, 13),
    (iphone_category_id, 'iphone-13-pro', 'iPhone 13 Pro', 'iPhone 13', 2021, 14),
    (iphone_category_id, 'iphone-13', 'iPhone 13', 'iPhone 13', 2021, 15),
    (iphone_category_id, 'iphone-13-mini', 'iPhone 13 mini', 'iPhone 13', 2021, 16);

  -- iPhone 12 series (2020)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-12-pro-max', 'iPhone 12 Pro Max', 'iPhone 12', 2020, 17),
    (iphone_category_id, 'iphone-12-pro', 'iPhone 12 Pro', 'iPhone 12', 2020, 18),
    (iphone_category_id, 'iphone-12', 'iPhone 12', 'iPhone 12', 2020, 19),
    (iphone_category_id, 'iphone-12-mini', 'iPhone 12 mini', 'iPhone 12', 2020, 20);

  -- iPhone SE (2020)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-se-2020', 'iPhone SE (2020)', 'iPhone SE', 2020, 21);

  -- iPhone 11 series (2019)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-11-pro-max', 'iPhone 11 Pro Max', 'iPhone 11', 2019, 22),
    (iphone_category_id, 'iphone-11-pro', 'iPhone 11 Pro', 'iPhone 11', 2019, 23),
    (iphone_category_id, 'iphone-11', 'iPhone 11', 'iPhone 11', 2019, 24);

  -- iPhone XS/XR/X series (2017-2018)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-xs-max', 'iPhone XS Max', 'iPhone XS/XR/X', 2018, 25),
    (iphone_category_id, 'iphone-xs', 'iPhone XS', 'iPhone XS/XR/X', 2018, 26),
    (iphone_category_id, 'iphone-xr', 'iPhone XR', 'iPhone XS/XR/X', 2018, 27),
    (iphone_category_id, 'iphone-x', 'iPhone X', 'iPhone XS/XR/X', 2017, 28);

  -- iPhone 8 series (2017)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-8-plus', 'iPhone 8 Plus', 'iPhone 8', 2017, 29),
    (iphone_category_id, 'iphone-8', 'iPhone 8', 'iPhone 8', 2017, 30);

  -- iPhone 7 series (2016)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-7-plus', 'iPhone 7 Plus', 'iPhone 7', 2016, 31),
    (iphone_category_id, 'iphone-7', 'iPhone 7', 'iPhone 7', 2016, 32);

  -- iPhone 6S series (2015)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-6s-plus', 'iPhone 6S Plus', 'iPhone 6S', 2015, 33),
    (iphone_category_id, 'iphone-6s', 'iPhone 6S', 'iPhone 6S', 2015, 34);

  -- iPhone 6 series (2014)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-6-plus', 'iPhone 6 Plus', 'iPhone 6', 2014, 35),
    (iphone_category_id, 'iphone-6', 'iPhone 6', 'iPhone 6', 2014, 36);

  -- iPhone SE (2016)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-se', 'iPhone SE', 'iPhone SE', 2016, 37);

  -- iPhone 5 series (2012-2013)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (iphone_category_id, 'iphone-5s', 'iPhone 5S', 'iPhone 5', 2013, 38),
    (iphone_category_id, 'iphone-5c', 'iPhone 5C', 'iPhone 5', 2013, 39),
    (iphone_category_id, 'iphone-5', 'iPhone 5', 'iPhone 5', 2012, 40);

  -- ========================================================================
  -- IPAD (24 модели)
  -- ========================================================================

  -- iPad Air series
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (ipad_category_id, 'ipad-air-4', 'iPad Air 4', 'iPad Air', 2020, 1),
    (ipad_category_id, 'ipad-air-3', 'iPad Air 3', 'iPad Air', 2019, 2),
    (ipad_category_id, 'ipad-air-2', 'iPad Air 2', 'iPad Air', 2014, 3),
    (ipad_category_id, 'ipad-air-1', 'iPad Air 1', 'iPad Air', 2013, 4);

  -- iPad Pro 12.9" series
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (ipad_category_id, 'ipad-pro-12-9', 'iPad Pro 12.9"', 'iPad Pro 12.9', 2024, 5),
    (ipad_category_id, 'ipad-pro-12-9-2017', 'iPad Pro 12.9 (2017)', 'iPad Pro 12.9', 2017, 6),
    (ipad_category_id, 'ipad-pro-12-9-2015', 'iPad Pro 12.9 (2015)', 'iPad Pro 12.9', 2015, 7);

  -- iPad Pro 11" series
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (ipad_category_id, 'ipad-pro-11', 'iPad Pro 11"', 'iPad Pro 11', 2024, 8);

  -- iPad Pro other sizes
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (ipad_category_id, 'ipad-pro-10-5-2017', 'iPad Pro 10.5 (2017)', 'iPad Pro 10.5', 2017, 9),
    (ipad_category_id, 'ipad-pro-9-7-2016', 'iPad Pro 9.7 (2016)', 'iPad Pro 9.7', 2016, 10);

  -- iPad mini series
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (ipad_category_id, 'ipad-mini-5', 'iPad mini 5', 'iPad mini', 2019, 11),
    (ipad_category_id, 'ipad-mini-4', 'iPad mini 4', 'iPad mini', 2015, 12),
    (ipad_category_id, 'ipad-mini-3', 'iPad mini 3', 'iPad mini', 2014, 13),
    (ipad_category_id, 'ipad-mini-2', 'iPad mini 2', 'iPad mini', 2013, 14),
    (ipad_category_id, 'ipad-mini-1', 'iPad mini 1', 'iPad mini', 2012, 15);

  -- iPad regular series
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (ipad_category_id, 'ipad-10', 'iPad 10', 'iPad', 2022, 16),
    (ipad_category_id, 'ipad-9', 'iPad 9', 'iPad', 2021, 17),
    (ipad_category_id, 'ipad-8', 'iPad 8', 'iPad', 2020, 18),
    (ipad_category_id, 'ipad-7', 'iPad 7', 'iPad', 2019, 19),
    (ipad_category_id, 'ipad-6', 'iPad 6', 'iPad', 2018, 20),
    (ipad_category_id, 'ipad-5', 'iPad 5', 'iPad', 2017, 21),
    (ipad_category_id, 'ipad-4', 'iPad 4', 'iPad', 2012, 22),
    (ipad_category_id, 'ipad-3', 'iPad 3', 'iPad', 2012, 23),
    (ipad_category_id, 'ipad-2', 'iPad 2', 'iPad', 2011, 24);

  -- ========================================================================
  -- MAC (32 модели - MacBook only)
  -- ========================================================================

  -- Row 1: Latest M4 models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-pro-16-m4-a3403', 'MacBook Pro 16" M4 (A3403)', 'MacBook Pro M4', 2024, 1),
    (mac_category_id, 'macbook-pro-14-m4-a3401', 'MacBook Pro 14" M4 (A3401)', 'MacBook Pro M4', 2024, 2),
    (mac_category_id, 'macbook-pro-14-m4-a3112', 'MacBook Pro 14" M4 (A3112)', 'MacBook Pro M4', 2024, 3),
    (mac_category_id, 'macbook-air-15-m3-a3114', 'MacBook Air 15" M3 (A3114)', 'MacBook Air M3', 2024, 4);

  -- Row 2: MacBook Pro 16"
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-pro-16-a2991', 'MacBook Pro 16" (A2991)', 'MacBook Pro', 2023, 5),
    (mac_category_id, 'macbook-pro-16-a2780', 'MacBook Pro 16" (A2780)', 'MacBook Pro', 2023, 6),
    (mac_category_id, 'macbook-pro-16-m1-a2485', 'MacBook Pro 16" M1 (A2485)', 'MacBook Pro M1', 2021, 7),
    (mac_category_id, 'macbook-pro-16-a2141', 'MacBook Pro 16" (A2141)', 'MacBook Pro', 2019, 8);

  -- Row 3: MacBook Pro 15" and 14" M3
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-pro-15-a1990', 'MacBook Pro 15" (A1990)', 'MacBook Pro', 2018, 9),
    (mac_category_id, 'macbook-pro-15-a1707', 'MacBook Pro 15" (A1707)', 'MacBook Pro', 2016, 10),
    (mac_category_id, 'macbook-pro-15-a1398', 'MacBook Pro 15" (A1398)', 'MacBook Pro', 2015, 11),
    (mac_category_id, 'macbook-pro-14-m3-a2992', 'MacBook Pro 14" M3 (A2992)', 'MacBook Pro M3', 2023, 12);

  -- Row 4: MacBook Pro 14" models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-pro-14-m3-a2918', 'MacBook Pro 14" M3 (A2918)', 'MacBook Pro M3', 2023, 13),
    (mac_category_id, 'macbook-pro-14-m2-a2779', 'MacBook Pro 14" M2 (A2779)', 'MacBook Pro M2', 2023, 14),
    (mac_category_id, 'macbook-pro-14-m1-a2442', 'MacBook Pro 14" M1 (A2442)', 'MacBook Pro M1', 2021, 15),
    (mac_category_id, 'macbook-pro-13-m1-m2-a2338', 'MacBook Pro 13" M1/M2 (A2338)', 'MacBook Pro', 2022, 16);

  -- Row 5: MacBook Pro 13" models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-pro-13-a2251-a2289', 'MacBook Pro 13" (A2251,A2289)', 'MacBook Pro', 2020, 17),
    (mac_category_id, 'macbook-pro-13-a2159', 'MacBook Pro 13" (A2159)', 'MacBook Pro', 2019, 18),
    (mac_category_id, 'macbook-pro-13-a1989', 'MacBook Pro 13" (A1989)', 'MacBook Pro', 2018, 19),
    (mac_category_id, 'macbook-pro-13-a1706-a1708', 'MacBook Pro 13" (A1706,A1708)', 'MacBook Pro', 2017, 20);

  -- Row 6: MacBook Pro 13" older + MacBook Air
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-pro-13-a1425-a1502', 'MacBook Pro 13" (A1425,A1502)', 'MacBook Pro', 2015, 21),
    (mac_category_id, 'macbook-air-15-a2941', 'MacBook Air 15" (A2941)', 'MacBook Air', 2023, 22),
    (mac_category_id, 'macbook-air-13-m3-a3113', 'MacBook Air 13" M3 (A3113)', 'MacBook Air M3', 2024, 23),
    (mac_category_id, 'macbook-air-13-a2179', 'MacBook Air 13" (A2179)', 'MacBook Air', 2020, 24);

  -- Row 7: MacBook Air models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-air-13-m1-a2337', 'MacBook Air 13" M1 (A2337)', 'MacBook Air M1', 2020, 25),
    (mac_category_id, 'macbook-air-13-a2179-2', 'MacBook Air 13" (A2179)', 'MacBook Air', 2020, 26),
    (mac_category_id, 'macbook-air-13-a1932', 'MacBook Air 13" (A1932)', 'MacBook Air', 2018, 27),
    (mac_category_id, 'macbook-air-11-a1370-a1465', 'MacBook Air 11" (A1370,A1465)', 'MacBook Air', 2015, 28);

  -- Row 8: MacBook 12"
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-12-a1534', 'MacBook 12" (A1534)', 'MacBook', 2017, 29);

  -- ========================================================================
  -- WATCH (17 моделей)
  -- ========================================================================

  -- Row 1: Apple Watch Ultra + SE 2 + SE
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (watch_category_id, 'apple-watch-ultra-49mm', 'Apple Watch Ultra 49mm', 'Apple Watch Ultra', 2022, 1),
    (watch_category_id, 'apple-watch-se-2-44mm', 'Apple Watch SE 2 44mm', 'Apple Watch SE 2', 2022, 2),
    (watch_category_id, 'apple-watch-se-2-40mm', 'Apple Watch SE 2 40mm', 'Apple Watch SE 2', 2022, 3),
    (watch_category_id, 'apple-watch-se-44mm', 'Apple Watch SE 44mm', 'Apple Watch SE', 2020, 4);

  -- Row 2: SE 40mm + Series 8 + Series 7 45mm
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (watch_category_id, 'apple-watch-se-40mm', 'Apple Watch SE 40mm', 'Apple Watch SE', 2020, 5),
    (watch_category_id, 'apple-watch-series-8-45mm', 'Apple Watch Series 8 45mm', 'Apple Watch Series 8', 2022, 6),
    (watch_category_id, 'apple-watch-series-8-41mm', 'Apple Watch Series 8 41mm', 'Apple Watch Series 8', 2022, 7),
    (watch_category_id, 'apple-watch-series-7-45mm', 'Apple Watch Series 7 45mm', 'Apple Watch Series 7', 2021, 8);

  -- Row 3: Series 7 41mm + Series 6 + Series 5 44mm
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (watch_category_id, 'apple-watch-series-7-41mm', 'Apple Watch Series 7 41mm', 'Apple Watch Series 7', 2021, 9),
    (watch_category_id, 'apple-watch-series-6-44mm', 'Apple Watch Series 6 44mm', 'Apple Watch Series 6', 2020, 10),
    (watch_category_id, 'apple-watch-series-6-40mm', 'Apple Watch Series 6 40mm', 'Apple Watch Series 6', 2020, 11),
    (watch_category_id, 'apple-watch-series-5-44mm', 'Apple Watch Series 5 44mm', 'Apple Watch Series 5', 2019, 12);

  -- Row 4: Series 5 40mm + Series 4 + Series 3 42mm
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (watch_category_id, 'apple-watch-series-5-40mm', 'Apple Watch Series 5 40mm', 'Apple Watch Series 5', 2019, 13),
    (watch_category_id, 'apple-watch-series-4-44mm', 'Apple Watch Series 4 44mm', 'Apple Watch Series 4', 2018, 14),
    (watch_category_id, 'apple-watch-series-4-40mm', 'Apple Watch Series 4 40mm', 'Apple Watch Series 4', 2018, 15),
    (watch_category_id, 'apple-watch-series-3-42mm', 'Apple Watch Series 3 42mm', 'Apple Watch Series 3', 2017, 16);

  -- Row 5: Series 3 38mm
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (watch_category_id, 'apple-watch-series-3-38mm', 'Apple Watch Series 3 38mm', 'Apple Watch Series 3', 2017, 17);

END $$;

-- ============================================================================
-- 3. УСЛУГИ (23 услуги)
-- ============================================================================

-- Основные услуги (18 штук)
INSERT INTO services (slug, name_ru, name_en, name_cz, service_type, "order") VALUES
  ('diagnostics', 'Диагностика', 'Diagnostics', 'Diagnostika', 'main', 1),
  ('replacing-broken-glass', 'Замена разбитого стекла', 'Replacing broken glass', 'Výměna rozbitého skla', 'main', 2),
  ('replacement-front-panel', 'Замена передней панели', 'Replacement of the front panel', 'Výměna předního panelu', 'main', 3),
  ('battery-replacement', 'Замена батареи', 'Battery replacement', 'Výměna baterie', 'main', 4),
  ('replacing-rear-glass', 'Замена заднего стекла', 'Replacing the rear glass', 'Výměna zadního skla', 'main', 5),
  ('replacing-power-button', 'Замена кнопки питания', 'Replacing the power button', 'Výměna tlačítka napájení', 'main', 6),
  ('replacing-volume-buttons', 'Замена кнопок громкости', 'Replacing the volume buttons', 'Výměna tlačítek hlasitosti', 'main', 7),
  ('replacing-volume-switch', 'Замена переключателя громкости', 'Replacing the volume switch', 'Výměna přepínače hlasitosti', 'main', 8),
  ('replacing-power-connector', 'Замена разъема питания', 'Replacing the power connector', 'Výměna napájecího konektoru', 'main', 9),
  ('replacing-microphone', 'Замена микрофона', 'Replacing the microphone', 'Výměna mikrofonu', 'main', 10),
  ('replacing-loudspeaker', 'Замена громкоговорителя', 'Replacing the loudspeaker', 'Výměna reproduktoru', 'main', 11),
  ('ear-speaker-replacement', 'Замена разговорного динамика', 'Ear speaker replacement', 'Výměna sluchátkového reproduktoru', 'main', 12),
  ('rear-camera-replacement', 'Замена задней камеры', 'Rear camera replacement', 'Výměna zadní kamery', 'main', 13),
  ('rear-camera-glass-replacement', 'Замена стекла задней камеры', 'Rear camera glass replacement', 'Výměna skla zadní kamery', 'main', 14),
  ('front-camera-replacement', 'Замена передней камеры', 'Front camera replacement', 'Výměna přední kamery', 'main', 15),
  ('frame-straightening', 'Выравнивание рамки', 'Frame straightening', 'Narovnání rámu', 'main', 16),
  ('repair-liquid-ingress', 'Ремонт после попадания жидкости', 'Repair after liquid ingress', 'Oprava po vniknutí tekutiny', 'main', 17),
  ('motherboard-repair', 'Ремонт материнской платы', 'Motherboard repair', 'Oprava základní desky', 'main', 18),
  ('software-recovery', 'Программное обеспечение (восстановление, разблокировка)', 'Software (recovery, unblocking)', 'Software (obnova, odemknutí)', 'main', 19);

-- Дополнительные услуги (5 штук)
INSERT INTO services (slug, name_ru, name_en, name_cz, service_type, "order") VALUES
  ('glass-foil-installation', 'Профессиональная установка стекла/пленки', 'Professional installation of glass/foil', 'Profesionální nalepení skla/fólie', 'extra', 20),
  ('glass-foil-whole-body', 'Профессиональная установка стекла/пленки на весь корпус', 'Professional installation of glass/foil on whole body', 'Profesionální nalepení skla/fólie na celé tělo', 'extra', 21),
  ('mechanical-cleaning', 'Механическая чистка (продлевает срок службы)', 'Mechanical cleaning (prolongs service life)', 'Mechanické čištění (prodlužuje životnost)', 'extra', 22),
  ('service-report', 'Выдача сервисного отчета', 'Issuance of service report', 'Vydání servisního protokolu', 'extra', 23),
  ('sim-card-cutting', 'Вырезание SIM-карты меньшего размера', 'Cutting out the SIM card to smaller size', 'Vystřihnutí SIM karty na menší velikost', 'extra', 24);

-- ============================================================================
-- 4. СКИДКИ (5 видов)
-- ============================================================================

INSERT INTO discounts (name_ru, name_en, name_cz, discount_type, value, conditions_ru, conditions_en, conditions_cz, active) VALUES
  ('Скидка подписчикам Facebook', 'Facebook followers discount', 'Sleva pro sledující na Facebooku', 'percentage', 5, 'Скидка 5% для подписчиков страницы Facebook', '5% discount for Facebook page followers', 'Sleva 5% pro sledující na Facebooku', true),
  ('Студенческая скидка', 'Student discount', 'Sleva pro studenty', 'percentage', 10, 'Скидка 10% для студентов (при предъявлении студенческого билета)', '10% discount for students (with valid student ID)', 'Sleva 10% pro studenty (při předložení průkazu)', true),
  ('Скидка на множественный ремонт', 'Bulk discount', 'Sleva při více opravách', 'percentage', 0, 'Скидка при ремонте нескольких устройств одновременно', 'Discount when repairing multiple devices at once', 'Sleva při opravě více zařízení najednou', true),
  ('Скидка на следующий ремонт', 'Discount on next purchase', 'Sleva na další opravu', 'percentage', 10, 'Скидка 10% на следующий ремонт', '10% discount on next repair', 'Sleva 10% na další opravu', true),
  ('Бесплатное приложение после ремонта', 'Free app after any repair', 'Zdarma aplikace po jakékoliv opravě', 'bonus', 1, 'Бесплатное приложение (+1) после любого ремонта', 'Free application (+1) after any repair', 'Zdarma aplikace (+1) po jakékoliv opravě', true);

-- ============================================================================
-- ИТОГО:
-- - 4 категории
-- - 108 моделей (40 iPhone + 24 iPad + 27 Mac + 17 Watch)
-- - 24 услуги (19 основных + 5 дополнительных)
-- - 5 скидок
-- ============================================================================
