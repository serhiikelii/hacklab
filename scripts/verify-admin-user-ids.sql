-- Verify if user_id in admins table matches auth.users
-- This checks if the user_id was preserved correctly after DB rebuild

SELECT
    au.id as auth_user_id,
    au.email as auth_email,
    pa.user_id as admins_user_id,
    pa.email as admins_email,
    pa.role,
    pa.is_active,
    CASE
        WHEN au.id = pa.user_id THEN '✅ MATCH'
        ELSE '❌ MISMATCH - THIS IS THE PROBLEM!'
    END as status
FROM auth.users au
LEFT JOIN public.admins pa ON pa.email = au.email
WHERE au.email IN ('serhii.kelii@gmail.com', 'proservicemanor@gmail.com')
ORDER BY au.email;
