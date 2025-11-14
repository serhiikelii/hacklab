-- Migration: Fix RLS policies for anonymous access
-- Problem: RLS is enabled but policies don't allow anonymous read access
-- Solution: Drop existing policies and recreate with proper permissions

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to device_categories" ON device_categories;
DROP POLICY IF EXISTS "Allow public read access to device_models" ON device_models;
DROP POLICY IF EXISTS "Allow public read access to services" ON services;
DROP POLICY IF EXISTS "Allow public read access to category_services" ON category_services;
DROP POLICY IF EXISTS "Allow public read access to prices" ON prices;
DROP POLICY IF EXISTS "Allow public read access to discounts" ON discounts;

-- Ensure RLS is enabled
ALTER TABLE device_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- Create policies with explicit anonymous access
-- Using 'TO public' to ensure anonymous users can read

CREATE POLICY "Allow public read access to device_categories"
  ON device_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to device_models"
  ON device_models
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to services"
  ON services
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to category_services"
  ON category_services
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to prices"
  ON prices
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to discounts"
  ON discounts
  FOR SELECT
  TO public
  USING (true);
