-- Migration: Add order field to category_services table
-- Description: Move order from services table to category_services for per-category sorting
-- Author: Implementation Engineer
-- Date: 2025-11-26

-- ============================================================================
-- ARCHITECTURE DECISION
-- ============================================================================
-- We KEEP services.order as template/default value
-- We ADD category_services.order for actual per-category sorting
-- This allows different order for same service across categories
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Add order column to category_services
-- ============================================================================

ALTER TABLE category_services
ADD COLUMN "order" INTEGER;

COMMENT ON COLUMN category_services."order" IS 'Sort order for service within category (copied from services.order on link creation)';

-- ============================================================================
-- STEP 2: Copy existing order values from services table
-- ============================================================================

UPDATE category_services cs
SET "order" = s."order"
FROM services s
WHERE cs.service_id = s.id;

-- ============================================================================
-- STEP 3: Make order NOT NULL with default
-- ============================================================================

ALTER TABLE category_services
ALTER COLUMN "order" SET NOT NULL,
ALTER COLUMN "order" SET DEFAULT 0;

-- ============================================================================
-- STEP 4: Create index for fast sorting
-- ============================================================================

CREATE INDEX idx_category_services_order ON category_services("order");

-- ============================================================================
-- STEP 5: Update VIEW to use category_services.order instead of services.order
-- ============================================================================

DROP VIEW IF EXISTS category_services_view;

CREATE OR REPLACE VIEW category_services_view AS
SELECT
  cs.id,
  cs.category_id,
  dc.slug as category_slug,
  dc.name_ru as category_name_ru,
  dc.name_en as category_name_en,
  dc.name_cz as category_name_cz,
  cs.service_id,
  s.slug as service_slug,
  s.name_ru as service_name_ru,
  s.name_en as service_name_en,
  s.name_cz as service_name_cz,
  s.service_type,
  cs."order" as order,  -- Changed from s."order" as service_order
  cs.is_active,
  cs.created_at,
  cs.updated_at
FROM category_services cs
JOIN device_categories dc ON cs.category_id = dc.id
JOIN services s ON cs.service_id = s.id;

GRANT SELECT ON category_services_view TO anon, authenticated;

COMMENT ON VIEW category_services_view IS 'View for category-specific services with per-category order sorting';

-- ============================================================================
-- STEP 6: Verification
-- ============================================================================

DO $$
DECLARE
  total_links INT;
  links_with_order INT;
  null_orders INT;
BEGIN
  SELECT COUNT(*) INTO total_links FROM category_services;
  SELECT COUNT(*) INTO links_with_order FROM category_services WHERE "order" IS NOT NULL;
  SELECT COUNT(*) INTO null_orders FROM category_services WHERE "order" IS NULL;

  RAISE NOTICE '=== VERIFICATION ===';
  RAISE NOTICE 'Total category_services links: %', total_links;
  RAISE NOTICE 'Links with order: %', links_with_order;
  RAISE NOTICE 'Links with NULL order: %', null_orders;

  IF null_orders = 0 THEN
    RAISE NOTICE '✅ SUCCESS: All links have order values!';
  ELSE
    RAISE WARNING '⚠️ Found % links with NULL order', null_orders;
  END IF;
END $$;

COMMIT;

-- ============================================================================
-- NOTES
-- ============================================================================
-- services.order is KEPT as template value for new category links
-- category_services.order is the actual sort order used in queries
-- VIEW now returns "order" instead of "service_order"
-- Frontend needs to update: .order('service_order') -> .order('order')
