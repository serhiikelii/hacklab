-- ================================================================
-- MojService - Discounts and Announcements System
-- Migration 005
-- Generated: 2025-12-31
--
-- Features:
-- ✅ Two types of discounts (informational + automatic)
-- ✅ Discount-service junction table
-- ✅ Announcements/promotions banner system
-- ✅ Function for automatic discount calculation
-- ✅ RLS policies for public read access
-- ================================================================

BEGIN;

-- ================================================================
-- 1. ENUM TYPES
-- ================================================================

-- Create announcement type enum
CREATE TYPE announcement_type_enum AS ENUM ('promo', 'warning', 'info', 'sale');

-- ================================================================
-- 2. ALTER EXISTING TABLES
-- ================================================================

-- 2.1 Extend discounts table with new fields
ALTER TABLE discounts
  ADD COLUMN start_date DATE,
  ADD COLUMN end_date DATE,
  ADD COLUMN is_auto_apply BOOLEAN DEFAULT FALSE,
  ADD COLUMN display_badge BOOLEAN DEFAULT TRUE;

COMMENT ON COLUMN discounts.is_auto_apply IS 'TRUE = auto-discount on services, FALSE = info-discount for banner';
COMMENT ON COLUMN discounts.display_badge IS 'Show discount badge (-10%) on service card';

-- ================================================================
-- 3. NEW TABLES
-- ================================================================

-- 3.1 Junction table for discount-service relationships
-- Only for automatic discounts (is_auto_apply = TRUE)
CREATE TABLE discount_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_id UUID NOT NULL REFERENCES discounts(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(discount_id, service_id)
);

CREATE INDEX idx_discount_services_discount ON discount_services(discount_id);
CREATE INDEX idx_discount_services_service ON discount_services(service_id);

COMMENT ON TABLE discount_services IS 'Links automatic discounts to specific services';

-- 3.2 Announcements table for banner carousel
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type announcement_type_enum NOT NULL DEFAULT 'info',

  -- Multilingual content
  title_ru TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_cz TEXT NOT NULL,
  message_ru TEXT,
  message_en TEXT,
  message_cz TEXT,

  -- Validity period
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,

  -- Display settings
  display_order INTEGER NOT NULL DEFAULT 0,
  background_color TEXT, -- HEX: #FF5733
  text_color TEXT DEFAULT '#FFFFFF',
  icon TEXT, -- emoji or lucide icon name

  -- Optional link
  link_url TEXT,
  link_text_ru TEXT,
  link_text_en TEXT,
  link_text_cz TEXT,

  -- Optional link to informational discount
  discount_id UUID REFERENCES discounts(id) ON DELETE SET NULL,

  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_announcements_active ON announcements(active);
CREATE INDEX idx_announcements_dates ON announcements(start_date, end_date);
CREATE INDEX idx_announcements_order ON announcements(display_order);

COMMENT ON TABLE announcements IS 'Promotional banners for homepage carousel';
COMMENT ON COLUMN announcements.display_order IS 'Lower number = higher priority in rotation';

-- ================================================================
-- 4. FUNCTIONS
-- ================================================================

-- 4.1 Function to calculate discounted price for a service
CREATE OR REPLACE FUNCTION get_discounted_price(
  p_service_id UUID,
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
  INNER JOIN discount_services ds ON ds.discount_id = d.id
  WHERE ds.service_id = p_service_id
    AND d.active = TRUE
    AND d.is_auto_apply = TRUE
    AND (d.start_date IS NULL OR CURRENT_DATE >= d.start_date)
    AND (d.end_date IS NULL OR CURRENT_DATE <= d.end_date)
  ORDER BY d.value DESC -- Take maximum discount if multiple exist
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_discounted_price IS 'Calculate final price with active discount for service';

-- ================================================================
-- 5. RLS POLICIES
-- ================================================================

-- 5.1 Enable RLS on new tables
ALTER TABLE discount_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 5.2 Discount services policies
-- Public read for active discount-service links
CREATE POLICY "discount_services_select_policy" ON discount_services
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM discounts d
      WHERE d.id = discount_services.discount_id
      AND d.active = TRUE
    )
  );

-- Admin full access
CREATE POLICY "discount_services_admin_all" ON discount_services
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- 5.3 Announcements policies
-- Public read for active announcements
CREATE POLICY "announcements_select_policy" ON announcements
  FOR SELECT
  USING (
    active = TRUE
    AND start_date <= NOW()
    AND (end_date IS NULL OR end_date >= NOW())
  );

-- Admin full access
CREATE POLICY "announcements_admin_all" ON announcements
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ================================================================
-- 6. UPDATED_AT TRIGGERS
-- ================================================================

-- Add updated_at trigger for announcements
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 7. GRANT PERMISSIONS
-- ================================================================

-- Grant SELECT to anon and authenticated for public read access
-- CRITICAL: These grants are required for frontend to fetch active discounts
GRANT SELECT ON discounts TO anon, authenticated;
GRANT SELECT ON discount_services TO anon, authenticated;
GRANT SELECT ON announcements TO anon, authenticated;

COMMIT;
