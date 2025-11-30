-- Migration: Add iPhone and iPad models
-- Description: Adding missing iPhone models (iPhone 17 series to iPhone SE) and all iPad models

-- ============================================
-- iPhone Models
-- ============================================

-- Get iPhone category_id (assuming it exists from seed data)
DO $$
DECLARE
  v_iphone_category_id UUID;
BEGIN
  SELECT id INTO v_iphone_category_id
  FROM device_categories
  WHERE slug = 'iphone';

  -- iPhone 17 series (2025)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
  (v_iphone_category_id, 'iphone-17-pro-max', 'iPhone 17 Pro Max', 'iPhone 17', 2025, 1),
  (v_iphone_category_id, 'iphone-17-pro', 'iPhone 17 Pro', 'iPhone 17', 2025, 2),
  (v_iphone_category_id, 'iphone-air', 'iPhone Air', 'iPhone 17', 2025, 3),
  (v_iphone_category_id, 'iphone-17', 'iPhone 17', 'iPhone 17', 2025, 4),

  -- iPhone 16 series (2024)
  (v_iphone_category_id, 'iphone-16e', 'iPhone 16e', 'iPhone 16', 2024, 5),
  (v_iphone_category_id, 'iphone-16-pro-max', 'iPhone 16 Pro Max', 'iPhone 16', 2024, 6),
  (v_iphone_category_id, 'iphone-16-pro', 'iPhone 16 Pro', 'iPhone 16', 2024, 7),
  (v_iphone_category_id, 'iphone-16-plus', 'iPhone 16 Plus', 'iPhone 16', 2024, 8),
  (v_iphone_category_id, 'iphone-16', 'iPhone 16', 'iPhone 16', 2024, 9),

  -- iPhone 15 series (2023)
  (v_iphone_category_id, 'iphone-15-pro-max', 'iPhone 15 Pro Max', 'iPhone 15', 2023, 10),
  (v_iphone_category_id, 'iphone-15-pro', 'iPhone 15 Pro', 'iPhone 15', 2023, 11),
  (v_iphone_category_id, 'iphone-15-plus', 'iPhone 15 Plus', 'iPhone 15', 2023, 12),
  (v_iphone_category_id, 'iphone-15', 'iPhone 15', 'iPhone 15', 2023, 13),

  -- iPhone 14 series (2022)
  (v_iphone_category_id, 'iphone-14-pro-max', 'iPhone 14 Pro Max', 'iPhone 14', 2022, 14),
  (v_iphone_category_id, 'iphone-14-pro', 'iPhone 14 Pro', 'iPhone 14', 2022, 15),
  (v_iphone_category_id, 'iphone-14-plus', 'iPhone 14 Plus', 'iPhone 14', 2022, 16),
  (v_iphone_category_id, 'iphone-14', 'iPhone 14', 'iPhone 14', 2022, 17),

  -- iPhone 13 series (2021)
  (v_iphone_category_id, 'iphone-13-pro-max', 'iPhone 13 Pro Max', 'iPhone 13', 2021, 18),
  (v_iphone_category_id, 'iphone-13-pro', 'iPhone 13 Pro', 'iPhone 13', 2021, 19),
  (v_iphone_category_id, 'iphone-13', 'iPhone 13', 'iPhone 13', 2021, 20),
  (v_iphone_category_id, 'iphone-13-mini', 'iPhone 13 mini', 'iPhone 13', 2021, 21),

  -- iPhone 12 series (2020)
  (v_iphone_category_id, 'iphone-12-pro-max', 'iPhone 12 Pro Max', 'iPhone 12', 2020, 22),
  (v_iphone_category_id, 'iphone-12-pro', 'iPhone 12 Pro', 'iPhone 12', 2020, 23),
  (v_iphone_category_id, 'iphone-12', 'iPhone 12', 'iPhone 12', 2020, 24),
  (v_iphone_category_id, 'iphone-12-mini', 'iPhone 12 mini', 'iPhone 12', 2020, 25),

  -- iPhone 11 series (2019)
  (v_iphone_category_id, 'iphone-11-pro-max', 'iPhone 11 Pro Max', 'iPhone 11', 2019, 26),
  (v_iphone_category_id, 'iphone-11-pro', 'iPhone 11 Pro', 'iPhone 11', 2019, 27),
  (v_iphone_category_id, 'iphone-11', 'iPhone 11', 'iPhone 11', 2019, 28),

  -- iPhone X series (2017-2018)
  (v_iphone_category_id, 'iphone-xr', 'iPhone XR', 'iPhone X', 2018, 29),
  (v_iphone_category_id, 'iphone-xs-max', 'iPhone XS Max', 'iPhone X', 2018, 30),
  (v_iphone_category_id, 'iphone-xs', 'iPhone XS', 'iPhone X', 2018, 31),
  (v_iphone_category_id, 'iphone-x', 'iPhone X', 'iPhone X', 2017, 32),

  -- iPhone 8 series (2017)
  (v_iphone_category_id, 'iphone-8-plus', 'iPhone 8 Plus', 'iPhone 8', 2017, 33),
  (v_iphone_category_id, 'iphone-8', 'iPhone 8', 'iPhone 8', 2017, 34),

  -- iPhone SE series
  (v_iphone_category_id, 'iphone-se-2022', 'iPhone SE (2022)', 'iPhone SE', 2022, 35),
  (v_iphone_category_id, 'iphone-se-2020', 'iPhone SE (2020)', 'iPhone SE', 2020, 36)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- ============================================
-- iPad Models
-- ============================================

DO $$
DECLARE
  v_ipad_category_id UUID;
BEGIN
  SELECT id INTO v_ipad_category_id
  FROM device_categories
  WHERE slug = 'ipad';

  -- iPad Pro 13" (2024)
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
  (v_ipad_category_id, 'ipad-pro-13-2024', 'iPad Pro 13" (2024) (A2925,A2926,A3007)', 'iPad Pro', 2024, 1),

  -- iPad Pro 12.9" models
  (v_ipad_category_id, 'ipad-pro-12-9-2022', 'iPad Pro 12,9″ (2022) (A2436,A2764,A2437,A2766)', 'iPad Pro', 2022, 2),
  (v_ipad_category_id, 'ipad-pro-12-9-2021', 'iPad Pro 12,9″ (2021) (A2378,A2461,A2379,A2462)', 'iPad Pro', 2021, 3),
  (v_ipad_category_id, 'ipad-pro-12-9-2020', 'iPad Pro 12,9″ (2020) (A2229,A2069,A2232,A2233)', 'iPad Pro', 2020, 4),
  (v_ipad_category_id, 'ipad-pro-12-9-2018', 'iPad Pro 12,9″ (2018) (A1876,A2014,A1895,A1983)', 'iPad Pro', 2018, 5),
  (v_ipad_category_id, 'ipad-pro-12-9-2017', 'iPad Pro 12,9″ (2017) (A1670,A1671,A1821)', 'iPad Pro', 2017, 6),
  (v_ipad_category_id, 'ipad-pro-12-9-2015', 'iPad Pro 12,9″ (2015) (A1584,A1652)', 'iPad Pro', 2015, 7),

  -- iPad Pro 11" models
  (v_ipad_category_id, 'ipad-pro-11-2024', 'iPad Pro 11" (2024) (A2836,A2837,A3006)', 'iPad Pro', 2024, 8),
  (v_ipad_category_id, 'ipad-pro-11-2022', 'iPad Pro 11″ (2022) (A2759,A2435,A2761,A2762)', 'iPad Pro', 2022, 9),
  (v_ipad_category_id, 'ipad-pro-11-2021', 'iPad Pro 11″ (2021) (A2377,A2459,A2301,A2460)', 'iPad Pro', 2021, 10),
  (v_ipad_category_id, 'ipad-pro-11-2020', 'iPad Pro 11″ (2020) (A2228,A2068,A2230,A2231)', 'iPad Pro', 2020, 11),
  (v_ipad_category_id, 'ipad-pro-11-2018', 'iPad Pro 11″ (2018) (A1980,A2013,A1934,A1979)', 'iPad Pro', 2018, 12),

  -- iPad Pro 10.5" and 9.7"
  (v_ipad_category_id, 'ipad-pro-10-5', 'iPad Pro 10,5″ (A1701,A1709,A1852)', 'iPad Pro', 2017, 13),
  (v_ipad_category_id, 'ipad-pro-9-7', 'iPad Pro 9,7″ (A1673,A1674,A1675)', 'iPad Pro', 2016, 14),

  -- iPad mini models
  (v_ipad_category_id, 'ipad-mini-7', 'iPad mini 7 (A2993,A2995,A2996)', 'iPad mini', 2024, 15),
  (v_ipad_category_id, 'ipad-mini-6', 'iPad mini 6 (A2567,A2568,A2569)', 'iPad mini', 2021, 16),
  (v_ipad_category_id, 'ipad-mini-5', 'iPad mini 5 (A2133,A2124,A2126,A2125)', 'iPad mini', 2019, 17),
  (v_ipad_category_id, 'ipad-mini-4', 'iPad mini 4 (A1538,A1550)', 'iPad mini', 2015, 18),

  -- iPad Air 13" and 11" (2024)
  (v_ipad_category_id, 'ipad-air-13-2024', 'iPad Air 13" (2024) (A2898,A2899,A2900)', 'iPad Air', 2024, 19),
  (v_ipad_category_id, 'ipad-air-11-2024', 'iPad Air 11" (2024) (A2902,A2903,A2904)', 'iPad Air', 2024, 20),

  -- iPad Air 5-2
  (v_ipad_category_id, 'ipad-air-5', 'iPad Air 5 (A2588,A2589,A2591)', 'iPad Air', 2022, 21),
  (v_ipad_category_id, 'ipad-air-4', 'iPad Air 4 (A2316,A2324,A2325,A2072)', 'iPad Air', 2020, 22),
  (v_ipad_category_id, 'ipad-air-3', 'iPad Air 3 (A2152,A2123,A2153,A2154)', 'iPad Air', 2019, 23),
  (v_ipad_category_id, 'ipad-air-2', 'iPad Air 2 (A1566,A1567)', 'iPad Air', 2014, 24),
  (v_ipad_category_id, 'ipad-air', 'iPad Air (A1474,A1475,A1476)', 'iPad Air', 2013, 25),

  -- Standard iPad models
  (v_ipad_category_id, 'ipad-10-2022', 'iPad 10 (2022) (A2696,A2757,A2777)', 'iPad', 2022, 26),
  (v_ipad_category_id, 'ipad-9-2021', 'iPad 9 (2021) (A2602,A2604,A2603,A2605)', 'iPad', 2021, 27),
  (v_ipad_category_id, 'ipad-8-2020', 'iPad 8 (2020) (A2270,A2428,A2429,A2430)', 'iPad', 2020, 28),
  (v_ipad_category_id, 'ipad-7-2019', 'iPad 7 (2019) (A2197,A2200,A2198)', 'iPad', 2019, 29),
  (v_ipad_category_id, 'ipad-6-2018', 'iPad 6 (2018) (A1893,A1954)', 'iPad', 2018, 30),
  (v_ipad_category_id, 'ipad-5-2017', 'iPad 5 (2017) (A1822,A1823)', 'iPad', 2017, 31)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- ============================================
-- Add indexes for better performance
-- ============================================

-- Index for searching models by series
CREATE INDEX IF NOT EXISTS idx_device_models_series ON device_models(series);

-- Index for filtering by release year
CREATE INDEX IF NOT EXISTS idx_device_models_release_year ON device_models(release_year DESC);
