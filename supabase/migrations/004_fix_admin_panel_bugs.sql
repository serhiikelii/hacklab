-- ================================================================
-- MojService Database - Fix Admin Panel Bugs
-- Generated: 2025-12-06
-- Description: Fixes for admin panel issues after database rebuild
--
-- Bug #1: last_login_at not updating in admins table
-- Bug #2: audit_log access denied after rebuild
-- ================================================================

BEGIN;

-- ================================================================
-- FIX #1: Auto-sync last_login_at from auth.users
-- ================================================================
-- Problem: last_login_at in admins table not updating on user login
-- Root cause: RLS policies blocking UPDATE even for authenticated users
-- Solution: Database trigger that syncs from auth.users.last_sign_in_at
--
-- Benefits:
--   - Supabase automatically updates last_sign_in_at on login
--   - SECURITY DEFINER bypasses RLS policies
--   - No application code changes needed
--   - Single source of truth (auth.users)

-- Create trigger function
CREATE OR REPLACE FUNCTION public.sync_admin_last_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update last_login_at in admins table when user logs in
  UPDATE public.admins
  SET last_login_at = NEW.last_sign_in_at
  WHERE user_id = NEW.id
    AND is_active = true;

  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;

CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.sync_admin_last_login();

-- Backfill existing data
UPDATE public.admins a
SET last_login_at = u.last_sign_in_at
FROM auth.users u
WHERE a.user_id = u.id
  AND a.is_active = true
  AND u.last_sign_in_at IS NOT NULL;

-- ================================================================
-- FIX #2: Grant SELECT on audit_log to authenticated
-- ================================================================
-- Problem: "permission denied for table audit_log" error
-- Root cause: GRANT missing after database rebuild
-- Solution: Add GRANT SELECT for authenticated role
--
-- Note: RLS policy "Admins can read audit_log" already exists,
--       but GRANT is also required for table access

GRANT SELECT ON audit_log TO authenticated;

COMMIT;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check trigger exists
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_login';

-- Check function exists
SELECT
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_name = 'sync_admin_last_login'
  AND routine_schema = 'public';

-- Check audit_log grants
SELECT
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'audit_log'
  AND table_schema = 'public'
  AND grantee = 'authenticated';

-- ================================================================
-- SUMMARY
-- ================================================================
-- 1. ✅ Added trigger to auto-sync admins.last_login_at from auth.users
-- 2. ✅ Granted SELECT on audit_log to authenticated role
-- 3. ✅ Backfilled existing last_login_at data
--
-- Both admin panel bugs are now fixed!
-- ================================================================
