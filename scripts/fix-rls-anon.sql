-- Fix RLS policies to allow anon access for public read
-- The rebuild script created policies only for authenticated users

BEGIN;

-- Drop existing "Public read" policies (they don't work for anon)
DROP POLICY IF EXISTS "Public read access for device_categories" ON device_categories;
DROP POLICY IF EXISTS "Public read access for device_models" ON device_models;
DROP POLICY IF EXISTS "Public read access for services" ON services;
DROP POLICY IF EXISTS "Public read access for category_services" ON category_services;
DROP POLICY IF EXISTS "Public read access for prices" ON prices;
DROP POLICY IF EXISTS "Public read access for discounts" ON discounts;

-- Create new policies that work for BOTH anon and authenticated
CREATE POLICY "Anyone can read device_categories"
ON device_categories FOR SELECT
USING (true);

CREATE POLICY "Anyone can read device_models"
ON device_models FOR SELECT
USING (true);

CREATE POLICY "Anyone can read services"
ON services FOR SELECT
USING (true);

CREATE POLICY "Anyone can read category_services"
ON category_services FOR SELECT
USING (true);

CREATE POLICY "Anyone can read prices"
ON prices FOR SELECT
USING (true);

CREATE POLICY "Anyone can read discounts"
ON discounts FOR SELECT
USING (true);

COMMIT;

-- Verify policies
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('device_categories', 'device_models', 'services', 'category_services', 'prices', 'discounts')
ORDER BY tablename, policyname;
