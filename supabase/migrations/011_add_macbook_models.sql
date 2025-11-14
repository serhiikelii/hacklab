-- Migration: Add all MacBook models
-- Description: Complete MacBook lineup from MacBook Air 11" to MacBook Pro 16" M4

DO $$
DECLARE
  v_macbook_category_id UUID;
BEGIN
  -- Get MacBook category_id
  SELECT id INTO v_macbook_category_id
  FROM device_categories
  WHERE slug = 'macbook';

  -- MacBook Pro 16" models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
  (v_macbook_category_id, 'macbook-pro-16-m4-a3403', 'MacBook Pro 16" M4 (A3403)', 'MacBook Pro M4', 2024, 1),
  (v_macbook_category_id, 'macbook-pro-16-a2991', 'MacBook Pro 16" (A2991)', 'MacBook Pro', 2023, 2),
  (v_macbook_category_id, 'macbook-pro-16-a2780', 'MacBook Pro 16" (A2780)', 'MacBook Pro', 2023, 3),
  (v_macbook_category_id, 'macbook-pro-16-m1-a2485', 'MacBook Pro 16" M1 (A2485)', 'MacBook Pro M1', 2021, 4),
  (v_macbook_category_id, 'macbook-pro-16-a2141', 'MacBook Pro 16" (A2141)', 'MacBook Pro', 2019, 5),
  (v_macbook_category_id, 'macbook-pro-15-a1990', 'MacBook Pro 15" (A1990)', 'MacBook Pro', 2018, 6),
  (v_macbook_category_id, 'macbook-pro-15-a1707', 'MacBook Pro 15" (A1707)', 'MacBook Pro', 2016, 7),
  (v_macbook_category_id, 'macbook-pro-15-a1398', 'MacBook Pro 15" (A1398)', 'MacBook Pro', 2015, 8)
  ON CONFLICT (slug) DO NOTHING;

  -- MacBook Pro 14" models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
  (v_macbook_category_id, 'macbook-pro-14-m4-a3401', 'MacBook Pro 14" M4 (A3401)', 'MacBook Pro M4', 2024, 9),
  (v_macbook_category_id, 'macbook-pro-14-m4-a3112', 'MacBook Pro 14" M4 (A3112)', 'MacBook Pro M4', 2024, 10),
  (v_macbook_category_id, 'macbook-pro-14-m3-a2992', 'MacBook Pro 14" M3 (A2992)', 'MacBook Pro M3', 2023, 11),
  (v_macbook_category_id, 'macbook-pro-14-m3-a2918', 'MacBook Pro 14" M3 (A2918)', 'MacBook Pro M3', 2023, 12),
  (v_macbook_category_id, 'macbook-pro-14-m2-a2779', 'MacBook Pro 14" M2 (A2779)', 'MacBook Pro M2', 2023, 13),
  (v_macbook_category_id, 'macbook-pro-14-m1-a2442', 'MacBook Pro 14" M1 (A2442)', 'MacBook Pro M1', 2021, 14)
  ON CONFLICT (slug) DO NOTHING;

  -- MacBook Pro 13" models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
  (v_macbook_category_id, 'macbook-pro-13-m1-m2-a2338', 'MacBook Pro 13" M1/M2 (A2338)', 'MacBook Pro', 2022, 15),
  (v_macbook_category_id, 'macbook-pro-13-a2251-a2289', 'MacBook Pro 13" (A2251,A2289)', 'MacBook Pro', 2020, 16),
  (v_macbook_category_id, 'macbook-pro-13-a2159', 'MacBook Pro 13" (A2159)', 'MacBook Pro', 2019, 17),
  (v_macbook_category_id, 'macbook-pro-13-a1989', 'MacBook Pro 13" (A1989)', 'MacBook Pro', 2018, 18),
  (v_macbook_category_id, 'macbook-pro-13-a1706-a1708', 'MacBook Pro 13" (A1706,A1708)', 'MacBook Pro', 2017, 19),
  (v_macbook_category_id, 'macbook-pro-13-a1425-a1502', 'MacBook Pro 13" (A1425,A1502)', 'MacBook Pro', 2015, 20)
  ON CONFLICT (slug) DO NOTHING;

  -- MacBook Air 15" models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
  (v_macbook_category_id, 'macbook-air-15-m3-a3114', 'MacBook Air 15" M3 (A3114)', 'MacBook Air M3', 2024, 21),
  (v_macbook_category_id, 'macbook-air-15-a2941', 'MacBook Air 15" (A2941)', 'MacBook Air', 2023, 22)
  ON CONFLICT (slug) DO NOTHING;

  -- MacBook Air 13" models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
  (v_macbook_category_id, 'macbook-air-13-m3-a3113', 'MacBook Air 13" M3 (A3113)', 'MacBook Air M3', 2024, 23),
  (v_macbook_category_id, 'macbook-air-13-m2-a2681', 'MacBook Air 13" M2 (A2681)', 'MacBook Air M2', 2022, 24),
  (v_macbook_category_id, 'macbook-air-13-m1-a2337', 'MacBook Air 13" M1 (A2337)', 'MacBook Air M1', 2020, 25),
  (v_macbook_category_id, 'macbook-air-13-a2179', 'MacBook Air 13" (A2179)', 'MacBook Air', 2020, 26),
  (v_macbook_category_id, 'macbook-air-13-a1932', 'MacBook Air 13" (A1932)', 'MacBook Air', 2018, 27),
  (v_macbook_category_id, 'macbook-air-13-a1237-a1466', 'MacBook Air 13" (A1237,A1304,A1369,A1466)', 'MacBook Air', 2015, 28)
  ON CONFLICT (slug) DO NOTHING;

  -- MacBook Air 11" models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
  (v_macbook_category_id, 'macbook-air-11-a1370-a1465', 'MacBook Air 11"', 'MacBook Air', 2015, 29)
  ON CONFLICT (slug) DO NOTHING;

  -- MacBook 12" model
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
  (v_macbook_category_id, 'macbook-12-a1534', 'MacBook 12" (A1534)', 'MacBook', 2017, 30)
  ON CONFLICT (slug) DO NOTHING;

END $$;
