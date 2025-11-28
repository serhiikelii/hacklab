-- Migration: SIMPLE Unification - Clean Approach (prices will be recreated)
-- Description: Remove ALL old category-specific services, create universal ones
--              Prices will be DELETED and recreated later using helper functions
-- Risk Level: LOW - We don't care about preserving prices (they'll be recreated)
-- Use this INSTEAD of 032 if you want clean simple approach
-- Author: Blueprint Architect
-- Date: 2025-11-23

-- ============================================================================
-- PHILOSOPHY: Clean slate approach
-- ============================================================================
-- Instead of complex migration of ~800 prices records, we:
-- 1. DELETE all old category-specific services
-- 2. CREATE clean universal services
-- 3. SET UP proper category_services links
-- 4. Prices will be recreated later using 034 helper functions
-- ============================================================================

-- ============================================================================
-- STEP 1: DELETE ALL PRICES (clean slate)
-- ============================================================================

DO $$
DECLARE
  deleted_prices INT;
BEGIN
  RAISE NOTICE '=== CLEAN APPROACH: Deleting all prices ===';
  RAISE NOTICE 'Prices will be recreated later using helper functions from migration 034';

  DELETE FROM prices;

  GET DIAGNOSTICS deleted_prices = ROW_COUNT;
  RAISE NOTICE 'Deleted % price records', deleted_prices;
END $$;

-- ============================================================================
-- STEP 2: DELETE OLD CATEGORY_SERVICES LINKS
-- ============================================================================

DO $$
DECLARE
  deleted_links INT;
BEGIN
  RAISE NOTICE 'Deleting old category_services links...';

  -- Delete links to old services
  DELETE FROM category_services
  WHERE service_id IN (
    SELECT id FROM services WHERE slug IN (
      'iphone-battery', 'ipad-battery', 'macbook-battery', 'watch-battery',
      'iphone-water-damage', 'ipad-water-damage',
      'iphone-display-analog', 'ipad-display-original', 'macbook-display', 'watch-display',
      'ipad-glass', 'watch-glass',
      'ipad-digitizer', 'watch-digitizer',
      'ipad-charging-port'
    )
  );

  GET DIAGNOSTICS deleted_links = ROW_COUNT;
  RAISE NOTICE 'Deleted % old category_services links', deleted_links;
END $$;

-- ============================================================================
-- STEP 3: DELETE OLD SERVICES
-- ============================================================================

DO $$
DECLARE
  deleted_services INT;
BEGIN
  RAISE NOTICE 'Deleting old category-specific services...';

  DELETE FROM services
  WHERE slug IN (
    'iphone-battery', 'ipad-battery', 'macbook-battery', 'watch-battery',
    'iphone-water-damage', 'ipad-water-damage',
    'iphone-display-analog', 'ipad-display-original', 'macbook-display', 'watch-display',
    'ipad-glass', 'watch-glass',
    'ipad-digitizer', 'watch-digitizer',
    'ipad-charging-port'
  );

  GET DIAGNOSTICS deleted_services = ROW_COUNT;
  RAISE NOTICE 'Deleted % old services', deleted_services;
END $$;

-- ============================================================================
-- STEP 4: CREATE UNIVERSAL SERVICES
-- ============================================================================

-- Universal service: battery-replacement
INSERT INTO services (slug, name_ru, name_en, name_cz, service_type, "order")
VALUES ('battery-replacement', 'Замена аккумулятора', 'Battery Replacement', 'Výměna baterie', 'main', 10)
ON CONFLICT (slug) DO NOTHING;

-- Universal service: water-damage-recovery
INSERT INTO services (slug, name_ru, name_en, name_cz, service_type, "order")
VALUES ('water-damage-recovery', 'Восстановление от повреждения водой', 'Water Damage Recovery', 'Obnova po poškození vodou', 'main', 20)
ON CONFLICT (slug) DO NOTHING;

-- Universal service: display-replacement
INSERT INTO services (slug, name_ru, name_en, name_cz, service_type, "order")
VALUES ('display-replacement', 'Замена дисплея', 'Display Replacement', 'Výměna displeje', 'main', 30)
ON CONFLICT (slug) DO NOTHING;

-- Universal service: glass-replacement
INSERT INTO services (slug, name_ru, name_en, name_cz, service_type, "order")
VALUES ('glass-replacement', 'Замена стекла', 'Glass Replacement', 'Výměna skla', 'main', 40)
ON CONFLICT (slug) DO NOTHING;

-- Universal service: digitizer-replacement
INSERT INTO services (slug, name_ru, name_en, name_cz, service_type, "order")
VALUES ('digitizer-replacement', 'Замена сенсора', 'Digitizer Replacement', 'Výměna senzoru', 'main', 50)
ON CONFLICT (slug) DO NOTHING;

-- Universal service: charging-port-replacement
INSERT INTO services (slug, name_ru, name_en, name_cz, service_type, "order")
VALUES ('charging-port-replacement', 'Замена разъема зарядки', 'Charging Port Replacement', 'Výměna nabíjecího portu', 'main', 60)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- STEP 5: LINK UNIVERSAL SERVICES TO CATEGORIES
-- ============================================================================

DO $$
DECLARE
  iphone_id UUID;
  ipad_id UUID;
  macbook_id UUID;
  watch_id UUID;
BEGIN
  RAISE NOTICE 'Linking universal services to categories...';

  -- Get category IDs
  SELECT id INTO iphone_id FROM device_categories WHERE slug = 'iphone';
  SELECT id INTO ipad_id FROM device_categories WHERE slug = 'ipad';
  SELECT id INTO macbook_id FROM device_categories WHERE slug = 'macbook';
  SELECT id INTO watch_id FROM device_categories WHERE slug = 'apple-watch';

  -- Link battery-replacement to ALL categories
  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT iphone_id, id, true FROM services WHERE slug = 'battery-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT ipad_id, id, true FROM services WHERE slug = 'battery-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT macbook_id, id, true FROM services WHERE slug = 'battery-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT watch_id, id, true FROM services WHERE slug = 'battery-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  -- Link water-damage-recovery to iPhone and iPad
  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT iphone_id, id, true FROM services WHERE slug = 'water-damage-recovery'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT ipad_id, id, true FROM services WHERE slug = 'water-damage-recovery'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  -- Link display-replacement to ALL categories
  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT iphone_id, id, true FROM services WHERE slug = 'display-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT ipad_id, id, true FROM services WHERE slug = 'display-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT macbook_id, id, true FROM services WHERE slug = 'display-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT watch_id, id, true FROM services WHERE slug = 'display-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  -- Link glass-replacement to iPad and Watch
  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT ipad_id, id, true FROM services WHERE slug = 'glass-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT watch_id, id, true FROM services WHERE slug = 'glass-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  -- Link digitizer-replacement to iPad and Watch
  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT ipad_id, id, true FROM services WHERE slug = 'digitizer-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT watch_id, id, true FROM services WHERE slug = 'digitizer-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  -- Link charging-port-replacement to iPad
  INSERT INTO category_services (category_id, service_id, is_active)
  SELECT ipad_id, id, true FROM services WHERE slug = 'charging-port-replacement'
  ON CONFLICT (category_id, service_id) DO UPDATE SET is_active = true;

  RAISE NOTICE '✅ Universal services linked to categories';
END $$;

-- ============================================================================
-- STEP 6: VERIFICATION
-- ============================================================================

DO $$
DECLARE
  universal_services_count INT;
  category_links_count INT;
  old_services_count INT;
BEGIN
  RAISE NOTICE '=== VERIFICATION ===';

  -- Count universal services
  SELECT COUNT(*) INTO universal_services_count
  FROM services
  WHERE slug IN (
    'battery-replacement', 'water-damage-recovery', 'display-replacement',
    'glass-replacement', 'digitizer-replacement', 'charging-port-replacement'
  );

  -- Count category links
  SELECT COUNT(*) INTO category_links_count
  FROM category_services
  WHERE is_active = true;

  -- Check no old services remain
  SELECT COUNT(*) INTO old_services_count
  FROM services
  WHERE slug IN (
    'iphone-battery', 'ipad-battery', 'macbook-battery', 'watch-battery'
  );

  RAISE NOTICE 'Universal services created: %', universal_services_count;
  RAISE NOTICE 'Active category links: %', category_links_count;
  RAISE NOTICE 'Old services remaining: %', old_services_count;

  IF universal_services_count = 6 AND old_services_count = 0 THEN
    RAISE NOTICE '✅ SUCCESS: Clean unification completed!';
  ELSE
    RAISE WARNING 'Verification failed! Check results above.';
  END IF;
END $$;

-- ============================================================================
-- NEXT STEPS
-- ============================================================================

-- After this migration, run:
-- 1. Migration 034 (helper functions)
-- 2. Use insert_prices_for_series() to recreate prices

-- Example: Recreate prices for iPhone models
/*
SELECT insert_prices_for_series(
  'iPhone 16',
  'iphone',
  '{
    "display-original-prc": 6470,
    "display": 5470,
    "battery": 2070,
    "back-glass": 3270,
    "water-damage": 2000
  }'::jsonb
);
*/

RAISE NOTICE '';
RAISE NOTICE '=== NEXT STEPS ===';
RAISE NOTICE '1. Run migration 034 to create helper functions';
RAISE NOTICE '2. Use insert_prices_for_series() to populate prices';
RAISE NOTICE '3. Check UI to ensure everything works';
