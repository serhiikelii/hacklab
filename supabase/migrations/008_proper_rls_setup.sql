-- Migration: Proper RLS setup with anon access
-- This enables RLS with proper policies for anonymous read access

-- Enable RLS on all tables
ALTER TABLE device_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- Drop old policies if exist
DROP POLICY IF EXISTS "Allow public read access to device_categories" ON device_categories;
DROP POLICY IF EXISTS "Allow public read access to device_models" ON device_models;
DROP POLICY IF EXISTS "Allow public read access to services" ON services;
DROP POLICY IF EXISTS "Allow public read access to category_services" ON category_services;
DROP POLICY IF EXISTS "Allow public read access to prices" ON prices;
DROP POLICY IF EXISTS "Allow public read access to discounts" ON discounts;
DROP POLICY IF EXISTS "Public read access for device_categories" ON device_categories;
DROP POLICY IF EXISTS "Public read access for device_models" ON device_models;
DROP POLICY IF EXISTS "Public read access for services" ON services;
DROP POLICY IF EXISTS "Public read access for category_services" ON category_services;
DROP POLICY IF EXISTS "Public read access for prices" ON prices;
DROP POLICY IF EXISTS "Public read access for discounts" ON discounts;

-- Create new policies with proper permissions
-- These policies allow SELECT for all users (including anonymous)
CREATE POLICY "Public read access for device_categories"
  ON device_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access for device_models"
  ON device_models
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access for services"
  ON services
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access for category_services"
  ON category_services
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access for prices"
  ON prices
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access for discounts"
  ON discounts
  FOR SELECT
  USING (true);

-- Grant SELECT to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.device_categories TO anon, authenticated;
GRANT SELECT ON public.device_models TO anon, authenticated;
GRANT SELECT ON public.services TO anon, authenticated;
GRANT SELECT ON public.category_services TO anon, authenticated;
GRANT SELECT ON public.prices TO anon, authenticated;
GRANT SELECT ON public.discounts TO anon, authenticated;
