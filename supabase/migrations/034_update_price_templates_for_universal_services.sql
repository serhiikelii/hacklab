-- Migration: Update price templates to use universal service slugs
-- Description: Replace hardcoded old slugs (iphone-battery) with universal slugs (battery-replacement)
--              This ensures future price population works with new unified structure
-- Depends on: 032_unify_services_structure.sql
-- Author: Blueprint Architect
-- Date: 2025-11-23

-- ============================================================================
-- PROBLEM:
-- Migration 010_add_prices_data.sql contains 71 INSERT blocks with hardcoded
-- old service slugs like 'iphone-battery', 'ipad-battery', etc.
--
-- After unification (migration 032), these slugs are replaced with universal
-- slugs like 'battery-replacement'. This migration doesn't change old data,
-- but provides helper functions for FUTURE price population.
-- ============================================================================

-- ============================================================================
-- SOLUTION: Helper functions for price population with universal slugs
-- ============================================================================

-- Function: Get universal service ID by category and service type
CREATE OR REPLACE FUNCTION get_universal_service_id(
  p_category_slug TEXT,
  p_service_type TEXT  -- 'battery', 'display', 'water-damage', etc.
) RETURNS UUID AS $$
DECLARE
  v_service_id UUID;
  v_universal_slug TEXT;
BEGIN
  -- Map service type to universal slug
  v_universal_slug := CASE p_service_type
    WHEN 'battery' THEN 'battery-replacement'
    WHEN 'water-damage' THEN 'water-damage-recovery'
    WHEN 'display' THEN 'display-replacement'
    WHEN 'display-original-prc' THEN 'iphone-display-original-prc' -- iPhone-specific, not unified
    WHEN 'glass' THEN 'glass-replacement'
    WHEN 'digitizer' THEN 'digitizer-replacement'
    WHEN 'charging-port' THEN 'charging-port-replacement'
    WHEN 'back-glass' THEN 'iphone-back-glass' -- iPhone-specific
    WHEN 'housing' THEN 'iphone-housing' -- iPhone-specific
    WHEN 'camera-main' THEN 'iphone-camera-main' -- iPhone-specific
    WHEN 'charging-cable' THEN 'iphone-charging-cable' -- iPhone-specific
    WHEN 'keyboard' THEN 'macbook-keyboard' -- MacBook-specific
    WHEN 'thermal-paste' THEN 'macbook-thermal-paste' -- MacBook-specific
    WHEN 'nfc' THEN 'watch-nfc' -- Watch-specific
    ELSE NULL
  END;

  IF v_universal_slug IS NULL THEN
    RAISE EXCEPTION 'Unknown service type: %', p_service_type;
  END IF;

  -- Get service ID
  SELECT id INTO v_service_id
  FROM services
  WHERE slug = v_universal_slug;

  IF v_service_id IS NULL THEN
    RAISE EXCEPTION 'Service not found: %', v_universal_slug;
  END IF;

  RETURN v_service_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Bulk insert prices for a device series with universal services
CREATE OR REPLACE FUNCTION insert_prices_for_series(
  p_series TEXT,
  p_category_slug TEXT,
  p_prices JSONB  -- {"battery": 2170, "display": 5700, "water-damage": 2100, ...}
) RETURNS INT AS $$
DECLARE
  v_service_type TEXT;
  v_price NUMERIC;
  v_service_id UUID;
  v_inserted INT := 0;
  v_row_count INT;
BEGIN
  -- Iterate over all services in JSONB
  FOR v_service_type, v_price IN
    SELECT key, value::numeric FROM jsonb_each_text(p_prices)
  LOOP
    -- Get universal service ID
    v_service_id := get_universal_service_id(p_category_slug, v_service_type);

    -- Insert prices for all models in series
    INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
    SELECT
      dm.id,
      v_service_id,
      v_price,
      CASE WHEN v_service_type = 'water-damage' THEN 'from'::price_type_enum ELSE 'fixed'::price_type_enum END,
      60,
      24
    FROM device_models dm
    JOIN device_categories dc ON dm.category_id = dc.id
    WHERE dm.series = p_series
      AND dc.slug = p_category_slug
    ON CONFLICT (model_id, service_id) DO NOTHING;

    GET DIAGNOSTICS v_row_count = ROW_COUNT;
    v_inserted := v_inserted + v_row_count;
  END LOOP;

  RETURN v_inserted;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- USAGE EXAMPLES (commented out - for reference)
-- ============================================================================

/*
-- Example 1: Add prices for iPhone 17 series
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

-- Example 2: Add prices for iPad Pro 12.9"
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

-- Example 3: Add prices for MacBook Air M2
SELECT insert_prices_for_series(
  'MacBook Air M2',
  'macbook',
  '{
    "display": 11970,
    "battery": 4970,
    "keyboard": 5970,
    "thermal-paste": 2970
  }'::jsonb
);

-- Example 4: Add prices for Apple Watch Ultra
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
*/

-- ============================================================================
-- VERIFICATION: Test helper functions work correctly
-- ============================================================================

DO $$
DECLARE
  battery_id UUID;
  display_id UUID;
BEGIN
  -- Test get_universal_service_id function
  battery_id := get_universal_service_id('iphone', 'battery');
  display_id := get_universal_service_id('iphone', 'display');

  RAISE NOTICE 'Battery service ID: %', battery_id;
  RAISE NOTICE 'Display service ID: %', display_id;

  IF battery_id IS NULL OR display_id IS NULL THEN
    RAISE EXCEPTION 'Helper functions failed to retrieve service IDs';
  END IF;

  RAISE NOTICE 'Helper functions verified successfully!';
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON FUNCTION get_universal_service_id IS 'Get universal service ID by category and service type. Use for price population after unification.';
COMMENT ON FUNCTION insert_prices_for_series IS 'Bulk insert prices for a device series using universal service slugs. Accepts JSONB with service types and prices.';

-- ============================================================================
-- NOTES FOR FUTURE MIGRATIONS
-- ============================================================================

-- Instead of hardcoding slugs like this (OLD WAY):
--   WHEN 'iphone-battery' THEN 2170
--
-- Use helper function (NEW WAY):
--   SELECT insert_prices_for_series('iPhone 18', 'iphone', '{"battery": 2300, ...}'::jsonb);
--
-- Benefits:
-- 1. Works with universal slugs automatically
-- 2. Less code duplication
-- 3. Easier to maintain
-- 4. Type-safe through function validation
