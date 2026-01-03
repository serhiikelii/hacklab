-- ================================================================
-- MojService - Fix Discount Architecture
-- Migration 006
-- Generated: 2026-01-01
--
-- Problem:
-- Discounts were linked to services table, but one service (e.g. "Battery Replacement")
-- is used across ALL categories (iPhone, iPad, MacBook, Apple Watch).
-- This caused discounts to apply to all categories instead of specific ones.
--
-- Solution:
-- Link discounts to category_services junction table instead of services.
-- This allows category-specific discounts (e.g. "15% off Battery Replacement for iPhone only").
--
-- Changes:
-- 1. Create new table discount_category_services (replaces discount_services)
-- 2. Drop old table discount_services
-- 3. Update get_discounted_price() function to use category_service_id
-- ================================================================

BEGIN;

-- ================================================================
-- 1. CREATE NEW JUNCTION TABLE
-- ================================================================

-- Links discounts to specific category-service combinations
-- Example: "15% off Battery Replacement for iPhone" (not iPad/MacBook)
CREATE TABLE discount_category_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_id UUID NOT NULL REFERENCES discounts(id) ON DELETE CASCADE,
  category_service_id UUID NOT NULL REFERENCES category_services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(discount_id, category_service_id)
);

CREATE INDEX idx_discount_category_services_discount ON discount_category_services(discount_id);
CREATE INDEX idx_discount_category_services_category_service ON discount_category_services(category_service_id);

COMMENT ON TABLE discount_category_services IS 'Links automatic discounts to specific category-service combinations for granular control';
COMMENT ON COLUMN discount_category_services.category_service_id IS 'References category_services junction table to allow category-specific discounts';

-- ================================================================
-- 2. DROP OLD JUNCTION TABLE
-- ================================================================

-- Drop old table and its policies
DROP POLICY IF EXISTS "discount_services_select_policy" ON discount_services;
DROP POLICY IF EXISTS "discount_services_admin_all" ON discount_services;
DROP TABLE IF EXISTS discount_services;

-- ================================================================
-- 3. UPDATE DISCOUNT CALCULATION FUNCTION
-- ================================================================

-- Drop old function
DROP FUNCTION IF EXISTS get_discounted_price(UUID, DECIMAL);

-- Create new function that uses category_service_id
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
    AND d.is_auto_apply = TRUE
    AND (d.start_date IS NULL OR CURRENT_DATE >= d.start_date)
    AND (d.end_date IS NULL OR CURRENT_DATE <= d.end_date)
  ORDER BY d.value DESC -- Take maximum discount if multiple exist
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_discounted_price IS 'Calculate final price with active discount for specific category-service combination';

-- ================================================================
-- 4. RLS POLICIES FOR NEW TABLE
-- ================================================================

ALTER TABLE discount_category_services ENABLE ROW LEVEL SECURITY;

-- Public read for active discount-category_service links
CREATE POLICY "discount_category_services_select_policy" ON discount_category_services
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM discounts d
      WHERE d.id = discount_category_services.discount_id
      AND d.active = TRUE
    )
  );

-- Admin full access
CREATE POLICY "discount_category_services_admin_all" ON discount_category_services
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ================================================================
-- 5. GRANT PERMISSIONS
-- ================================================================

GRANT SELECT ON discount_category_services TO anon, authenticated;

COMMIT;

-- ================================================================
-- USAGE EXAMPLE
-- ================================================================
-- To create a discount "15% off Battery Replacement for iPhone only":
--
-- 1. Create discount:
--    INSERT INTO discounts (name_ru, name_en, name_cz, discount_type, value, is_auto_apply, active)
--    VALUES ('Скидка на батарею iPhone', 'iPhone Battery Discount', 'Sleva baterie iPhone',
--            'percentage', 15, TRUE, TRUE)
--    RETURNING id; -- Get discount_id
--
-- 2. Find category_service_id for "iPhone + Battery Replacement":
--    SELECT cs.id FROM category_services cs
--    JOIN device_categories dc ON cs.category_id = dc.id
--    JOIN services s ON cs.service_id = s.id
--    WHERE dc.slug = 'iphone' AND s.slug = 'battery-replacement';
--
-- 3. Link discount to category_service:
--    INSERT INTO discount_category_services (discount_id, category_service_id)
--    VALUES ('discount_id_from_step_1', 'category_service_id_from_step_2');
-- ================================================================
