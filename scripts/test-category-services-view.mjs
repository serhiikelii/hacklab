import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '..', '.env.local');

dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Testing category_services_view access (anon key)...\n');

// Test 1: Query view for iPhone
console.log('1️⃣ Testing category_services_view for iPhone...');
const { data: iphoneData, error: iphoneError } = await supabase
  .from('category_services_view')
  .select('*')
  .eq('category_slug', 'iphone')
  .eq('is_active', true)
  .order('order', { ascending: true });

if (iphoneError) {
  console.error('   ❌ Error:', iphoneError.message);
} else {
  console.log(`   ✅ Success: ${iphoneData?.length || 0} services for iPhone`);
  if (iphoneData && iphoneData.length > 0) {
    console.log('   Sample:', iphoneData[0].service_name_ru);
  }
}

// Test 2: Query view for iPad
console.log('\n2️⃣ Testing category_services_view for iPad...');
const { data: ipadData, error: ipadError } = await supabase
  .from('category_services_view')
  .select('*')
  .eq('category_slug', 'ipad')
  .eq('is_active', true);

if (ipadError) {
  console.error('   ❌ Error:', ipadError.message);
} else {
  console.log(`   ✅ Success: ${ipadData?.length || 0} services for iPad`);
}

// Test 3: Query all active services
console.log('\n3️⃣ Testing all active services from view...');
const { data: allData, error: allError } = await supabase
  .from('category_services_view')
  .select('category_slug, service_slug')
  .eq('is_active', true);

if (allError) {
  console.error('   ❌ Error:', allError.message);
} else {
  console.log(`   ✅ Success: ${allData?.length || 0} total active category-service pairs`);
}

console.log('\n============================================================');
if (!iphoneError && !ipadError && !allError) {
  console.log('✅ ALL TESTS PASSED! Frontend should work now.');
} else {
  console.log('❌ SOME TESTS FAILED! Check errors above.');
}
