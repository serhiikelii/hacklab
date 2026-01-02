-- Migration 010: Rename announcement theme values to more descriptive names
-- solid → matte (матовый)
-- gradient → glossy (глянцевый)
-- subtle → outline (аутлайн)

-- Step 1: Create new enum with new values
CREATE TYPE announcement_theme_enum_new AS ENUM ('matte', 'glossy', 'outline');

-- Step 2: Add temporary column with new type
ALTER TABLE announcements
ADD COLUMN theme_new announcement_theme_enum_new;

-- Step 3: Copy and transform data
UPDATE announcements
SET theme_new = CASE
  WHEN theme::text = 'solid' THEN 'matte'::announcement_theme_enum_new
  WHEN theme::text = 'gradient' THEN 'glossy'::announcement_theme_enum_new
  WHEN theme::text = 'subtle' THEN 'outline'::announcement_theme_enum_new
  ELSE 'glossy'::announcement_theme_enum_new -- default to glossy
END;

-- Step 4: Drop old column
ALTER TABLE announcements DROP COLUMN theme;

-- Step 5: Rename new column to original name
ALTER TABLE announcements RENAME COLUMN theme_new TO theme;

-- Step 6: Set NOT NULL and default
ALTER TABLE announcements
ALTER COLUMN theme SET NOT NULL,
ALTER COLUMN theme SET DEFAULT 'glossy';

-- Step 7: Drop old enum type
DROP TYPE announcement_theme_enum;

-- Step 8: Rename new enum to original name
ALTER TYPE announcement_theme_enum_new RENAME TO announcement_theme_enum;

-- Verification query
SELECT
  enum_name,
  enum_value
FROM (
  SELECT
    'announcement_theme_enum' as enum_name,
    unnest(enum_range(NULL::announcement_theme_enum))::text as enum_value
  UNION ALL
  SELECT
    'announcement_type_enum' as enum_name,
    unnest(enum_range(NULL::announcement_type_enum))::text as enum_value
) enums
ORDER BY enum_name, enum_value;
