#!/usr/bin/env node

/**
 * Complete database rebuild via Supabase Management API
 *
 * Steps:
 * 1. Drop all existing tables, triggers, functions, types
 * 2. Apply 001_initial_schema_rebuild.sql
 * 3. Apply 002_seed_data_rebuild.sql
 * 4. Verify data
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_ACCESS_TOKEN = 'sbp_d7c69b05f0883145037aa88c3f0638bdf07fbf4d';
const PROJECT_REF = 'leiornbrnenbaabeqawk';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Execute SQL via Management API
async function executeSql(sql, description) {
  console.log(`🔧 ${description}...`);

  const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  const result = await response.json();

  if (!response.ok) {
    console.error(`❌ Error:`, result);
    return false;
  }

  console.log(`✅ Success`);
  return true;
}

// Main rebuild function
async function rebuildDatabase() {
  console.log('🚀 MojService - Complete Database Rebuild\n');
  console.log('⚠️  WARNING: This will DELETE all existing data!');
  console.log('   (Storage bucket "device-images" will NOT be affected)\n');

  // Step 1: Drop everything
  console.log('📋 STEP 1/4: Dropping existing schema');
  console.log('='.repeat(70));

  const dropScript = `
-- Drop triggers first
DROP TRIGGER IF EXISTS audit_device_models ON device_models CASCADE;
DROP TRIGGER IF EXISTS audit_prices ON prices CASCADE;
DROP TRIGGER IF EXISTS audit_services ON services CASCADE;
DROP TRIGGER IF EXISTS audit_device_categories ON device_categories CASCADE;
DROP TRIGGER IF EXISTS audit_category_services ON category_services CASCADE;
DROP TRIGGER IF EXISTS audit_discounts ON discounts CASCADE;

DROP TRIGGER IF EXISTS update_device_categories_updated_at ON device_categories CASCADE;
DROP TRIGGER IF EXISTS update_device_models_updated_at ON device_models CASCADE;
DROP TRIGGER IF EXISTS update_services_updated_at ON services CASCADE;
DROP TRIGGER IF EXISTS update_category_services_updated_at ON category_services CASCADE;
DROP TRIGGER IF EXISTS update_prices_updated_at ON prices CASCADE;
DROP TRIGGER IF EXISTS update_discounts_updated_at ON discounts CASCADE;

-- Drop view
DROP VIEW IF EXISTS category_services_view CASCADE;

-- Drop tables (in order, respecting FK constraints)
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS prices CASCADE;
DROP TABLE IF EXISTS category_services CASCADE;
DROP TABLE IF EXISTS device_models CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS device_categories CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS log_audit_changes() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop ENUMs
DROP TYPE IF EXISTS service_type_enum CASCADE;
DROP TYPE IF EXISTS price_type_enum CASCADE;
DROP TYPE IF EXISTS discount_type_enum CASCADE;
`;

  const dropSuccess = await executeSql(dropScript, 'Dropping all existing objects');
  if (!dropSuccess) {
    console.error('\n❌ Failed to drop existing schema. Aborting.');
    process.exit(1);
  }

  // Step 2: Apply schema
  console.log('\n📋 STEP 2/4: Applying new schema');
  console.log('='.repeat(70));

  const schemaPath = join(__dirname, '..', 'supabase', 'migrations', 'rebuild', '001_initial_schema_rebuild.sql');
  const schemaSql = readFileSync(schemaPath, 'utf8');

  console.log('   📦 Creating:');
  console.log('      - 3 ENUM types');
  console.log('      - 8 tables with constraints');
  console.log('      - 20+ indexes');
  console.log('      - 3 functions (is_admin, log_audit_changes, update_updated_at)');
  console.log('      - 12 triggers');
  console.log('      - RLS policies');
  console.log('      - category_services_view');

  const schemaSuccess = await executeSql(schemaSql, '\n   Executing schema migration');
  if (!schemaSuccess) {
    console.error('\n❌ Failed to apply schema. Aborting.');
    process.exit(1);
  }

  // Step 3: Apply seed data
  console.log('\n📋 STEP 3/4: Loading seed data');
  console.log('='.repeat(70));

  const seedPath = join(__dirname, '..', 'supabase', 'migrations', 'rebuild', '002_seed_data_rebuild.sql');
  const seedSql = readFileSync(seedPath, 'utf8');

  console.log('   📦 Inserting:');
  console.log('      - 4 categories');
  console.log('      - 111 models (with updated iPad/MacBook names)');
  console.log('      - 15 services');
  console.log('      - 24 category-service mappings');
  console.log('      - 606 prices');
  console.log('      - 3 discounts');
  console.log('   ⏳ This may take 30-60 seconds (763 INSERT operations)...');

  const seedSuccess = await executeSql(seedSql, '\n   Executing seed data');
  if (!seedSuccess) {
    console.error('\n❌ Failed to load seed data. Database is in inconsistent state!');
    process.exit(1);
  }

  // Step 4: Verify
  console.log('\n📋 STEP 4/4: Verifying data');
  console.log('='.repeat(70));

  const { data: categories, count: catCount } = await supabase
    .from('device_categories')
    .select('*', { count: 'exact', head: true });

  const { data: models, count: modelCount } = await supabase
    .from('device_models')
    .select('*', { count: 'exact', head: true });

  const { data: services, count: serviceCount } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true });

  const { data: categoryServices, count: csCount } = await supabase
    .from('category_services')
    .select('*', { count: 'exact', head: true });

  const { data: prices, count: priceCount } = await supabase
    .from('prices')
    .select('*', { count: 'exact', head: true });

  const { data: discounts, count: discountCount } = await supabase
    .from('discounts')
    .select('*', { count: 'exact', head: true });

  console.log('\n📊 Data verification:');
  console.log(`   Categories:        ${catCount || 0} ${catCount === 4 ? '✅' : '❌'} (expected: 4)`);
  console.log(`   Models:            ${modelCount || 0} ${modelCount === 111 ? '✅' : '❌'} (expected: 111)`);
  console.log(`   Services:          ${serviceCount || 0} ${serviceCount === 15 ? '✅' : '❌'} (expected: 15)`);
  console.log(`   Category-Services: ${csCount || 0} ${csCount === 24 ? '✅' : '❌'} (expected: 24)`);
  console.log(`   Prices:            ${priceCount || 0} ${priceCount === 606 ? '✅' : '❌'} (expected: 606)`);
  console.log(`   Discounts:         ${discountCount || 0} ${discountCount === 3 ? '✅' : '❌'} (expected: 3)`);

  const allCorrect =
    catCount === 4 &&
    modelCount === 111 &&
    serviceCount === 15 &&
    csCount === 24 &&
    priceCount === 606 &&
    discountCount === 3;

  if (allCorrect) {
    console.log('\n' + '='.repeat(70));
    console.log('✅ DATABASE REBUILD COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(70));
    console.log('\n📝 Next steps:');
    console.log('   1. Create admin users via Supabase Auth UI:');
    console.log('      https://supabase.com/dashboard/project/leiornbrnenbaabeqawk/auth/users');
    console.log('\n   2. Add admins to admins table (SQL Editor):');
    console.log('      INSERT INTO admins (user_id, email, role, is_active)');
    console.log('      VALUES (');
    console.log('        (SELECT id FROM auth.users WHERE email = \'serhii.kelii@gmail.com\'),');
    console.log('        \'serhii.kelii@gmail.com\',');
    console.log('        \'superadmin\',');
    console.log('        TRUE');
    console.log('      );');
    console.log('\n   3. Test the application!');
  } else {
    console.log('\n⚠️  WARNING: Data counts do not match expected values!');
    console.log('   Please check the logs above and investigate.');
  }
}

console.log('Starting in 3 seconds... Press Ctrl+C to cancel.\n');
await new Promise(resolve => setTimeout(resolve, 3000));

rebuildDatabase().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  console.error(error);
  process.exit(1);
});
