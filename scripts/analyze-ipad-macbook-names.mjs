#!/usr/bin/env node

/**
 * Analyze iPad and MacBook model names to find incorrect formats
 *
 * Correct format: "Model Name (YEAR) (A1234,A5678)"
 * Examples:
 *   ✅ "MacBook Air 11" (2015) (A1370, A1465)"
 *   ✅ "iPad 10 (2022) (A2696,A2757,A2777)"
 *   ❌ "MacBook Pro 13" (A1706,A1708)" - missing year
 *   ❌ "iPad Air (A1474,A1475,A1476)" - missing year
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Regex to check if name has year in format (YYYY)
const hasYearPattern = /\(\d{4}\)/;
// Regex to extract A-numbers: (A1234,A5678) or (A1234)
const aNumberPattern = /\(A[\dA-Z,\s]+\)/;

async function analyzeModels() {
  console.log('🔍 Analyzing iPad and MacBook model names...\n');

  // Fetch iPad models
  const { data: iPadModels, error: iPadError } = await supabase
    .from('device_models')
    .select('id, slug, name, release_year, series')
    .eq('category_id', (await supabase.from('device_categories').select('id').eq('slug', 'ipad').single()).data.id)
    .order('order');

  if (iPadError) {
    console.error('❌ Error fetching iPad models:', iPadError);
    return;
  }

  // Fetch MacBook models
  const { data: macbookModels, error: macbookError } = await supabase
    .from('device_models')
    .select('id, slug, name, release_year, series')
    .eq('category_id', (await supabase.from('device_categories').select('id').eq('slug', 'macbook').single()).data.id)
    .order('order');

  if (macbookError) {
    console.error('❌ Error fetching MacBook models:', macbookError);
    return;
  }

  console.log('📊 iPad Models Analysis:');
  console.log('='.repeat(80));

  const incorrectIPad = [];
  iPadModels.forEach((model, idx) => {
    const hasYear = hasYearPattern.test(model.name);
    const hasANumbers = aNumberPattern.test(model.name);
    const status = hasYear ? '✅' : '❌';

    console.log(`${status} [${idx + 1}/${iPadModels.length}] ${model.name}`);
    console.log(`   Year in DB: ${model.release_year}, Has (YYYY): ${hasYear}, Has A-numbers: ${hasANumbers}`);

    if (!hasYear && model.release_year) {
      incorrectIPad.push(model);
    }
  });

  console.log('\n📊 MacBook Models Analysis:');
  console.log('='.repeat(80));

  const incorrectMacBook = [];
  macbookModels.forEach((model, idx) => {
    const hasYear = hasYearPattern.test(model.name);
    const hasANumbers = aNumberPattern.test(model.name);
    const status = hasYear ? '✅' : '❌';

    console.log(`${status} [${idx + 1}/${macbookModels.length}] ${model.name}`);
    console.log(`   Year in DB: ${model.release_year}, Has (YYYY): ${hasYear}, Has A-numbers: ${hasANumbers}`);

    if (!hasYear && model.release_year) {
      incorrectMacBook.push(model);
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('📋 SUMMARY:');
  console.log('='.repeat(80));
  console.log(`iPad total: ${iPadModels.length}, Incorrect: ${incorrectIPad.length}`);
  console.log(`MacBook total: ${macbookModels.length}, Incorrect: ${incorrectMacBook.length}`);
  console.log(`\nTotal models to fix: ${incorrectIPad.length + incorrectMacBook.length}`);

  if (incorrectIPad.length > 0 || incorrectMacBook.length > 0) {
    console.log('\n⚠️  Models that need fixing:');

    if (incorrectIPad.length > 0) {
      console.log('\niPad models:');
      incorrectIPad.forEach(m => {
        console.log(`  - ${m.name} → needs (${m.release_year}) added`);
      });
    }

    if (incorrectMacBook.length > 0) {
      console.log('\nMacBook models:');
      incorrectMacBook.forEach(m => {
        console.log(`  - ${m.name} → needs (${m.release_year}) added`);
      });
    }
  } else {
    console.log('\n✅ All models have correct name format!');
  }

  return {
    iPadModels,
    macbookModels,
    incorrectIPad,
    incorrectMacBook
  };
}

analyzeModels().catch(console.error);
