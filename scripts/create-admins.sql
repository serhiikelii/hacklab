-- Create admin users in admins table
-- Execute via Supabase SQL Editor or apply-migration-api.mjs

BEGIN;

-- Insert superadmin (serhii.kelii@gmail.com)
INSERT INTO admins (user_id, email, role, is_active, created_by)
VALUES (
  '46ec7c16-9c27-4252-a07e-44a5361056c6',
  'serhii.kelii@gmail.com',
  'superadmin',
  TRUE,
  NULL
);

-- Insert admin (proservicemenupo@gmail.com)
INSERT INTO admins (user_id, email, role, is_active, created_by)
VALUES (
  '28c7ef92-10d1-44e4-8d77-7917940e91fa',
  'proservicemenupo@gmail.com',
  'admin',
  TRUE,
  '46ec7c16-9c27-4252-a07e-44a5361056c6'  -- created by superadmin
);

COMMIT;

-- Verify
SELECT id, email, role, is_active, created_at
FROM admins
ORDER BY created_at;
