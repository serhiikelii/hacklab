-- Эксперимент: что нужно для anon доступа к VIEW?
-- Проверим: RLS политики vs GRANT permissions

-- 1. Проверить текущие GRANT права для anon на VIEW
SELECT
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'anon'
  AND table_schema = 'public'
  AND table_name = 'category_services_view';

-- 2. Проверить RLS на базовых таблицах VIEW
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('category_services', 'services', 'device_categories');

-- 3. Проверить RLS политики для anon на базовых таблицах
SELECT
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('category_services', 'services', 'device_categories')
ORDER BY tablename, policyname;

-- 4. Проверить настройки VIEW (security_invoker)
SELECT
    c.relname AS viewname,
    c.reloptions,
    CASE
        WHEN 'security_invoker=true' = ANY(c.reloptions) THEN 'YES'
        ELSE 'NO'
    END as has_security_invoker
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'v'
  AND n.nspname = 'public'
  AND c.relname = 'category_services_view';
