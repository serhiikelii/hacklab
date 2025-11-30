-- Fix user_id mismatch in admins table after DB rebuild
-- Problem: admins table has old user_ids that don't match current auth.users

BEGIN;

-- Update serhii.kelii@gmail.com user_id
UPDATE public.admins
SET user_id = '46ec7c16-9c27-4252-a07e-44a636f056c6'
WHERE email = 'serhii.kelii@gmail.com';

-- Update proservicemanor@gmail.com user_id
UPDATE public.admins
SET user_id = '28c7a92-05d1-44e4-8d77-797194b0e11a'
WHERE email = 'proservicemanor@gmail.com';

-- Verify the updates
SELECT
    user_id,
    email,
    role,
    is_active
FROM public.admins
ORDER BY email;

COMMIT;
