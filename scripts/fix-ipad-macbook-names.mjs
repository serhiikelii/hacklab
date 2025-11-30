#!/usr/bin/env node

/**
 * Fix iPad and MacBook model names to include year before A-numbers
 *
 * This script:
 * 1. Finds models with incorrect name format (missing year)
 * 2. Adds (YEAR) before existing A-numbers or at the end if no A-numbers
 * 3. Updates models via Supabase API
 *
 * Usage:
 *   node scripts/fix-ipad-macbook-names.mjs --dry-run  # Preview changes
 *   node scripts/fix-ipad-macbook-names.mjs            # Apply changes
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const isDryRun = process.argv.includes('--dry-run');

// Regex patterns
const hasYearPattern = /\(\d{4}\)/;
const aNumberPattern = /\((A[\dA-Z,\s]+)\)/;

/**
 * Fix model name by adding year in correct position
 */
function fixModelName(currentName, year) {
  // If already has year, skip
  if (hasYearPattern.test(currentName)) {
    return currentName;
  }

  // Check if name has A-numbers
  const aNumberMatch = currentName.match(aNumberPattern);

  if (aNumberMatch) {
    // Has A-numbers: insert (YEAR) before them
    // "iPad Air (A1474,A1475,A1476)" → "iPad Air (2013) (A1474,A1475,A1476)"
    return currentName.replace(aNumberPattern, `(${year}) $&`);
  } else {
    // No A-numbers: append (YEAR) at the end
    // "MacBook Pro 13\"" → "MacBook Pro 13\" (2022)"
    return `${currentName.trim()} (${year})`;
  }
}

async function getCategoryId(slug) {
  const { data, error } = await supabase
    .from('device_categories')
    .select('id')
    .eq('slug', slug)
    .single();

  if (error) {
    throw new Error(`Failed to get category ${slug}: ${error.message}`);
  }

  return data.id;
}

async function fixModels() {
  console.log(`🔧 ${isDryRun ? 'DRY RUN:' : ''} Fixing iPad and MacBook model names...\n`);

  if (isDryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be applied\n');
  }

  const iPadCategoryId = await getCategoryId('ipad');
  const macbookCategoryId = await getCategoryId('macbook');

  // Fetch all iPad and MacBook models
  const { data: models, error: fetchError } = await supabase
    .from('device_models')
    .select('id, slug, name, release_year, series')
    .in('category_id', [iPadCategoryId, macbookCategoryId])
    .order('name');

  if (fetchError) {
    console.error('❌ Error fetching models:', fetchError);
    process.exit(1);
  }

  console.log(`📊 Found ${models.length} models to check\n`);

  const modelsToFix = [];

  // Identify models that need fixing
  for (const model of models) {
    if (!hasYearPattern.test(model.name) && model.release_year) {
      const newName = fixModelName(model.name, model.release_year);
      modelsToFix.push({
        ...model,
        newName
      });
    }
  }

  if (modelsToFix.length === 0) {
    console.log('✅ All models already have correct name format!');
    return;
  }

  console.log(`📋 Models to fix: ${modelsToFix.length}\n`);
  console.log('='.repeat(80));

  // Display changes
  for (const model of modelsToFix) {
    console.log(`\n🔄 ${model.slug}`);
    console.log(`   Old: ${model.name}`);
    console.log(`   New: ${model.newName}`);
    console.log(`   Year: ${model.release_year}`);
  }

  console.log('\n' + '='.repeat(80));

  if (isDryRun) {
    console.log('\n⚠️  DRY RUN - Run without --dry-run to apply changes');
    return;
  }

  // Apply updates
  console.log('\n🚀 Applying updates...\n');

  let successCount = 0;
  let failCount = 0;

  for (const model of modelsToFix) {
    const { error: updateError } = await supabase
      .from('device_models')
      .update({ name: model.newName })
      .eq('id', model.id);

    if (updateError) {
      console.error(`❌ Failed to update ${model.slug}:`, updateError.message);
      failCount++;
    } else {
      console.log(`✅ Updated: ${model.slug}`);
      successCount++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 RESULTS:');
  console.log('='.repeat(80));
  console.log(`✅ Successfully updated: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📋 Total processed: ${modelsToFix.length}`);

  if (successCount > 0) {
    console.log('\n✅ Model names have been fixed!');
    console.log('   Run your dev server to verify the changes.');
  }
}

fixModels().catch(console.error);
