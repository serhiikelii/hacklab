/**
 * Скрипт для обновления категории watch в Supabase
 * Запуск: node scripts/update-watch-category.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateWatchCategory() {
  console.log('Updating watch category...');

  const { data, error } = await supabase
    .from('device_categories')
    .update({
      name_en: 'Apple Watch',
      name_cz: 'Apple Watch',
      name_ru: 'Apple Watch'
    })
    .eq('slug', 'watch')
    .select();

  if (error) {
    console.error('Error updating category:', error);
    process.exit(1);
  }

  console.log('Successfully updated watch category:', data);
}

updateWatchCategory();
