-- Migration 027: Restore admin write policies
-- These were deleted by CASCADE when is_admin() function was dropped in migration 019
-- Now we recreate them with the fixed is_admin() function

-- device_models policies
CREATE POLICY "Admins can insert device_models"
  ON device_models
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update device_models"
  ON device_models
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete device_models"
  ON device_models
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- prices policies
CREATE POLICY "Admins can insert prices"
  ON prices
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update prices"
  ON prices
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete prices"
  ON prices
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- services policies
CREATE POLICY "Admins can insert services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete services"
  ON services
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- device_categories policies
CREATE POLICY "Admins can insert device_categories"
  ON device_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update device_categories"
  ON device_categories
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete device_categories"
  ON device_categories
  FOR DELETE
  TO authenticated
  USING (is_admin());
