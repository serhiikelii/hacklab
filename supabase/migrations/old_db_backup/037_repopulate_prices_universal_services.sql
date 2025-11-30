-- Migration: Repopulate prices with universal services
-- Description: Recreate prices using universal service slugs and same pricing logic as 010
-- Dependencies: 036 (clean unification) + 034 (helper functions)
-- Author: Blueprint Architect
-- Date: 2025-11-23

-- ⚠️ Run this AFTER:
-- 1. Migration 036 (clean unification)
-- 2. Migration 034 (helper functions)

-- ============================================================================
-- PRICING LOGIC (same as 010_add_prices_data.sql but with universal slugs)
-- ============================================================================

-- iPhone 17 series (2025) - premium pricing
SELECT insert_prices_for_series(
  'iPhone 17',
  'iphone',
  '{
    "display-original-prc": 6700,
    "display": 5700,
    "battery": 2170,
    "back-glass": 3470,
    "housing": 4470,
    "camera-main": 4070,
    "charging-cable": 2370,
    "water-damage": 2100
  }'::jsonb
);

-- iPhone 16 series (except Pro models)
DO $$
DECLARE
  iphone_16_models TEXT[] := ARRAY['iphone-16', 'iphone-16-plus', 'iphone-16e'];
  model_slug TEXT;
BEGIN
  FOREACH model_slug IN ARRAY iphone_16_models
  LOOP
    PERFORM insert_prices_for_series(
      (SELECT series FROM device_models WHERE slug = model_slug LIMIT 1),
      'iphone',
      '{
        "display-original-prc": 5870,
        "display": 4870,
        "battery": 2070,
        "back-glass": 2670,
        "housing": 3670,
        "camera-main": 3270,
        "charging-cable": 2270,
        "water-damage": 2000
      }'::jsonb
    );
  END LOOP;
  RAISE NOTICE 'Populated prices for iPhone 16 series (non-Pro)';
END $$;

-- iPhone 16 Pro Max
SELECT insert_prices_for_series(
  'iPhone 16',
  'iphone',
  '{
    "display-original-prc": 6470,
    "display": 5470,
    "battery": 2070,
    "back-glass": 3270,
    "housing": 4270,
    "camera-main": 3870,
    "charging-cable": 2270,
    "water-damage": 2000
  }'::jsonb
) WHERE EXISTS (SELECT 1 FROM device_models WHERE slug = 'iphone-16-pro-max');

-- iPhone 16 Pro
SELECT insert_prices_for_series(
  'iPhone 16',
  'iphone',
  '{
    "display-original-prc": 6270,
    "display": 5270,
    "battery": 2070,
    "back-glass": 3070,
    "housing": 4070,
    "camera-main": 3670,
    "charging-cable": 2270,
    "water-damage": 2000
  }'::jsonb
) WHERE EXISTS (SELECT 1 FROM device_models WHERE slug = 'iphone-16-pro');

-- iPhone 15 series
SELECT insert_prices_for_series(
  'iPhone 15',
  'iphone',
  '{
    "display-original-prc": 5670,
    "display": 4670,
    "battery": 1970,
    "back-glass": 2470,
    "housing": 3470,
    "camera-main": 3070,
    "charging-cable": 2170,
    "water-damage": 1900
  }'::jsonb
);

-- iPhone 14 series
SELECT insert_prices_for_series(
  'iPhone 14',
  'iphone',
  '{
    "display-original-prc": 5270,
    "display": 4270,
    "battery": 1870,
    "back-glass": 2270,
    "housing": 3270,
    "camera-main": 2870,
    "charging-cable": 2070,
    "water-damage": 1800
  }'::jsonb
);

-- iPhone 13 series
SELECT insert_prices_for_series(
  'iPhone 13',
  'iphone',
  '{
    "display-original-prc": 4870,
    "display": 3870,
    "battery": 1770,
    "back-glass": 2070,
    "housing": 3070,
    "camera-main": 2670,
    "charging-cable": 1970,
    "water-damage": 1700
  }'::jsonb
);

-- iPhone 12 series
SELECT insert_prices_for_series(
  'iPhone 12',
  'iphone',
  '{
    "display-original-prc": 4470,
    "display": 3470,
    "battery": 1670,
    "back-glass": 1870,
    "housing": 2870,
    "camera-main": 2470,
    "charging-cable": 1870,
    "water-damage": 1600
  }'::jsonb
);

-- iPhone 11 series
SELECT insert_prices_for_series(
  'iPhone 11',
  'iphone',
  '{
    "display": 3270,
    "battery": 1570,
    "back-glass": 1670,
    "housing": 2670,
    "camera-main": 2270,
    "charging-cable": 1770,
    "water-damage": 1500
  }'::jsonb
);

-- iPhone X/XS series
SELECT insert_prices_for_series(
  'iPhone X',
  'iphone',
  '{
    "display": 2970,
    "battery": 1470,
    "back-glass": 1470,
    "housing": 2470,
    "camera-main": 2070,
    "charging-cable": 1670,
    "water-damage": 1400
  }'::jsonb
);

-- iPhone 8 series
SELECT insert_prices_for_series(
  'iPhone 8',
  'iphone',
  '{
    "display": 2470,
    "battery": 1270,
    "back-glass": 1270,
    "housing": 2270,
    "camera-main": 1870,
    "charging-cable": 1570,
    "water-damage": 1300
  }'::jsonb
);

-- iPhone 7 and older
SELECT insert_prices_for_series(
  'iPhone 7',
  'iphone',
  '{
    "display": 1970,
    "battery": 1170,
    "housing": 1970,
    "camera-main": 1670,
    "charging-cable": 1470,
    "water-damage": 1200
  }'::jsonb
);

-- ============================================================================
-- iPad Prices
-- ============================================================================

-- iPad Pro models
SELECT insert_prices_for_series(
  'iPad Pro',
  'ipad',
  '{
    "display": 8970,
    "glass": 5970,
    "digitizer": 6970,
    "battery": 3970,
    "water-damage": 3000,
    "charging-port": 1970
  }'::jsonb
);

-- iPad Air models
SELECT insert_prices_for_series(
  'iPad Air',
  'ipad',
  '{
    "display": 6970,
    "glass": 4970,
    "digitizer": 5470,
    "battery": 2970,
    "water-damage": 2500,
    "charging-port": 1770
  }'::jsonb
);

-- iPad mini models
SELECT insert_prices_for_series(
  'iPad mini',
  'ipad',
  '{
    "display": 5970,
    "glass": 3970,
    "digitizer": 4470,
    "battery": 2470,
    "water-damage": 2000,
    "charging-port": 1570
  }'::jsonb
);

-- iPad (standard) models
SELECT insert_prices_for_series(
  'iPad',
  'ipad',
  '{
    "display": 4970,
    "glass": 2970,
    "digitizer": 3470,
    "battery": 1970,
    "water-damage": 1500,
    "charging-port": 1470
  }'::jsonb
);

-- ============================================================================
-- MacBook Prices
-- ============================================================================

-- MacBook Pro 16"
DO $$
BEGIN
  PERFORM insert_prices_for_series(
    series,
    'macbook',
    '{
      "display": 11970,
      "battery": 4970,
      "keyboard": 5970,
      "thermal-paste": 2970
    }'::jsonb
  )
  FROM device_models
  WHERE name LIKE '%16%' AND category_id = (SELECT id FROM device_categories WHERE slug = 'macbook')
  GROUP BY series;
END $$;

-- MacBook Pro 14"
DO $$
BEGIN
  PERFORM insert_prices_for_series(
    series,
    'macbook',
    '{
      "display": 10970,
      "battery": 4470,
      "keyboard": 5470,
      "thermal-paste": 2670
    }'::jsonb
  )
  FROM device_models
  WHERE name LIKE '%14%' AND category_id = (SELECT id FROM device_categories WHERE slug = 'macbook')
  GROUP BY series;
END $$;

-- MacBook Air
SELECT insert_prices_for_series(
  'MacBook Air M2',
  'macbook',
  '{
    "display": 8970,
    "battery": 3970,
    "keyboard": 4970,
    "thermal-paste": 2370
  }'::jsonb
);

-- ============================================================================
-- Apple Watch Prices
-- ============================================================================

-- Apple Watch Ultra
SELECT insert_prices_for_series(
  'Ultra',
  'apple-watch',
  '{
    "display": 4970,
    "glass": 2970,
    "digitizer": 3470,
    "battery": 2470,
    "nfc": 1970
  }'::jsonb
);

-- Apple Watch Series 8+
SELECT insert_prices_for_series(
  'Series 8',
  'apple-watch',
  '{
    "display": 3970,
    "glass": 2470,
    "digitizer": 2970,
    "battery": 1970,
    "nfc": 1670
  }'::jsonb
);

-- Apple Watch SE
SELECT insert_prices_for_series(
  'SE',
  'apple-watch',
  '{
    "display": 2970,
    "glass": 1970,
    "digitizer": 2270,
    "battery": 1570,
    "nfc": 1370
  }'::jsonb
);

-- Apple Watch Series 6-7
DO $$
DECLARE
  watch_series TEXT;
BEGIN
  FOR watch_series IN SELECT DISTINCT series FROM device_models
    WHERE series IN ('Series 6', 'Series 7')
    AND category_id = (SELECT id FROM device_categories WHERE slug = 'apple-watch')
  LOOP
    PERFORM insert_prices_for_series(
      watch_series,
      'apple-watch',
      '{
        "display": 2470,
        "glass": 1670,
        "digitizer": 1970,
        "battery": 1370,
        "nfc": 1170
      }'::jsonb
    );
  END LOOP;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
  total_prices INT;
  services_count INT;
BEGIN
  SELECT COUNT(*) INTO total_prices FROM prices;
  SELECT COUNT(DISTINCT service_id) INTO services_count FROM prices;

  RAISE NOTICE '=== PRICES REPOPULATION COMPLETE ===';
  RAISE NOTICE 'Total prices created: %', total_prices;
  RAISE NOTICE 'Services used: %', services_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Next: Check UI to verify everything works!';
END $$;
