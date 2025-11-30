#!/usr/bin/env node

/**
 * Test frontend data access with anon key
 * This simulates what the frontend sees
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Testing frontend data access (anon key)...\n');

// Test 1: Categories
console.log('1️⃣ Testing device_categories...');
const { data: categories, error: catError } = await supabase
  .from('device_categories')
  .select('*');

if (catError) {
  console.error('   ❌ Error:', catError);
} else {
  console.log(`   ✅ Success: ${categories.length} categories`);
}

// Test 2: Models
console.log('\n2️⃣ Testing device_models...');
const { data: models, error: modelsError } = await supabase
  .from('device_models')
  .select('*')
  .limit(5);

if (modelsError) {
  console.error('   ❌ Error:', modelsError);
} else {
  console.log(`   ✅ Success: ${models.length} models (showing first 5)`);
  if (models.length > 0) {
    console.log(`   Sample: ${models[0].name}`);
  }
}

// Test 3: Services
console.log('\n3️⃣ Testing services...');
const { data: services, error: servicesError } = await supabase
  .from('services')
  .select('*');

if (servicesError) {
  console.error('   ❌ Error:', servicesError);
} else {
  console.log(`   ✅ Success: ${services.length} services`);
}

// Test 4: Category services view
console.log('\n4️⃣ Testing category_services_view...');
const { data: csView, error: csError } = await supabase
  .from('category_services_view')
  .select('*')
  .limit(5);

if (csError) {
  console.error('   ❌ Error:', csError);
} else {
  console.log(`   ✅ Success: ${csView.length} records`);
}

// Test 5: Prices
console.log('\n5️⃣ Testing prices...');
const { data: prices, error: pricesError } = await supabase
  .from('prices')
  .select('*')
  .limit(5);

if (pricesError) {
  console.error('   ❌ Error:', pricesError);
} else {
  console.log(`   ✅ Success: ${prices.length} prices (showing first 5)`);
}

console.log('\n' + '='.repeat(60));
console.log('Summary:');
console.log('  Categories:', catError ? '❌ FAILED' : '✅ OK');
console.log('  Models:', modelsError ? '❌ FAILED' : '✅ OK');
console.log('  Services:', servicesError ? '❌ FAILED' : '✅ OK');
console.log('  Category Services View:', csError ? '❌ FAILED' : '✅ OK');
console.log('  Prices:', pricesError ? '❌ FAILED' : '✅ OK');
