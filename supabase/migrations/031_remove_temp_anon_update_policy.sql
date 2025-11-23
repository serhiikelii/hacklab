-- Remove temporary anon UPDATE policy after migration

DROP POLICY IF EXISTS "Temp: Allow anon to update image_url" ON device_models;
