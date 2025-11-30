#!/usr/bin/env node

/**
 * Simple fix for iPad and MacBook model names
 * Uses Supabase Service Role for direct updates
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
  console.error('❌ Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const isDryRun = process.argv.includes('--dry-run');
const hasYearPattern = /\(\d{4}\)/;
const aNumberPattern = /\((A[\dA-Z,\s]+)\)/;

function fixModelName(currentName, year) {
  if (hasYearPattern.test(currentName)) {
    return currentName;
  }

  const aNumberMatch = currentName.match(aNumberPattern);

  if (aNumberMatch) {
    return currentName.replace(aNumberPattern, `(${year}) $&`);
  } else {
    return `${currentName.trim()} (${year})`;
  }
}

async function fixModels() {
  console.log(`🔧 ${isDryRun ? 'DRY RUN:' : ''} Fixing model names...\n`);

  // Fetch ALL models with their category
  const { data: models, error } = await supabase
    .from('device_models')
    .select(`
      id,
      slug,
      name,
      release_year,
      series,
      device_categories(slug)
    `)
    .order('name');

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  // Filter iPad and MacBook models that need fixing
  const modelsToFix = models.filter(model => {
    const categorySlug = model.device_categories?.slug;
    const needsYear = !hasYearPattern.test(model.name) && model.release_year;
    return (categorySlug === 'ipad' || categorySlug === 'macbook') && needsYear;
  });

  console.log(`📊 Found ${modelsToFix.length} models to fix\n`);

  if (modelsToFix.length === 0) {
    console.log('✅ All models already correct!');
    return;
  }

  console.log('='.repeat(80));

  for (const model of modelsToFix) {
    const newName = fixModelName(model.name, model.release_year);
    console.log(`\n🔄 ${model.device_categories.slug} - ${model.slug}`);
    console.log(`   Old: ${model.name}`);
    console.log(`   New: ${newName}`);
    console.log(`   Year: ${model.release_year}`);

    model.newName = newName;
  }

  console.log('\n' + '='.repeat(80));

  if (isDryRun) {
    console.log('\n⚠️  DRY RUN - Run without --dry-run to apply');
    return;
  }

  console.log('\n🚀 Applying updates...\n');

  let successCount = 0;
  let failCount = 0;

  for (const model of modelsToFix) {
    const { error: updateError } = await supabase
      .from('device_models')
      .update({ name: model.newName })
      .eq('id', model.id);

    if (updateError) {
      console.error(`❌ Failed: ${model.slug} -`, updateError.message);
      failCount++;
    } else {
      console.log(`✅ Updated: ${model.slug}`);
      successCount++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📋 Total: ${modelsToFix.length}`);

  if (successCount > 0) {
    console.log('\n✅ Done! Run dev server to verify.');
  }
}

fixModels().catch(console.error);
