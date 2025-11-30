-- Fix category_services_view to respect RLS policies for anon role
-- Add security_invoker=true option

BEGIN;

-- Drop and recreate view with security_invoker option
DROP VIEW IF EXISTS category_services_view;

CREATE VIEW category_services_view
WITH (security_invoker = true) -- КРИТИЧНО для работы RLS с anon!
AS
SELECT
  cs.id,
  cs.category_id,
  dc.slug as category_slug,
  dc.name_ru as category_name_ru,
  dc.name_en as category_name_en,
  dc.name_cz as category_name_cz,
  cs.service_id,
  s.slug as service_slug,
  s.name_ru as service_name_ru,
  s.name_en as service_name_en,
  s.name_cz as service_name_cz,
  s.service_type,
  cs."order" as order,
  cs.is_active,
  cs.created_at,
  cs.updated_at
FROM category_services cs
JOIN device_categories dc ON cs.category_id = dc.id
JOIN services s ON cs.service_id = s.id;

-- Grant SELECT to anon and authenticated
GRANT SELECT ON category_services_view TO anon, authenticated;

COMMIT;

-- Verify the fix
SELECT
    c.relname AS viewname,
    c.reloptions
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'v'
  AND n.nspname = 'public'
  AND c.relname = 'category_services_view';
