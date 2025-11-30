-- Check if category_services_view has security_invoker set
-- Views in PostgreSQL 15+ need security_invoker=true to respect RLS policies

SELECT
    schemaname,
    viewname,
    viewowner,
    definition
FROM pg_views
WHERE schemaname = 'public'
  AND viewname = 'category_services_view';

-- Check view options (security_invoker)
SELECT
    n.nspname AS schemaname,
    c.relname AS viewname,
    c.reloptions
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'v'
  AND n.nspname = 'public'
  AND c.relname = 'category_services_view';
