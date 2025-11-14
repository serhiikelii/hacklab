-- Migration: Bulk update image_url for Apple Watch and MacBook models
-- Uses single UPDATE with CASE for better compatibility with Management API

UPDATE device_models
SET image_url = CASE slug
  -- Apple Watch models
  WHEN 'apple-watch-9' THEN '/images/devices/apple-watch/apple-watch-9.png'
  WHEN 'apple-watch-se' THEN '/images/devices/apple-watch/apple-watch-se.png'
  WHEN 'apple-watch-se-2-40mm' THEN '/images/devices/apple-watch/apple-watch-se-2-40mm.png'
  WHEN 'apple-watch-se-2-44mm' THEN '/images/devices/apple-watch/apple-watch-se-2-44mm.png'
  WHEN 'apple-watch-se-40mm' THEN '/images/devices/apple-watch/apple-watch-se-40mm.jpg'
  WHEN 'apple-watch-se-44mm' THEN '/images/devices/apple-watch/apple-watch-se-44mm.jpg'
  WHEN 'apple-watch-series-4-40mm' THEN '/images/devices/apple-watch/apple-watch-series-4-40mm.jpg'
  WHEN 'apple-watch-series-4-44mm' THEN '/images/devices/apple-watch/apple-watch-series-4-44mm.jpg'
  WHEN 'apple-watch-series-5-40mm' THEN '/images/devices/apple-watch/apple-watch-series-5-40mm.jpg'
  WHEN 'apple-watch-series-5-44mm' THEN '/images/devices/apple-watch/apple-watch-series-5-44mm.jpg'
  WHEN 'apple-watch-series-6-40mm' THEN '/images/devices/apple-watch/apple-watch-series-6-40mm.jpg'
  WHEN 'apple-watch-series-6-44mm' THEN '/images/devices/apple-watch/apple-watch-series-6-44mm.jpg'
  WHEN 'apple-watch-series-7-41mm' THEN '/images/devices/apple-watch/apple-watch-series-7-41mm.jpg'
  WHEN 'apple-watch-series-7-45mm' THEN '/images/devices/apple-watch/apple-watch-series-7-45mm.jpg'
  WHEN 'apple-watch-series-8-41mm' THEN '/images/devices/apple-watch/apple-watch-series-8-41mm.jpg'
  WHEN 'apple-watch-series-8-45mm' THEN '/images/devices/apple-watch/apple-watch-series-8-45mm.jpg'
  WHEN 'apple-watch-ultra-49mm' THEN '/images/devices/apple-watch/apple-watch-ultra-49mm.png'
  -- MacBook models
  WHEN 'macbook-12-a1534' THEN '/images/devices/macbook/macbook-12-a1534.webp'
  WHEN 'macbook-air-11-a1370-a1465' THEN '/images/devices/macbook/macbook-air-11-a1370-a1465.webp'
  WHEN 'macbook-air-13-a1237-a1466' THEN '/images/devices/macbook/macbook-air-13-a1237-a1466.webp'
  WHEN 'macbook-air-13-m1-a2337' THEN '/images/devices/macbook/macbook-air-13-m1-a2337.webp'
  WHEN 'macbook-pro-13-a1425-a1502' THEN '/images/devices/macbook/macbook-pro-13-a1425-a1502.webp'
  WHEN 'macbook-pro-13-a1706-a1708' THEN '/images/devices/macbook/macbook-pro-13-a1706-a1708.webp'
  WHEN 'macbook-pro-13-a1989' THEN '/images/devices/macbook/macbook-pro-13-a1989.webp'
  WHEN 'macbook-pro-13-a2159' THEN '/images/devices/macbook/macbook-pro-13-a2159.webp'
  WHEN 'macbook-pro-13-a2251-a2289' THEN '/images/devices/macbook/macbook-pro-13-a2251-a2289.webp'
  WHEN 'macbook-pro-13-m1-m2-a2338' THEN '/images/devices/macbook/macbook-pro-13-m1-m2-a2338.webp'
  WHEN 'macbook-pro-15-a1398' THEN '/images/devices/macbook/macbook-pro-15-a1398.webp'
  WHEN 'macbook-pro-15-a1707' THEN '/images/devices/macbook/macbook-pro-15-a1707.webp'
  WHEN 'macbook-pro-15-a1990' THEN '/images/devices/macbook/macbook-pro-15-a1990.webp'
  WHEN 'macbook-pro-16-a2141' THEN '/images/devices/macbook/macbook-pro-16-a2141.webp'
  ELSE image_url
END
WHERE slug IN (
  'apple-watch-9', 'apple-watch-se', 'apple-watch-se-2-40mm', 'apple-watch-se-2-44mm',
  'apple-watch-se-40mm', 'apple-watch-se-44mm', 'apple-watch-series-4-40mm', 'apple-watch-series-4-44mm',
  'apple-watch-series-5-40mm', 'apple-watch-series-5-44mm', 'apple-watch-series-6-40mm', 'apple-watch-series-6-44mm',
  'apple-watch-series-7-41mm', 'apple-watch-series-7-45mm', 'apple-watch-series-8-41mm', 'apple-watch-series-8-45mm',
  'apple-watch-ultra-49mm',
  'macbook-12-a1534', 'macbook-air-11-a1370-a1465', 'macbook-air-13-a1237-a1466', 'macbook-air-13-m1-a2337',
  'macbook-pro-13-a1425-a1502', 'macbook-pro-13-a1706-a1708', 'macbook-pro-13-a1989', 'macbook-pro-13-a2159',
  'macbook-pro-13-a2251-a2289', 'macbook-pro-13-m1-m2-a2338', 'macbook-pro-15-a1398', 'macbook-pro-15-a1707',
  'macbook-pro-15-a1990', 'macbook-pro-16-a2141'
);
