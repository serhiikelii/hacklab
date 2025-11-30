-- Check if user exists in auth.users but missing from public.admins
-- This diagnoses why user gets "You do not have administrator privileges"

-- Step 1: Find user in auth.users by email
SELECT
    id as user_id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
WHERE email = 'serhii.kelii@gmail.com';

-- Step 2: Check if this user_id exists in public.admins
SELECT
    id,
    user_id,
    email,
    role,
    is_active
FROM public.admins
WHERE email = 'serhii.kelii@gmail.com';

-- Step 3: Show the mismatch (if any)
SELECT
    au.id as auth_user_id,
    au.email as auth_email,
    CASE
        WHEN pa.user_id IS NULL THEN '❌ MISSING IN ADMINS TABLE'
        ELSE '✅ EXISTS IN ADMINS'
    END as status
FROM auth.users au
LEFT JOIN public.admins pa ON pa.user_id = au.id
WHERE au.email = 'serhii.kelii@gmail.com';
