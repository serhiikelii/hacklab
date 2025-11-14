-- Migration: Add price data for all device models
-- This populates the prices table with actual pricing for services

-- ==========================================
-- UNIVERSAL PRICE TEMPLATES BY DEVICE TYPE
-- ==========================================

-- iPhone 17 series (2025) - premium pricing
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 6700
    WHEN 'iphone-display-analog' THEN 5700
    WHEN 'iphone-battery' THEN 2170
    WHEN 'iphone-back-glass' THEN 3470
    WHEN 'iphone-housing' THEN 4470
    WHEN 'iphone-camera-main' THEN 4070
    WHEN 'iphone-charging-cable' THEN 2370
    WHEN 'iphone-water-damage' THEN 2100
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'iPhone 17'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 16 series except Pro models
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 5870
    WHEN 'iphone-display-analog' THEN 4870
    WHEN 'iphone-battery' THEN 2070
    WHEN 'iphone-back-glass' THEN 2670
    WHEN 'iphone-housing' THEN 3670
    WHEN 'iphone-camera-main' THEN 3270
    WHEN 'iphone-charging-cable' THEN 2270
    WHEN 'iphone-water-damage' THEN 2000
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'iPhone 16'
  AND dm.slug NOT IN ('iphone-16-pro-max', 'iphone-16-pro')
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 16 Pro Max prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id as model_id,
  s.id as service_id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 6470
    WHEN 'iphone-display-analog' THEN 5470
    WHEN 'iphone-battery' THEN 2070
    WHEN 'iphone-back-glass' THEN 3270
    WHEN 'iphone-housing' THEN 4270
    WHEN 'iphone-camera-main' THEN 3870
    WHEN 'iphone-charging-cable' THEN 2270
    WHEN 'iphone-water-damage' THEN 2000
  END as price,
  CASE s.slug
    WHEN 'iphone-water-damage' THEN 'from'::price_type_enum
    ELSE 'fixed'::price_type_enum
  END as price_type,
  60 as duration_minutes,
  24 as warranty_months
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-16-pro-max'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 16 Pro prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 6270
    WHEN 'iphone-display-analog' THEN 5270
    WHEN 'iphone-battery' THEN 2070
    WHEN 'iphone-back-glass' THEN 3070
    WHEN 'iphone-housing' THEN 4070
    WHEN 'iphone-camera-main' THEN 3670
    WHEN 'iphone-charging-cable' THEN 2270
    WHEN 'iphone-water-damage' THEN 2000
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-16-pro'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 15 Pro Max prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 5970
    WHEN 'iphone-display-analog' THEN 4970
    WHEN 'iphone-battery' THEN 1970
    WHEN 'iphone-back-glass' THEN 2970
    WHEN 'iphone-housing' THEN 3770
    WHEN 'iphone-camera-main' THEN 3470
    WHEN 'iphone-charging-cable' THEN 2170
    WHEN 'iphone-water-damage' THEN 1800
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-15-pro-max'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 15 Pro prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 5770
    WHEN 'iphone-display-analog' THEN 4770
    WHEN 'iphone-battery' THEN 1970
    WHEN 'iphone-back-glass' THEN 2770
    WHEN 'iphone-housing' THEN 3570
    WHEN 'iphone-camera-main' THEN 3270
    WHEN 'iphone-charging-cable' THEN 2170
    WHEN 'iphone-water-damage' THEN 1800
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-15-pro'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 14 Pro Max prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 5470
    WHEN 'iphone-display-analog' THEN 4470
    WHEN 'iphone-battery' THEN 1870
    WHEN 'iphone-back-glass' THEN 2570
    WHEN 'iphone-housing' THEN 3370
    WHEN 'iphone-camera-main' THEN 3070
    WHEN 'iphone-charging-cable' THEN 2070
    WHEN 'iphone-water-damage' THEN 1600
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-14-pro-max'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 14 Pro prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 5270
    WHEN 'iphone-display-analog' THEN 4270
    WHEN 'iphone-battery' THEN 1870
    WHEN 'iphone-back-glass' THEN 2370
    WHEN 'iphone-housing' THEN 3170
    WHEN 'iphone-camera-main' THEN 2870
    WHEN 'iphone-charging-cable' THEN 2070
    WHEN 'iphone-water-damage' THEN 1600
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-14-pro'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- ==========================================
-- PRICES FOR IPAD MODELS
-- ==========================================

-- iPad Pro series (ALL) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'ipad-glass' THEN 4500
    WHEN 'ipad-digitizer' THEN 5500
    WHEN 'ipad-display-original' THEN 7000
    WHEN 'ipad-battery' THEN 2500
    WHEN 'ipad-water-damage' THEN 2500
    WHEN 'ipad-charging-port' THEN 2000
  END,
  CASE s.slug WHEN 'ipad-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  90, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'iPad Pro'
  AND s.slug IN ('ipad-glass', 'ipad-digitizer', 'ipad-display-original',
                 'ipad-battery', 'ipad-water-damage', 'ipad-charging-port')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPad Air series (ALL) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'ipad-glass' THEN 4000
    WHEN 'ipad-digitizer' THEN 5000
    WHEN 'ipad-display-original' THEN 6500
    WHEN 'ipad-battery' THEN 2200
    WHEN 'ipad-water-damage' THEN 2200
    WHEN 'ipad-charging-port' THEN 1800
  END,
  CASE s.slug WHEN 'ipad-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  90, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'iPad Air'
  AND s.slug IN ('ipad-glass', 'ipad-digitizer', 'ipad-display-original',
                 'ipad-battery', 'ipad-water-damage', 'ipad-charging-port')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPad mini series (ALL) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'ipad-glass' THEN 3500
    WHEN 'ipad-digitizer' THEN 4500
    WHEN 'ipad-display-original' THEN 6000
    WHEN 'ipad-battery' THEN 2000
    WHEN 'ipad-water-damage' THEN 2000
    WHEN 'ipad-charging-port' THEN 1600
  END,
  CASE s.slug WHEN 'ipad-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  90, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'iPad mini'
  AND s.slug IN ('ipad-glass', 'ipad-digitizer', 'ipad-display-original',
                 'ipad-battery', 'ipad-water-damage', 'ipad-charging-port')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPad (standard) series (ALL) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'ipad-glass' THEN 3200
    WHEN 'ipad-digitizer' THEN 4200
    WHEN 'ipad-display-original' THEN 5500
    WHEN 'ipad-battery' THEN 1800
    WHEN 'ipad-water-damage' THEN 1800
    WHEN 'ipad-charging-port' THEN 1400
  END,
  CASE s.slug WHEN 'ipad-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  90, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'iPad'
  AND s.slug IN ('ipad-glass', 'ipad-digitizer', 'ipad-display-original',
                 'ipad-battery', 'ipad-water-damage', 'ipad-charging-port')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- ==========================================
-- PRICES FOR MACBOOK MODELS
-- ==========================================

-- MacBook Pro 13" M2 prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 12000
    WHEN 'macbook-battery' THEN 4500
    WHEN 'macbook-keyboard' THEN 6000
    WHEN 'macbook-trackpad' THEN 3500
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-13-m2-2022'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Air 13" M2 prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 11000
    WHEN 'macbook-battery' THEN 4000
    WHEN 'macbook-keyboard' THEN 5500
    WHEN 'macbook-trackpad' THEN 3000
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-air-13-m2-2022'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 14" prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 15000
    WHEN 'macbook-battery' THEN 5000
    WHEN 'macbook-keyboard' THEN 6500
    WHEN 'macbook-trackpad' THEN 4000
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-14-2021'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- ==========================================
-- PRICES FOR APPLE WATCH MODELS
-- ==========================================

-- Apple Watch Ultra series (ALL) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'apple-watch-display' THEN 4000
    WHEN 'apple-watch-battery' THEN 1800
  END,
  'fixed'::price_type_enum,
  45, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'Ultra'
  AND s.slug IN ('apple-watch-display', 'apple-watch-battery')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- Apple Watch Series 8 (ALL) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'apple-watch-display' THEN 3500
    WHEN 'apple-watch-battery' THEN 1500
  END,
  'fixed'::price_type_enum,
  45, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'Series 8'
  AND s.slug IN ('apple-watch-display', 'apple-watch-battery')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- Apple Watch Series 7 (ALL) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'apple-watch-display' THEN 3200
    WHEN 'apple-watch-battery' THEN 1400
  END,
  'fixed'::price_type_enum,
  45, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'Series 7'
  AND s.slug IN ('apple-watch-display', 'apple-watch-battery')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- Apple Watch Series 6 (ALL) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'apple-watch-display' THEN 3000
    WHEN 'apple-watch-battery' THEN 1300
  END,
  'fixed'::price_type_enum,
  45, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'Series 6'
  AND s.slug IN ('apple-watch-display', 'apple-watch-battery')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- Apple Watch Series 5 (ALL) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'apple-watch-display' THEN 2800
    WHEN 'apple-watch-battery' THEN 1200
  END,
  'fixed'::price_type_enum,
  45, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'Series 5'
  AND s.slug IN ('apple-watch-display', 'apple-watch-battery')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- Apple Watch Series 4 (ALL) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'apple-watch-display' THEN 2600
    WHEN 'apple-watch-battery' THEN 1100
  END,
  'fixed'::price_type_enum,
  45, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'Series 4'
  AND s.slug IN ('apple-watch-display', 'apple-watch-battery')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- Apple Watch SE 2 (ALL) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'apple-watch-display' THEN 3100
    WHEN 'apple-watch-battery' THEN 1350
  END,
  'fixed'::price_type_enum,
  45, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'SE 2'
  AND s.slug IN ('apple-watch-display', 'apple-watch-battery')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- Apple Watch SE (ALL) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'apple-watch-display' THEN 3000
    WHEN 'apple-watch-battery' THEN 1300
  END,
  'fixed'::price_type_enum,
  45, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'SE'
  AND s.slug IN ('apple-watch-display', 'apple-watch-battery')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- ==========================================
-- ADDITIONAL IPHONE MODELS PRICES
-- ==========================================

-- iPhone 16 Plus prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 6070
    WHEN 'iphone-display-analog' THEN 5070
    WHEN 'iphone-battery' THEN 2070
    WHEN 'iphone-back-glass' THEN 2870
    WHEN 'iphone-housing' THEN 3870
    WHEN 'iphone-camera-main' THEN 3470
    WHEN 'iphone-charging-cable' THEN 2270
    WHEN 'iphone-water-damage' THEN 2000
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-16-plus'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 16 prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 5870
    WHEN 'iphone-display-analog' THEN 4870
    WHEN 'iphone-battery' THEN 2070
    WHEN 'iphone-back-glass' THEN 2670
    WHEN 'iphone-housing' THEN 3670
    WHEN 'iphone-camera-main' THEN 3270
    WHEN 'iphone-charging-cable' THEN 2270
    WHEN 'iphone-water-damage' THEN 2000
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-16'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 15 Plus prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 5670
    WHEN 'iphone-display-analog' THEN 4670
    WHEN 'iphone-battery' THEN 1970
    WHEN 'iphone-back-glass' THEN 2570
    WHEN 'iphone-housing' THEN 3370
    WHEN 'iphone-camera-main' THEN 3070
    WHEN 'iphone-charging-cable' THEN 2170
    WHEN 'iphone-water-damage' THEN 1800
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-15-plus'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 15 prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 5470
    WHEN 'iphone-display-analog' THEN 4470
    WHEN 'iphone-battery' THEN 1970
    WHEN 'iphone-back-glass' THEN 2370
    WHEN 'iphone-housing' THEN 3170
    WHEN 'iphone-camera-main' THEN 2870
    WHEN 'iphone-charging-cable' THEN 2170
    WHEN 'iphone-water-damage' THEN 1800
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-15'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 14 Plus prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 5170
    WHEN 'iphone-display-analog' THEN 4170
    WHEN 'iphone-battery' THEN 1870
    WHEN 'iphone-back-glass' THEN 2170
    WHEN 'iphone-housing' THEN 2970
    WHEN 'iphone-camera-main' THEN 2670
    WHEN 'iphone-charging-cable' THEN 2070
    WHEN 'iphone-water-damage' THEN 1600
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-14-plus'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 14 prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 4970
    WHEN 'iphone-display-analog' THEN 3970
    WHEN 'iphone-battery' THEN 1870
    WHEN 'iphone-back-glass' THEN 1970
    WHEN 'iphone-housing' THEN 2770
    WHEN 'iphone-camera-main' THEN 2470
    WHEN 'iphone-charging-cable' THEN 2070
    WHEN 'iphone-water-damage' THEN 1600
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-14'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 13 Pro Max prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 4870
    WHEN 'iphone-display-analog' THEN 3870
    WHEN 'iphone-battery' THEN 1770
    WHEN 'iphone-back-glass' THEN 1870
    WHEN 'iphone-housing' THEN 2670
    WHEN 'iphone-camera-main' THEN 2370
    WHEN 'iphone-charging-cable' THEN 1970
    WHEN 'iphone-water-damage' THEN 1500
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-13-pro-max'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 13 Pro prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 4670
    WHEN 'iphone-display-analog' THEN 3670
    WHEN 'iphone-battery' THEN 1770
    WHEN 'iphone-back-glass' THEN 1670
    WHEN 'iphone-housing' THEN 2470
    WHEN 'iphone-camera-main' THEN 2170
    WHEN 'iphone-charging-cable' THEN 1970
    WHEN 'iphone-water-damage' THEN 1500
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-13-pro'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 13 prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 4470
    WHEN 'iphone-display-analog' THEN 3470
    WHEN 'iphone-battery' THEN 1770
    WHEN 'iphone-back-glass' THEN 1470
    WHEN 'iphone-housing' THEN 2270
    WHEN 'iphone-camera-main' THEN 1970
    WHEN 'iphone-charging-cable' THEN 1970
    WHEN 'iphone-water-damage' THEN 1500
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-13'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 13 mini prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 4270
    WHEN 'iphone-display-analog' THEN 3270
    WHEN 'iphone-battery' THEN 1770
    WHEN 'iphone-back-glass' THEN 1270
    WHEN 'iphone-housing' THEN 2070
    WHEN 'iphone-camera-main' THEN 1770
    WHEN 'iphone-charging-cable' THEN 1970
    WHEN 'iphone-water-damage' THEN 1500
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-13-mini'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 12 Pro Max prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 4670
    WHEN 'iphone-display-analog' THEN 3670
    WHEN 'iphone-battery' THEN 1670
    WHEN 'iphone-back-glass' THEN 1670
    WHEN 'iphone-housing' THEN 2470
    WHEN 'iphone-camera-main' THEN 2170
    WHEN 'iphone-charging-cable' THEN 1870
    WHEN 'iphone-water-damage' THEN 1400
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-12-pro-max'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 12 Pro prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 4470
    WHEN 'iphone-display-analog' THEN 3470
    WHEN 'iphone-battery' THEN 1670
    WHEN 'iphone-back-glass' THEN 1470
    WHEN 'iphone-housing' THEN 2270
    WHEN 'iphone-camera-main' THEN 1970
    WHEN 'iphone-charging-cable' THEN 1870
    WHEN 'iphone-water-damage' THEN 1400
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-12-pro'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 12 prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 4270
    WHEN 'iphone-display-analog' THEN 3270
    WHEN 'iphone-battery' THEN 1670
    WHEN 'iphone-back-glass' THEN 1270
    WHEN 'iphone-housing' THEN 2070
    WHEN 'iphone-camera-main' THEN 1770
    WHEN 'iphone-charging-cable' THEN 1870
    WHEN 'iphone-water-damage' THEN 1400
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-12'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 12 mini prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 4070
    WHEN 'iphone-display-analog' THEN 3070
    WHEN 'iphone-battery' THEN 1670
    WHEN 'iphone-back-glass' THEN 1070
    WHEN 'iphone-housing' THEN 1870
    WHEN 'iphone-camera-main' THEN 1570
    WHEN 'iphone-charging-cable' THEN 1870
    WHEN 'iphone-water-damage' THEN 1400
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'iphone-12-mini'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 11 series (all models) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 3970
    WHEN 'iphone-display-analog' THEN 2970
    WHEN 'iphone-battery' THEN 1570
    WHEN 'iphone-back-glass' THEN 970
    WHEN 'iphone-housing' THEN 1770
    WHEN 'iphone-camera-main' THEN 1470
    WHEN 'iphone-charging-cable' THEN 1770
    WHEN 'iphone-water-damage' THEN 1300
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'iPhone 11'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone X series (all models) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 3770
    WHEN 'iphone-display-analog' THEN 2770
    WHEN 'iphone-battery' THEN 1470
    WHEN 'iphone-back-glass' THEN 870
    WHEN 'iphone-housing' THEN 1570
    WHEN 'iphone-camera-main' THEN 1270
    WHEN 'iphone-charging-cable' THEN 1670
    WHEN 'iphone-water-damage' THEN 1200
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'iPhone X'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone 8 series (all models) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 3570
    WHEN 'iphone-display-analog' THEN 2570
    WHEN 'iphone-battery' THEN 1370
    WHEN 'iphone-back-glass' THEN 770
    WHEN 'iphone-housing' THEN 1470
    WHEN 'iphone-camera-main' THEN 1170
    WHEN 'iphone-charging-cable' THEN 1570
    WHEN 'iphone-water-damage' THEN 1100
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'iPhone 8'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- iPhone SE series (all models) - bulk insert
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'iphone-display-original-prc' THEN 3370
    WHEN 'iphone-display-analog' THEN 2370
    WHEN 'iphone-battery' THEN 1270
    WHEN 'iphone-back-glass' THEN 670
    WHEN 'iphone-housing' THEN 1270
    WHEN 'iphone-camera-main' THEN 970
    WHEN 'iphone-charging-cable' THEN 1470
    WHEN 'iphone-water-damage' THEN 1000
  END,
  CASE s.slug WHEN 'iphone-water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'iPhone SE'
  AND s.slug IN ('iphone-display-original-prc', 'iphone-display-analog', 'iphone-battery',
                 'iphone-back-glass', 'iphone-housing', 'iphone-camera-main',
                 'iphone-charging-cable', 'iphone-water-damage')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- ==========================================
-- ADDITIONAL MACBOOK MODELS PRICES
-- ==========================================

-- MacBook Pro 16" M4 (A3403) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 18000
    WHEN 'macbook-battery' THEN 6500
    WHEN 'macbook-keyboard' THEN 7500
    WHEN 'macbook-trackpad' THEN 5000
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-16-m4-a3403'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 16" (A2991) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 17500
    WHEN 'macbook-battery' THEN 6000
    WHEN 'macbook-keyboard' THEN 7000
    WHEN 'macbook-trackpad' THEN 4800
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-16-a2991'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 16" (A2780) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 17000
    WHEN 'macbook-battery' THEN 5800
    WHEN 'macbook-keyboard' THEN 6800
    WHEN 'macbook-trackpad' THEN 4600
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-16-a2780'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 16" M1 (A2485) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 16500
    WHEN 'macbook-battery' THEN 5500
    WHEN 'macbook-keyboard' THEN 6500
    WHEN 'macbook-trackpad' THEN 4400
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-16-m1-a2485'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 16" (A2141) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 15500
    WHEN 'macbook-battery' THEN 5200
    WHEN 'macbook-keyboard' THEN 6200
    WHEN 'macbook-trackpad' THEN 4200
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-16-a2141'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 15" (A1990) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 14500
    WHEN 'macbook-battery' THEN 4800
    WHEN 'macbook-keyboard' THEN 5800
    WHEN 'macbook-trackpad' THEN 3800
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-15-a1990'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 15" (A1707) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 13500
    WHEN 'macbook-battery' THEN 4500
    WHEN 'macbook-keyboard' THEN 5500
    WHEN 'macbook-trackpad' THEN 3500
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-15-a1707'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 15" (A1398) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 12500
    WHEN 'macbook-battery' THEN 4200
    WHEN 'macbook-keyboard' THEN 5200
    WHEN 'macbook-trackpad' THEN 3200
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-15-a1398'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 14" M4 (A3401) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 16000
    WHEN 'macbook-battery' THEN 5500
    WHEN 'macbook-keyboard' THEN 7000
    WHEN 'macbook-trackpad' THEN 4500
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-14-m4-a3401'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 14" M4 (A3112) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 15800
    WHEN 'macbook-battery' THEN 5400
    WHEN 'macbook-keyboard' THEN 6900
    WHEN 'macbook-trackpad' THEN 4400
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-14-m4-a3112'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 14" M3 (A2992) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 15500
    WHEN 'macbook-battery' THEN 5200
    WHEN 'macbook-keyboard' THEN 6700
    WHEN 'macbook-trackpad' THEN 4200
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-14-m3-a2992'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 14" M3 (A2918) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 15300
    WHEN 'macbook-battery' THEN 5100
    WHEN 'macbook-keyboard' THEN 6600
    WHEN 'macbook-trackpad' THEN 4100
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-14-m3-a2918'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 14" M2 (A2779) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 15000
    WHEN 'macbook-battery' THEN 5000
    WHEN 'macbook-keyboard' THEN 6500
    WHEN 'macbook-trackpad' THEN 4000
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-14-m2-a2779'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 14" M1 (A2442) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 14500
    WHEN 'macbook-battery' THEN 4800
    WHEN 'macbook-keyboard' THEN 6200
    WHEN 'macbook-trackpad' THEN 3800
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-14-m1-a2442'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 13" M1/M2 (A2338) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 12000
    WHEN 'macbook-battery' THEN 4500
    WHEN 'macbook-keyboard' THEN 6000
    WHEN 'macbook-trackpad' THEN 3500
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-13-m1-m2-a2338'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 13" (A2251,A2289) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 11500
    WHEN 'macbook-battery' THEN 4300
    WHEN 'macbook-keyboard' THEN 5800
    WHEN 'macbook-trackpad' THEN 3300
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-13-a2251-a2289'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 13" (A2159) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 11000
    WHEN 'macbook-battery' THEN 4100
    WHEN 'macbook-keyboard' THEN 5600
    WHEN 'macbook-trackpad' THEN 3100
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-13-a2159'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 13" (A1989) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 10500
    WHEN 'macbook-battery' THEN 3900
    WHEN 'macbook-keyboard' THEN 5400
    WHEN 'macbook-trackpad' THEN 2900
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-13-a1989'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 13" (A1706,A1708) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 10000
    WHEN 'macbook-battery' THEN 3700
    WHEN 'macbook-keyboard' THEN 5200
    WHEN 'macbook-trackpad' THEN 2700
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-13-a1706-a1708'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Pro 13" (A1425,A1502) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 9500
    WHEN 'macbook-battery' THEN 3500
    WHEN 'macbook-keyboard' THEN 5000
    WHEN 'macbook-trackpad' THEN 2500
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-pro-13-a1425-a1502'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Air 15" M3 (A3114) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 13000
    WHEN 'macbook-battery' THEN 4800
    WHEN 'macbook-keyboard' THEN 6200
    WHEN 'macbook-trackpad' THEN 3800
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-air-15-m3-a3114'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Air 15" (A2941) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 12500
    WHEN 'macbook-battery' THEN 4600
    WHEN 'macbook-keyboard' THEN 6000
    WHEN 'macbook-trackpad' THEN 3600
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-air-15-a2941'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Air 13" M3 (A3113) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 11500
    WHEN 'macbook-battery' THEN 4200
    WHEN 'macbook-keyboard' THEN 5700
    WHEN 'macbook-trackpad' THEN 3200
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-air-13-m3-a3113'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Air 13" M2 (A2681) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 11000
    WHEN 'macbook-battery' THEN 4000
    WHEN 'macbook-keyboard' THEN 5500
    WHEN 'macbook-trackpad' THEN 3000
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-air-13-m2-a2681'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Air 13" M1 (A2337) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 10500
    WHEN 'macbook-battery' THEN 3800
    WHEN 'macbook-keyboard' THEN 5300
    WHEN 'macbook-trackpad' THEN 2800
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-air-13-m1-a2337'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Air 13" (A2179) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 10000
    WHEN 'macbook-battery' THEN 3600
    WHEN 'macbook-keyboard' THEN 5100
    WHEN 'macbook-trackpad' THEN 2600
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-air-13-a2179'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Air 13" (A1932) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 9500
    WHEN 'macbook-battery' THEN 3400
    WHEN 'macbook-keyboard' THEN 4900
    WHEN 'macbook-trackpad' THEN 2400
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-air-13-a1932'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Air 13" (A1237,A1304,A1369,A1466) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 9000
    WHEN 'macbook-battery' THEN 3200
    WHEN 'macbook-keyboard' THEN 4700
    WHEN 'macbook-trackpad' THEN 2200
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-air-13-a1237-a1466'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook Air 11" prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 8500
    WHEN 'macbook-battery' THEN 3000
    WHEN 'macbook-keyboard' THEN 4500
    WHEN 'macbook-trackpad' THEN 2000
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-air-11-a1370-a1465'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- MacBook 12" (A1534) prices
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'macbook-display' THEN 10500
    WHEN 'macbook-battery' THEN 3800
    WHEN 'macbook-keyboard' THEN 5300
    WHEN 'macbook-trackpad' THEN 2800
  END,
  'fixed'::price_type_enum,
  120, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.slug = 'macbook-12-a1534'
  AND s.slug IN ('macbook-display', 'macbook-battery', 'macbook-keyboard', 'macbook-trackpad')
ON CONFLICT (model_id, service_id) DO NOTHING;
