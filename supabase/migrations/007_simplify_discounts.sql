-- ================================================================
-- MojService - Simplify Discounts Architecture
-- Migration 007
-- Generated: 2026-01-01
--
-- Changes:
-- 1. Remove is_auto_apply from discounts (all discounts are now automatic)
-- 2. Remove discount_id from announcements (banners are independent)
-- 3. Clean up function get_discounted_price (no need to check is_auto_apply)
--
-- Reasoning:
-- - Discounts table should only contain automatic discounts linked to services
-- - Informational promotions should be handled entirely by announcements table
-- - This simplifies the data model and reduces confusion
-- ================================================================

BEGIN;

-- ================================================================
-- 1. REMOVE is_auto_apply FROM discounts
-- ================================================================

-- Drop the column (all remaining discounts will be automatic)
ALTER TABLE discounts DROP COLUMN IF EXISTS is_auto_apply;

COMMENT ON TABLE discounts IS 'Automatic discounts that apply to specific category-service combinations';

-- ================================================================
-- 2. REMOVE discount_id FROM announcements
-- ================================================================

-- Drop the foreign key constraint first
ALTER TABLE announcements DROP CONSTRAINT IF EXISTS announcements_discount_id_fkey;

-- Drop the column
ALTER TABLE announcements DROP COLUMN IF EXISTS discount_id;

COMMENT ON TABLE announcements IS 'Promotional banners for homepage carousel (independent from discounts)';

-- ================================================================
-- 3. UPDATE get_discounted_price FUNCTION
-- ================================================================

-- Drop old function
DROP FUNCTION IF EXISTS get_discounted_price(UUID, DECIMAL);

-- Recreate without is_auto_apply check (all discounts are automatic now)
CREATE OR REPLACE FUNCTION get_discounted_price(
  p_category_service_id UUID,
  p_original_price DECIMAL
) RETURNS TABLE(
  final_price DECIMAL,
  discount_id UUID,
  discount_value DECIMAL,
  discount_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE
      WHEN d.discount_type = 'percentage' THEN
        p_original_price - (p_original_price * d.value / 100)
      WHEN d.discount_type = 'fixed' THEN
        GREATEST(p_original_price - d.value, 0)
      ELSE p_original_price
    END AS final_price,
    d.id AS discount_id,
    d.value AS discount_value,
    d.discount_type::TEXT AS discount_type
  FROM discounts d
  INNER JOIN discount_category_services dcs ON dcs.discount_id = d.id
  WHERE dcs.category_service_id = p_category_service_id
    AND d.active = TRUE
    AND (d.start_date IS NULL OR CURRENT_DATE >= d.start_date)
    AND (d.end_date IS NULL OR CURRENT_DATE <= d.end_date)
  ORDER BY d.value DESC -- Take maximum discount if multiple exist
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_discounted_price IS 'Calculate final price with active automatic discount for specific category-service combination';

COMMIT;

-- ================================================================
-- VERIFICATION
-- ================================================================

-- Check that columns are removed
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'discounts' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'announcements' AND table_schema = 'public'
ORDER BY ordinal_position;
