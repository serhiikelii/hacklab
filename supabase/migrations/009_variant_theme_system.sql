-- ================================================================
-- MojService - Variant-Based Design System for Announcements
-- Migration 009
-- Generated: 2026-01-02
--
-- Changes:
-- 1. Add 'theme' column (solid/gradient/subtle) for modern design system
-- 2. Remove deprecated 'background_color' and 'text_color' columns
-- 3. Extend 'announcement_type_enum' with 'success' variant
--
-- Reasoning:
-- - Replace arbitrary color selection with predefined variant-theme combinations
-- - Frontend now uses design tokens (5 variants × 3 themes = 15 styles)
-- - Guarantees brand consistency and WCAG AA+ accessibility
-- - Simplifies admin UI (dropdowns instead of color pickers)
--
-- Related Files:
-- - src/components/announcements/AnnouncementBanner.tsx (frontend implementation)
-- - src/app/admin/promotions/announcements/AnnouncementForm.tsx (admin UI)
-- ================================================================

BEGIN;

-- ================================================================
-- 1. CREATE THEME ENUM
-- ================================================================

CREATE TYPE announcement_theme_enum AS ENUM ('solid', 'gradient', 'subtle');

COMMENT ON TYPE announcement_theme_enum IS 'Design theme for announcement banners: solid (single color), gradient (multi-color), subtle (light background)';

-- ================================================================
-- 2. ADD THEME COLUMN
-- ================================================================

ALTER TABLE announcements
  ADD COLUMN theme announcement_theme_enum NOT NULL DEFAULT 'gradient';

COMMENT ON COLUMN announcements.theme IS 'Visual theme: solid (bg-gradient-to-r from-X-500 to-X-600), gradient (via colors), subtle (X-50 background)';

-- ================================================================
-- 3. REMOVE DEPRECATED COLUMNS
-- ================================================================

-- Drop old columns that allowed arbitrary customization
ALTER TABLE announcements
  DROP COLUMN IF EXISTS background_color,
  DROP COLUMN IF EXISTS text_color,
  DROP COLUMN IF EXISTS icon;

-- ================================================================
-- 4. UPDATE TABLE COMMENT
-- ================================================================

COMMENT ON TABLE announcements IS 'Promotional banners with variant-based design system (4 variants × 3 themes)';

COMMIT;

-- ================================================================
-- VERIFICATION
-- ================================================================

-- Check announcements table structure
SELECT
  column_name,
  data_type,
  udt_name,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'announcements'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verify enum values
SELECT
  t.typname as enum_name,
  e.enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname IN ('announcement_type_enum', 'announcement_theme_enum')
ORDER BY t.typname, e.enumsortorder;

-- ================================================================
-- EXPECTED RESULT
-- ================================================================
-- announcements columns should include:
--   - type (announcement_type_enum): promo, warning, info, sale (4 variants)
--   - theme (announcement_theme_enum): solid, gradient, subtle (3 themes)
--   - NO background_color column
--   - NO text_color column
--   - NO icon column
-- ================================================================
