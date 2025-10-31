-- ============================================================================
-- Обновление моделей Apple Watch
-- ============================================================================
-- Этот скрипт обновляет модели Apple Watch в базе данных:
-- - Удаляет Apple TV из категории Watch
-- - Удаляет старые модели Watch (Apple Watch 1-9, SE)
-- - Добавляет 17 новых моделей Apple Watch с размерами
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Удаление старых моделей Watch
-- ============================================================================

-- Получаем ID категории Watch
DO $$
DECLARE
  watch_category_id UUID;
BEGIN
  SELECT id INTO watch_category_id FROM device_categories WHERE slug = 'watch';

  -- Удаляем все старые модели Watch (включая Apple TV)
  -- Это также удалит связанные service_prices (через CASCADE)
  DELETE FROM device_models
  WHERE category_id = watch_category_id;

  RAISE NOTICE 'Удалены старые модели Watch';

  -- ========================================================================
  -- 2. Добавление новых 17 моделей Apple Watch
  -- ========================================================================

  -- Row 1: Apple Watch Ultra + SE 2 + SE
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (watch_category_id, 'apple-watch-ultra-49mm', 'Apple Watch Ultra 49mm', 'Apple Watch Ultra', 2022, 1),
    (watch_category_id, 'apple-watch-se-2-44mm', 'Apple Watch SE 2 44mm', 'Apple Watch SE 2', 2022, 2),
    (watch_category_id, 'apple-watch-se-2-40mm', 'Apple Watch SE 2 40mm', 'Apple Watch SE 2', 2022, 3),
    (watch_category_id, 'apple-watch-se-44mm', 'Apple Watch SE 44mm', 'Apple Watch SE', 2020, 4);

  -- Row 2: SE 40mm + Series 8 + Series 7 45mm
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (watch_category_id, 'apple-watch-se-40mm', 'Apple Watch SE 40mm', 'Apple Watch SE', 2020, 5),
    (watch_category_id, 'apple-watch-series-8-45mm', 'Apple Watch Series 8 45mm', 'Apple Watch Series 8', 2022, 6),
    (watch_category_id, 'apple-watch-series-8-41mm', 'Apple Watch Series 8 41mm', 'Apple Watch Series 8', 2022, 7),
    (watch_category_id, 'apple-watch-series-7-45mm', 'Apple Watch Series 7 45mm', 'Apple Watch Series 7', 2021, 8);

  -- Row 3: Series 7 41mm + Series 6 + Series 5 44mm
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (watch_category_id, 'apple-watch-series-7-41mm', 'Apple Watch Series 7 41mm', 'Apple Watch Series 7', 2021, 9),
    (watch_category_id, 'apple-watch-series-6-44mm', 'Apple Watch Series 6 44mm', 'Apple Watch Series 6', 2020, 10),
    (watch_category_id, 'apple-watch-series-6-40mm', 'Apple Watch Series 6 40mm', 'Apple Watch Series 6', 2020, 11),
    (watch_category_id, 'apple-watch-series-5-44mm', 'Apple Watch Series 5 44mm', 'Apple Watch Series 5', 2019, 12);

  -- Row 4: Series 5 40mm + Series 4 + Series 3 42mm
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (watch_category_id, 'apple-watch-series-5-40mm', 'Apple Watch Series 5 40mm', 'Apple Watch Series 5', 2019, 13),
    (watch_category_id, 'apple-watch-series-4-44mm', 'Apple Watch Series 4 44mm', 'Apple Watch Series 4', 2018, 14),
    (watch_category_id, 'apple-watch-series-4-40mm', 'Apple Watch Series 4 40mm', 'Apple Watch Series 4', 2018, 15),
    (watch_category_id, 'apple-watch-series-3-42mm', 'Apple Watch Series 3 42mm', 'Apple Watch Series 3', 2017, 16);

  -- Row 5: Series 3 38mm
  INSERT INTO device_models (category_id, slug, name, series, release_year, "order") VALUES
    (watch_category_id, 'apple-watch-series-3-38mm', 'Apple Watch Series 3 38mm', 'Apple Watch Series 3', 2017, 17);

  RAISE NOTICE 'Добавлено 17 новых моделей Apple Watch';

END $$;

COMMIT;

-- ============================================================================
-- Проверка результатов
-- ============================================================================
SELECT
  dm.name,
  dm.series,
  dm.release_year,
  dm."order"
FROM device_models dm
JOIN device_categories dc ON dm.category_id = dc.id
WHERE dc.slug = 'watch'
ORDER BY dm."order";

-- ============================================================================
-- РЕЗУЛЬТАТ:
-- - Удалены: Apple TV, Apple Watch 1-9, старые модели SE
-- - Добавлено: 17 новых моделей Apple Watch с размерами (38mm-49mm)
-- - Всего моделей Watch: 17
-- ============================================================================
