-- Migration: Add Apple Watch models
-- Description: Adding all Apple Watch models

-- ============================================
-- Apple Watch Models
-- ============================================

DO $$
DECLARE
  v_watch_category_id UUID;
BEGIN
  SELECT id INTO v_watch_category_id
  FROM device_categories
  WHERE slug = 'apple-watch';

  -- Apple Watch models
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
  (v_watch_category_id, 'apple-watch-ultra-49mm', 'Apple Watch Ultra 49mm', 'Ultra', 2022, 1),
  (v_watch_category_id, 'apple-watch-se-2-44mm', 'Apple Watch SE 2 44mm', 'SE 2', 2022, 2),
  (v_watch_category_id, 'apple-watch-se-2-40mm', 'Apple Watch SE 2 40mm', 'SE 2', 2022, 3),
  (v_watch_category_id, 'apple-watch-se-44mm', 'Apple Watch SE 44mm', 'SE', 2020, 4),
  (v_watch_category_id, 'apple-watch-se-40mm', 'Apple Watch SE 40mm', 'SE', 2020, 5),
  (v_watch_category_id, 'apple-watch-series-8-45mm', 'Apple Watch Series 8 45mm', 'Series 8', 2022, 6),
  (v_watch_category_id, 'apple-watch-series-8-41mm', 'Apple Watch Series 8 41mm', 'Series 8', 2022, 7),
  (v_watch_category_id, 'apple-watch-series-7-45mm', 'Apple Watch Series 7 45mm', 'Series 7', 2021, 8),
  (v_watch_category_id, 'apple-watch-series-7-41mm', 'Apple Watch Series 7 41mm', 'Series 7', 2021, 9),
  (v_watch_category_id, 'apple-watch-series-6-44mm', 'Apple Watch Series 6 44mm', 'Series 6', 2020, 10),
  (v_watch_category_id, 'apple-watch-series-6-40mm', 'Apple Watch Series 6 40mm', 'Series 6', 2020, 11),
  (v_watch_category_id, 'apple-watch-series-5-44mm', 'Apple Watch Series 5 44mm', 'Series 5', 2019, 12),
  (v_watch_category_id, 'apple-watch-series-5-40mm', 'Apple Watch Series 5 40mm', 'Series 5', 2019, 13),
  (v_watch_category_id, 'apple-watch-series-4-44mm', 'Apple Watch Series 4 44mm', 'Series 4', 2018, 14),
  (v_watch_category_id, 'apple-watch-series-4-40mm', 'Apple Watch Series 4 40mm', 'Series 4', 2018, 15)
  ON CONFLICT (slug) DO NOTHING;

END $$;
