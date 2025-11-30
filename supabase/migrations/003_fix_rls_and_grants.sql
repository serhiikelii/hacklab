-- Migration: Fix RLS and GRANT permissions after database rebuild
-- Date: 2025-11-30
-- Description: Applies all RLS policy fixes and GRANT permissions discovered during post-rebuild troubleshooting

-- ============================================================
-- CRITICAL FIX 1: category_services_view security_invoker
-- ============================================================
-- Problem: VIEW wasn't respecting RLS policies for anon role
-- Solution: Add security_invoker = true flag (PostgreSQL 15+)

DROP VIEW IF EXISTS category_services_view;

CREATE VIEW category_services_view
WITH (security_invoker = true) -- CRITICAL 4;O @01>BK RLS A anon!
AS
SELECT
    cs.id,
    cs.category_id,
    dc.slug as category_slug,
    dc.name as category_name,
    cs.service_id,
    s.name as service_name,
    s.description as service_description,
    s.base_price,
    s.estimated_duration,
    s.icon,
    cs.position
FROM category_services cs
JOIN device_categories dc ON cs.category_id = dc.id
JOIN services s ON cs.service_id = s.id
ORDER BY cs.position;

-- Grant SELECT to anon and authenticated
GRANT SELECT ON category_services_view TO anon, authenticated;

-- ============================================================
-- CRITICAL FIX 2: GRANT permissions for admins table
-- ============================================================
-- Problem: authenticated users cannot read admins table for admin verification
-- Solution: Grant SELECT to authenticated (RLS policy will filter rows)

GRANT SELECT ON admins TO authenticated;

-- ============================================================
-- ADDITIONAL GRANTS: Ensure anon can read public tables
-- ============================================================
-- These may have been applied before, but ensuring they exist

GRANT SELECT ON device_categories TO anon, authenticated;
GRANT SELECT ON device_models TO anon, authenticated;
GRANT SELECT ON services TO anon, authenticated;
GRANT SELECT ON category_services TO anon, authenticated;
GRANT SELECT ON prices TO anon, authenticated;

-- ============================================================
-- VERIFY RLS POLICIES EXIST (informational queries)
-- ============================================================
-- These are checks, not modifications - RLS policies should already exist from initial migrations

-- Check RLS is enabled on critical tables
DO $$
BEGIN
    -- Verify RLS is enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'admins'
        AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS not enabled on admins table!';
    END IF;

    -- Verify admin read policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'admins'
        AND policyname = 'Authenticated can read active admins'
    ) THEN
        RAISE EXCEPTION 'Missing RLS policy: Authenticated can read active admins';
    END IF;
END $$;

-- ============================================================
-- SUMMARY OF FIXES
-- ============================================================
-- 1.  Added security_invoker to category_services_view
-- 2.  Granted SELECT on admins to authenticated
-- 3.  Ensured anon can read all public tables
-- 4.  Verified RLS policies are in place
