-- Migration: Update image_url for Apple Watch and MacBook models
-- This updates the image_url field in device_models table with correct paths

DO $$
BEGIN
  -- ==========================================
  -- APPLE WATCH IMAGES
  -- ==========================================

  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-9.png' WHERE slug = 'apple-watch-9';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-se.png' WHERE slug = 'apple-watch-se';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-se-2-40mm.png' WHERE slug = 'apple-watch-se-2-40mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-se-2-44mm.png' WHERE slug = 'apple-watch-se-2-44mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-se-40mm.jpg' WHERE slug = 'apple-watch-se-40mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-se-44mm.jpg' WHERE slug = 'apple-watch-se-44mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-series-4-40mm.jpg' WHERE slug = 'apple-watch-series-4-40mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-series-4-44mm.jpg' WHERE slug = 'apple-watch-series-4-44mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-series-5-40mm.jpg' WHERE slug = 'apple-watch-series-5-40mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-series-5-44mm.jpg' WHERE slug = 'apple-watch-series-5-44mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-series-6-40mm.jpg' WHERE slug = 'apple-watch-series-6-40mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-series-6-44mm.jpg' WHERE slug = 'apple-watch-series-6-44mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-series-7-41mm.jpg' WHERE slug = 'apple-watch-series-7-41mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-series-7-45mm.jpg' WHERE slug = 'apple-watch-series-7-45mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-series-8-41mm.jpg' WHERE slug = 'apple-watch-series-8-41mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-series-8-45mm.jpg' WHERE slug = 'apple-watch-series-8-45mm';
  UPDATE device_models SET image_url = '/images/devices/apple-watch/apple-watch-ultra-49mm.png' WHERE slug = 'apple-watch-ultra-49mm';

  -- ==========================================
  -- MACBOOK IMAGES
  -- ==========================================

  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-12-a1534.webp' WHERE slug = 'macbook-12-a1534';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-air-11-a1370-a1465.webp' WHERE slug = 'macbook-air-11-a1370-a1465';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-air-13-a1237-a1466.webp' WHERE slug = 'macbook-air-13-a1237-a1466';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-air-13-m1-a2337.webp' WHERE slug = 'macbook-air-13-m1-a2337';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-pro-13-a1425-a1502.webp' WHERE slug = 'macbook-pro-13-a1425-a1502';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-pro-13-a1706-a1708.webp' WHERE slug = 'macbook-pro-13-a1706-a1708';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-pro-13-a1989.webp' WHERE slug = 'macbook-pro-13-a1989';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-pro-13-a2159.webp' WHERE slug = 'macbook-pro-13-a2159';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-pro-13-a2251-a2289.webp' WHERE slug = 'macbook-pro-13-a2251-a2289';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-pro-13-m1-m2-a2338.webp' WHERE slug = 'macbook-pro-13-m1-m2-a2338';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-pro-15-a1398.webp' WHERE slug = 'macbook-pro-15-a1398';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-pro-15-a1707.webp' WHERE slug = 'macbook-pro-15-a1707';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-pro-15-a1990.webp' WHERE slug = 'macbook-pro-15-a1990';
  UPDATE device_models SET image_url = '/images/devices/macbook/macbook-pro-16-a2141.webp' WHERE slug = 'macbook-pro-16-a2141';

  RAISE NOTICE 'Image URLs updated successfully';
END $$;
