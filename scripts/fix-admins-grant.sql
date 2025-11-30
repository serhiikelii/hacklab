-- Fix GRANT permissions for admins table
-- Problem: authenticated users cannot read from admins table
-- Solution: Grant SELECT to authenticated (RLS policies will filter rows)

BEGIN;

-- Grant SELECT permission to authenticated users
-- RLS policy "Authenticated can read active admins" will filter rows
GRANT SELECT ON admins TO authenticated;

-- Verify the grant
SELECT
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'admins'
  AND grantee = 'authenticated'
ORDER BY privilege_type;

COMMIT;
