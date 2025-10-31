-- SQL Script to Update Mac Category to MacBook with Correct Models
-- Run this script in Supabase SQL Editor to update the Mac category

-- Step 1: Update category name from "Mac" to "MacBook"
UPDATE device_categories
SET name_ru = 'MacBook',
    name_en = 'MacBook',
    name_cz = 'MacBook'
WHERE slug = 'mac';

-- Step 2: Delete old Mac models (iMac, Mac mini, Mac Pro and old MacBook models)
DELETE FROM device_models
WHERE category_id = (SELECT id FROM device_categories WHERE slug = 'mac');

-- Step 3: Insert new MacBook models (32 models total)
DO $$
DECLARE
  mac_category_id UUID;
BEGIN
  -- Get Mac category ID
  SELECT id INTO mac_category_id FROM device_categories WHERE slug = 'mac';

  -- Row 1: Latest M4 models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-pro-16-m4-a3403', 'MacBook Pro 16" M4 (A3403)', 'MacBook Pro M4', 2024, 1),
    (mac_category_id, 'macbook-pro-14-m4-a3401', 'MacBook Pro 14" M4 (A3401)', 'MacBook Pro M4', 2024, 2),
    (mac_category_id, 'macbook-pro-14-m4-a3112', 'MacBook Pro 14" M4 (A3112)', 'MacBook Pro M4', 2024, 3),
    (mac_category_id, 'macbook-air-15-m3-a3114', 'MacBook Air 15" M3 (A3114)', 'MacBook Air M3', 2024, 4);

  -- Row 2: MacBook Pro 16"
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-pro-16-a2991', 'MacBook Pro 16" (A2991)', 'MacBook Pro', 2023, 5),
    (mac_category_id, 'macbook-pro-16-a2780', 'MacBook Pro 16" (A2780)', 'MacBook Pro', 2023, 6),
    (mac_category_id, 'macbook-pro-16-m1-a2485', 'MacBook Pro 16" M1 (A2485)', 'MacBook Pro M1', 2021, 7),
    (mac_category_id, 'macbook-pro-16-a2141', 'MacBook Pro 16" (A2141)', 'MacBook Pro', 2019, 8);

  -- Row 3: MacBook Pro 15" and 14" M3
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-pro-15-a1990', 'MacBook Pro 15" (A1990)', 'MacBook Pro', 2018, 9),
    (mac_category_id, 'macbook-pro-15-a1707', 'MacBook Pro 15" (A1707)', 'MacBook Pro', 2016, 10),
    (mac_category_id, 'macbook-pro-15-a1398', 'MacBook Pro 15" (A1398)', 'MacBook Pro', 2015, 11),
    (mac_category_id, 'macbook-pro-14-m3-a2992', 'MacBook Pro 14" M3 (A2992)', 'MacBook Pro M3', 2023, 12);

  -- Row 4: MacBook Pro 14" models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-pro-14-m3-a2918', 'MacBook Pro 14" M3 (A2918)', 'MacBook Pro M3', 2023, 13),
    (mac_category_id, 'macbook-pro-14-m2-a2779', 'MacBook Pro 14" M2 (A2779)', 'MacBook Pro M2', 2023, 14),
    (mac_category_id, 'macbook-pro-14-m1-a2442', 'MacBook Pro 14" M1 (A2442)', 'MacBook Pro M1', 2021, 15),
    (mac_category_id, 'macbook-pro-13-m1-m2-a2338', 'MacBook Pro 13" M1/M2 (A2338)', 'MacBook Pro', 2022, 16);

  -- Row 5: MacBook Pro 13" models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-pro-13-a2251-a2289', 'MacBook Pro 13" (A2251,A2289)', 'MacBook Pro', 2020, 17),
    (mac_category_id, 'macbook-pro-13-a2159', 'MacBook Pro 13" (A2159)', 'MacBook Pro', 2019, 18),
    (mac_category_id, 'macbook-pro-13-a1989', 'MacBook Pro 13" (A1989)', 'MacBook Pro', 2018, 19),
    (mac_category_id, 'macbook-pro-13-a1706-a1708', 'MacBook Pro 13" (A1706,A1708)', 'MacBook Pro', 2017, 20);

  -- Row 6: MacBook Pro 13" older + MacBook Air
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-pro-13-a1425-a1502', 'MacBook Pro 13" (A1425,A1502)', 'MacBook Pro', 2015, 21),
    (mac_category_id, 'macbook-air-15-a2941', 'MacBook Air 15" (A2941)', 'MacBook Air', 2023, 22),
    (mac_category_id, 'macbook-air-13-m3-a3113', 'MacBook Air 13" M3 (A3113)', 'MacBook Air M3', 2024, 23),
    (mac_category_id, 'macbook-air-13-a2179', 'MacBook Air 13" (A2179)', 'MacBook Air', 2020, 24);

  -- Row 7: MacBook Air models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-air-13-m1-a2337', 'MacBook Air 13" M1 (A2337)', 'MacBook Air M1', 2020, 25),
    (mac_category_id, 'macbook-air-13-a2179-2', 'MacBook Air 13" (A2179)', 'MacBook Air', 2020, 26),
    (mac_category_id, 'macbook-air-13-a1932', 'MacBook Air 13" (A1932)', 'MacBook Air', 2018, 27),
    (mac_category_id, 'macbook-air-11-a1370-a1465', 'MacBook Air 11" (A1370,A1465)', 'MacBook Air', 2015, 28);

  -- Row 8: MacBook 12"
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (mac_category_id, 'macbook-12-a1534', 'MacBook 12" (A1534)', 'MacBook', 2017, 29);

END $$;
