-- Migration: Allow service_role to UPDATE device_models.image_url
-- This is needed for image migration script

-- Add UPDATE policy for service_role (bypasses RLS)
CREATE POLICY "Service role can update device_models"
  ON device_models
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Note: service_role bypasses RLS by default, but explicit policy for clarity
