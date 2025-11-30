#!/usr/bin/env node

/**
 * Export ALL current database data for seed file
 * Exports: categories, models (with updated names), services, category_services, prices, discounts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function exportAllData() {
  console.log('📦 Exporting all database data...\n');

  const data = {};

  // 1. Categories
  console.log('📋 Exporting device_categories...');
  const { data: categories, error: catError } = await supabase
    .from('device_categories')
    .select('*')
    .order('order');

  if (catError) {
    console.error('❌ Error fetching categories:', catError);
    return;
  }
  data.categories = categories;
  console.log(`   ✅ ${categories.length} categories exported`);

  // 2. Models
  console.log('📱 Exporting device_models...');
  const { data: models, error: modelsError } = await supabase
    .from('device_models')
    .select('*')
    .order('category_id, order');

  if (modelsError) {
    console.error('❌ Error fetching models:', modelsError);
    return;
  }
  data.models = models;
  console.log(`   ✅ ${models.length} models exported`);

  // 3. Services
  console.log('🔧 Exporting services...');
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .order('order');

  if (servicesError) {
    console.error('❌ Error fetching services:', servicesError);
    return;
  }
  data.services = services;
  console.log(`   ✅ ${services.length} services exported`);

  // 4. Category Services
  console.log('🔗 Exporting category_services...');
  const { data: categoryServices, error: csError } = await supabase
    .from('category_services')
    .select('*')
    .order('category_id, order');

  if (csError) {
    console.error('❌ Error fetching category_services:', csError);
    return;
  }
  data.category_services = categoryServices;
  console.log(`   ✅ ${categoryServices.length} category_services exported`);

  // 5. Prices
  console.log('💰 Exporting prices...');
  const { data: prices, error: pricesError } = await supabase
    .from('prices')
    .select('*')
    .order('model_id, service_id');

  if (pricesError) {
    console.error('❌ Error fetching prices:', pricesError);
    return;
  }
  data.prices = prices;
  console.log(`   ✅ ${prices.length} prices exported`);

  // 6. Discounts
  console.log('🎁 Exporting discounts...');
  const { data: discounts, error: discountsError } = await supabase
    .from('discounts')
    .select('*');

  if (discountsError) {
    console.error('❌ Error fetching discounts:', discountsError);
    return;
  }
  data.discounts = discounts;
  console.log(`   ✅ ${discounts.length} discounts exported`);

  // Save to JSON file
  const outputPath = join(__dirname, '..', 'data', 'db-export.json');
  const outputDir = dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`\n✅ Data exported to: ${outputPath}`);

  // Summary
  console.log('\n📊 Export Summary:');
  console.log('='.repeat(50));
  console.log(`Categories:        ${data.categories.length}`);
  console.log(`Models:            ${data.models.length}`);
  console.log(`Services:          ${data.services.length}`);
  console.log(`Category-Services: ${data.category_services.length}`);
  console.log(`Prices:            ${data.prices.length}`);
  console.log(`Discounts:         ${data.discounts.length}`);
  console.log('='.repeat(50));
}

exportAllData().catch(console.error);
