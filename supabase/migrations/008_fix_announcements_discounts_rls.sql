-- ================================================================
-- MojService - Fix GRANT Permissions for Announcements and Discounts
-- Migration 008
-- Generated: 2026-01-01
--
-- Problem:
-- Tables 'announcements' and 'discount_category_services' have RLS policies
-- configured correctly (with 'TO authenticated'), but GRANT permissions
-- are incomplete. They only have SELECT, missing INSERT/UPDATE/DELETE.
--
-- Root Cause:
-- Migrations 005 and 006 only granted SELECT to authenticated:
--   GRANT SELECT ON announcements TO anon, authenticated;
--   GRANT SELECT ON discount_category_services TO anon, authenticated;
--
-- This prevents admin users from editing/deleting records even though
-- RLS policies allow it via is_admin() check.
--
-- Solution:
-- 1. Fix RLS policies (add 'TO authenticated' if missing)
-- 2. Grant full permissions (INSERT, UPDATE, DELETE) to authenticated role
-- 3. Follow the pattern from working tables (prices, discounts)
--
-- Reference:
-- - Migration 003 (prices table - working example)
-- - Migration 004 (discounts table - working example)
-- ================================================================

BEGIN;

-- ================================================================
-- 1. FIX RLS POLICIES FOR discount_category_services
-- ================================================================

-- Drop old policies if they exist
DROP POLICY IF EXISTS "discount_category_services_select_policy" ON discount_category_services;
DROP POLICY IF EXISTS "discount_category_services_admin_all" ON discount_category_services;
DROP POLICY IF EXISTS "Public read access for discount_category_services" ON discount_category_services;
DROP POLICY IF EXISTS "Admins can manage discount_category_services" ON discount_category_services;

-- Public read for active discounts
CREATE POLICY "Public read access for discount_category_services"
ON discount_category_services FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM discounts d
    WHERE d.id = discount_category_services.discount_id
    AND d.active = TRUE
  )
);

-- Admins can manage (CRITICAL: with TO authenticated!)
CREATE POLICY "Admins can manage discount_category_services"
ON discount_category_services FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ================================================================
-- 2. FIX RLS POLICIES FOR announcements
-- ================================================================

-- Drop old policies if they exist
DROP POLICY IF EXISTS "announcements_select_policy" ON announcements;
DROP POLICY IF EXISTS "announcements_admin_all" ON announcements;
DROP POLICY IF EXISTS "Public read access for announcements" ON announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;

-- Public read for active announcements
CREATE POLICY "Public read access for announcements"
ON announcements FOR SELECT
USING (
  active = TRUE
  AND start_date <= NOW()
  AND (end_date IS NULL OR end_date >= NOW())
);

-- Admins can manage (CRITICAL: with TO authenticated!)
CREATE POLICY "Admins can manage announcements"
ON announcements FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ================================================================
-- 3. GRANT PERMISSIONS (CRITICAL FIX)
-- ================================================================

-- Grant FULL permissions to authenticated role for admin operations
-- Pattern from migration 003 (prices table) and 004 (discounts table)

-- discount_category_services: Full CRUD for authenticated (admins)
GRANT SELECT, INSERT, UPDATE, DELETE ON discount_category_services TO authenticated;

-- announcements: Full CRUD for authenticated (admins)
GRANT SELECT, INSERT, UPDATE, DELETE ON announcements TO authenticated;

-- Note: anon still has SELECT only (via existing grants from migrations 005/006)
-- This is correct - public users should only read active records

COMMIT;

-- ================================================================
-- VERIFICATION
-- ================================================================

-- Verify RLS policies
SELECT
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('discount_category_services', 'announcements')
ORDER BY tablename, policyname;

-- Verify GRANT permissions
SELECT
  grantee,
  table_name,
  string_agg(privilege_type, ', ' ORDER BY privilege_type) as privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND table_name IN ('discount_category_services', 'announcements')
  AND grantee IN ('anon', 'authenticated')
GROUP BY grantee, table_name
ORDER BY table_name, grantee;

-- ================================================================
-- EXPECTED RESULT
-- ================================================================
-- discount_category_services:
--   - anon: SELECT
--   - authenticated: DELETE, INSERT, SELECT, UPDATE
--
-- announcements:
--   - anon: SELECT
--   - authenticated: DELETE, INSERT, SELECT, UPDATE
-- ================================================================
