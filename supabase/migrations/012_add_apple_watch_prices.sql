-- Migration: Add price data for Apple Watch models
-- This populates the prices table with pricing for Apple Watch repair services

-- ==========================================
-- APPLE WATCH PRICES
-- ==========================================

-- Apple Watch Ultra, Series 9, Series 8 - premium pricing
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'watch-display' THEN 3500
    WHEN 'watch-battery' THEN 2000
    WHEN 'watch-digitizer' THEN 2500
    WHEN 'watch-glass' THEN 1800
    WHEN 'watch-nfc' THEN 1500
  END,
  'fixed'::price_type_enum,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series IN ('Ultra', 'Series 9', 'Series 8')
  AND s.slug IN ('watch-display', 'watch-battery', 'watch-digitizer', 'watch-glass', 'watch-nfc')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- Apple Watch Series 7, Series 6 - mid-range pricing
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'watch-display' THEN 3000
    WHEN 'watch-battery' THEN 1800
    WHEN 'watch-digitizer' THEN 2200
    WHEN 'watch-glass' THEN 1600
    WHEN 'watch-nfc' THEN 1400
  END,
  'fixed'::price_type_enum,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series IN ('Series 7', 'Series 6')
  AND s.slug IN ('watch-display', 'watch-battery', 'watch-digitizer', 'watch-glass', 'watch-nfc')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- Apple Watch SE 2, Series 5, Series 4 - budget pricing
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'watch-display' THEN 2500
    WHEN 'watch-battery' THEN 1500
    WHEN 'watch-digitizer' THEN 2000
    WHEN 'watch-glass' THEN 1400
    WHEN 'watch-nfc' THEN 1200
  END,
  'fixed'::price_type_enum,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series IN ('SE 2', 'Series 5', 'Series 4')
  AND s.slug IN ('watch-display', 'watch-battery', 'watch-digitizer', 'watch-glass', 'watch-nfc')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- Apple Watch SE - budget pricing
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
SELECT
  dm.id, s.id,
  CASE s.slug
    WHEN 'watch-display' THEN 2300
    WHEN 'watch-battery' THEN 1400
    WHEN 'watch-digitizer' THEN 1800
    WHEN 'watch-glass' THEN 1300
    WHEN 'watch-nfc' THEN 1100
  END,
  'fixed'::price_type_enum,
  60, 24
FROM device_models dm
CROSS JOIN services s
WHERE dm.series = 'SE'
  AND s.slug IN ('watch-display', 'watch-battery', 'watch-digitizer', 'watch-glass', 'watch-nfc')
ON CONFLICT (model_id, service_id) DO NOTHING;

-- Verify the data
DO $$
DECLARE
  total_prices INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_prices
  FROM prices p
  JOIN device_models dm ON p.model_id = dm.id
  JOIN device_categories dc ON dm.category_id = dc.id
  WHERE dc.slug = 'apple-watch';

  RAISE NOTICE 'Total Apple Watch prices added: %', total_prices;
END $$;
