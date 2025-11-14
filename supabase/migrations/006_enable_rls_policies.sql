-- Migration: Enable RLS policies for public read access
-- Description: Allow anonymous users to read data from all tables

-- Enable RLS on all tables
ALTER TABLE device_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to device_categories"
  ON device_categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to device_models"
  ON device_models FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to services"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to category_services"
  ON category_services FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to prices"
  ON prices FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to discounts"
  ON discounts FOR SELECT
  USING (true);
