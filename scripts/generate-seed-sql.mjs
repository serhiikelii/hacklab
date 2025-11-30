#!/usr/bin/env node

/**
 * Generate SQL seed file from db-export.json
 * Creates 002_seed_data_rebuild.sql with all current data
 */

import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load exported data
const data = JSON.parse(fs.readFileSync(join(__dirname, '..', 'data', 'db-export.json'), 'utf8'));

// SQL escape helper
function sqlEscape(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') {
    // Escape single quotes by doubling them
    return `'${value.replace(/'/g, "''")}'`;
  }
  if (typeof value === 'object') {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }
  return 'NULL';
}

// Generate INSERT statement
function generateInsert(tableName, records, columns) {
  if (!records || records.length === 0) return '';

  // Escape column names that are SQL keywords
  const escapedColumns = columns.map(col => col === 'order' ? '"order"' : col);

  let sql = `-- Insert ${tableName} (${records.length} records)\n`;
  sql += `INSERT INTO ${tableName} (${escapedColumns.join(', ')})\nVALUES\n`;

  const values = records.map((record, idx) => {
    const vals = columns.map(col => sqlEscape(record[col]));
    const isLast = idx === records.length - 1;
    return `  (${vals.join(', ')})${isLast ? ';' : ','}`;
  });

  sql += values.join('\n');
  return sql + '\n';
}

console.log('🔨 Generating SQL seed file...\n');

let sqlOutput = `-- ================================================================
-- MojService Database Rebuild - Seed Data
-- Generated: ${new Date().toISOString()}
--
-- This file contains all current production data with:
-- ✅ Updated model names (iPad/MacBook with years and A-numbers)
-- ✅ 606 prices
-- ✅ 111 models
-- ✅ 15 services
-- ✅ 24 category-service mappings
-- ================================================================

BEGIN;

-- ================================================================
-- 1. DEVICE CATEGORIES (4 records)
-- ================================================================
`;

// 1. Categories
const categoryColumns = ['id', 'slug', 'name_ru', 'name_en', 'name_cz', 'order', 'created_at', 'updated_at'];
sqlOutput += generateInsert('device_categories', data.categories, categoryColumns);

sqlOutput += `
-- ================================================================
-- 2. DEVICE MODELS (${data.models.length} records)
-- Updated names with years and A-numbers for iPad/MacBook
-- ================================================================
`;

// 2. Models
const modelColumns = ['id', 'category_id', 'slug', 'name', 'series', 'image_url', 'release_year', 'order', 'created_at', 'updated_at'];
sqlOutput += generateInsert('device_models', data.models, modelColumns);

sqlOutput += `
-- ================================================================
-- 3. SERVICES (${data.services.length} records)
-- Universal services + category-specific services
-- ================================================================
`;

// 3. Services
const serviceColumns = ['id', 'slug', 'name_ru', 'name_en', 'name_cz', 'description_ru', 'description_en', 'description_cz', 'service_type', 'order', 'created_at', 'updated_at'];
sqlOutput += generateInsert('services', data.services, serviceColumns);

sqlOutput += `
-- ================================================================
-- 4. CATEGORY SERVICES (${data.category_services.length} records)
-- Mapping categories to services with custom order per category
-- ================================================================
`;

// 4. Category Services
const categoryServiceColumns = ['id', 'category_id', 'service_id', 'is_active', 'order', 'created_at', 'updated_at'];
sqlOutput += generateInsert('category_services', data.category_services, categoryServiceColumns);

sqlOutput += `
-- ================================================================
-- 5. PRICES (${data.prices.length} records)
-- Full price list for all model-service combinations
-- ================================================================
`;

// 5. Prices
const priceColumns = ['id', 'model_id', 'service_id', 'price', 'price_type', 'duration_minutes', 'warranty_months', 'note_ru', 'note_en', 'note_cz', 'created_at', 'updated_at'];
sqlOutput += generateInsert('prices', data.prices, priceColumns);

sqlOutput += `
-- ================================================================
-- 6. DISCOUNTS (${data.discounts.length} records)
-- Standard promotional offers
-- ================================================================
`;

// 6. Discounts
const discountColumns = ['id', 'name_ru', 'name_en', 'name_cz', 'discount_type', 'value', 'conditions_ru', 'conditions_en', 'conditions_cz', 'active', 'created_at', 'updated_at'];
sqlOutput += generateInsert('discounts', data.discounts, discountColumns);

sqlOutput += `
COMMIT;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check record counts
SELECT 'device_categories' as table_name, COUNT(*) as count FROM device_categories
UNION ALL
SELECT 'device_models', COUNT(*) FROM device_models
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'category_services', COUNT(*) FROM category_services
UNION ALL
SELECT 'prices', COUNT(*) FROM prices
UNION ALL
SELECT 'discounts', COUNT(*) FROM discounts;

-- Verify updated model names (should show years in names)
SELECT
  dc.slug as category,
  COUNT(*) as models_count,
  COUNT(CASE WHEN dm.name ~ '\\(\\d{4}\\)' THEN 1 END) as with_year
FROM device_models dm
JOIN device_categories dc ON dm.category_id = dc.id
GROUP BY dc.slug
ORDER BY dc.slug;
`;

// Write to file
const outputPath = join(__dirname, '..', 'supabase', 'migrations', 'rebuild', '002_seed_data_rebuild.sql');
const outputDir = dirname(outputPath);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, sqlOutput);

console.log(`✅ SQL seed file generated: ${outputPath}`);
console.log(`\n📊 Statistics:`);
console.log(`   Categories:        ${data.categories.length}`);
console.log(`   Models:            ${data.models.length}`);
console.log(`   Services:          ${data.services.length}`);
console.log(`   Category-Services: ${data.category_services.length}`);
console.log(`   Prices:            ${data.prices.length}`);
console.log(`   Discounts:         ${data.discounts.length}`);
console.log(`   Total SQL inserts: ${data.categories.length + data.models.length + data.services.length + data.category_services.length + data.prices.length + data.discounts.length}`);
