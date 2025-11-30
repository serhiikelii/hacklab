-- Grant SELECT permissions to anon and authenticated roles
-- This is required in addition to RLS policies

BEGIN;

-- Grant USAGE on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant SELECT on all tables to anon and authenticated
GRANT SELECT ON device_categories TO anon, authenticated;
GRANT SELECT ON device_models TO anon, authenticated;
GRANT SELECT ON services TO anon, authenticated;
GRANT SELECT ON category_services TO anon, authenticated;
GRANT SELECT ON prices TO anon, authenticated;
GRANT SELECT ON discounts TO anon, authenticated;

-- Grant SELECT on view
GRANT SELECT ON category_services_view TO anon, authenticated;

-- Grant ALL on tables to authenticated (for admins via RLS)
GRANT ALL ON device_categories TO authenticated;
GRANT ALL ON device_models TO authenticated;
GRANT ALL ON services TO authenticated;
GRANT ALL ON category_services TO authenticated;
GRANT ALL ON prices TO authenticated;
GRANT ALL ON discounts TO authenticated;

COMMIT;

-- Verify grants
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated')
  AND table_name IN ('device_categories', 'device_models', 'services', 'category_services', 'prices', 'discounts')
ORDER BY table_name, grantee, privilege_type;
