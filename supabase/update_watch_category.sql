-- Обновление категории watch: изменение названия на "Apple Watch"
UPDATE device_categories
SET
  name_en = 'Apple Watch',
  name_cz = 'Apple Watch',
  name_ru = 'Apple Watch'
WHERE slug = 'watch';
