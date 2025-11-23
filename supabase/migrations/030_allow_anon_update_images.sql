-- Temporary: Allow anon to UPDATE device_models.image_url for migration
-- IMPORTANT: Remove after migration!

-- Enable RLS back
ALTER TABLE device_models ENABLE ROW LEVEL SECURITY;

-- Add temporary UPDATE policy for anonymous users
CREATE POLICY "Temp: Allow anon to update image_url"
  ON device_models
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
