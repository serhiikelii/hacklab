-- Fix iPad and MacBook model names to include year before A-numbers
-- Execute this in Supabase SQL Editor

-- This script adds (YEAR) before existing A-numbers in model names
-- Example: "iPad Air (A1474,A1475)" → "iPad Air (2013) (A1474,A1475)"

BEGIN;

-- Update iPad models that have A-numbers but no year
UPDATE device_models
SET name = CONCAT(
  REGEXP_REPLACE(name, '\s*\((A[^)]+)\)$', ''),  -- Remove A-numbers from end
  ' (',
  release_year::text,
  ') ',
  REGEXP_REPLACE(name, '^.*(\(A[^)]+\))$', '\1')  -- Extract A-numbers
)
WHERE category_id = (SELECT id FROM device_categories WHERE slug = 'ipad')
  AND name ~ '\(A[^)]+\)'  -- Has A-numbers
  AND name !~ '\(\d{4}\)'  -- No year yet
  AND release_year IS NOT NULL;

-- Update MacBook models that have A-numbers but no year
UPDATE device_models
SET name = CONCAT(
  REGEXP_REPLACE(name, '\s*\((A[^)]+)\)$', ''),  -- Remove A-numbers from end
  ' (',
  release_year::text,
  ') ',
  REGEXP_REPLACE(name, '^.*(\(A[^)]+\))$', '\1')  -- Extract A-numbers
)
WHERE category_id = (SELECT id FROM device_categories WHERE slug = 'macbook')
  AND name ~ '\(A[^)]+\)'  -- Has A-numbers
  AND name !~ '\(\d{4}\)'  -- No year yet
  AND release_year IS NOT NULL;

-- Verify changes
SELECT
  dc.slug as category,
  dm.name,
  dm.release_year
FROM device_models dm
JOIN device_categories dc ON dm.category_id = dc.id
WHERE dc.slug IN ('ipad', 'macbook')
ORDER BY dc.slug, dm.name;

COMMIT;
