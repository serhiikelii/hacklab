#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Checking current database state...\n');

async function checkTable(tableName, selectFields = '*') {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select(selectFields, { count: 'exact', head: false });

    if (error) {
      console.log(`❌ ${tableName}: ${error.message}`);
      return { table: tableName, count: 0, error: error.message };
    }

    console.log(`✅ ${tableName}: ${count} rows`);

    // Show first 3 records if exist
    if (data && data.length > 0) {
      console.log(`   Sample (first 3):`);
      data.slice(0, 3).forEach((row, idx) => {
        console.log(`   [${idx + 1}]`, JSON.stringify(row, null, 2).substring(0, 150) + '...');
      });
    }
    console.log('');

    return { table: tableName, count, sample: data?.slice(0, 3) };
  } catch (err) {
    console.log(`❌ ${tableName}: ${err.message}\n`);
    return { table: tableName, count: 0, error: err.message };
  }
}

async function main() {
  const results = {};

  // Check main tables
  results.categories = await checkTable('device_categories', 'id, slug, name_en, order');
  results.models = await checkTable('device_models', 'id, slug, name, category_id, series, order');
  results.services = await checkTable('services', 'id, slug, name_en, service_type, order');
  results.categoryServices = await checkTable('category_services', 'id, category_id, service_id, is_active, order');
  results.prices = await checkTable('prices', 'id, model_id, service_id, price, price_type');
  results.discounts = await checkTable('discounts', 'id, name_en, discount_type, active');
  results.admins = await checkTable('admins', 'id, email, role, is_active');
  results.auditLog = await checkTable('audit_log', 'id, action, table_name, created_at');

  // Check category breakdown if models exist
  if (results.models.count > 0) {
    console.log('\n📊 Models per category:');
    const { data } = await supabase
      .from('device_models')
      .select('category_id, device_categories(slug)');

    const breakdown = {};
    data?.forEach(m => {
      const cat = m.device_categories?.slug || 'unknown';
      breakdown[cat] = (breakdown[cat] || 0) + 1;
    });

    Object.entries(breakdown).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} models`);
    });
  }

  // Check services breakdown
  if (results.services.count > 0) {
    console.log('\n📊 Services breakdown:');
    const { data } = await supabase
      .from('services')
      .select('service_type');

    const breakdown = {};
    data?.forEach(s => {
      breakdown[s.service_type] = (breakdown[s.service_type] || 0) + 1;
    });

    Object.entries(breakdown).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} services`);
    });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 SUMMARY:');
  console.log('='.repeat(60));
  console.log(`Categories:        ${results.categories.count}`);
  console.log(`Models:            ${results.models.count}`);
  console.log(`Services:          ${results.services.count}`);
  console.log(`Category-Services: ${results.categoryServices.count}`);
  console.log(`Prices:            ${results.prices.count} ⚠️ ${results.prices.count === 0 ? 'EMPTY!' : 'OK'}`);
  console.log(`Discounts:         ${results.discounts.count}`);
  console.log(`Admins:            ${results.admins.count}`);
  console.log(`Audit Log:         ${results.auditLog.count}`);
  console.log('='.repeat(60));

  // Check category_services.order field
  if (results.categoryServices.count > 0) {
    console.log('\n🔍 Checking category_services.order field...');
    const { data } = await supabase
      .from('category_services')
      .select('order')
      .limit(5);

    const hasOrder = data?.every(cs => cs.order !== null && cs.order !== undefined);
    console.log(`   order field populated: ${hasOrder ? '✅ YES' : '❌ NO'}`);
    if (data && data.length > 0) {
      console.log(`   Sample orders:`, data.map(cs => cs.order));
    }
  }
}

main().catch(console.error);
