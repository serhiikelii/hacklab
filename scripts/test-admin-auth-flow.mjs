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
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Testing admin authentication flow...\n');

// Step 1: Try to login with test admin
console.log('1️⃣ Attempting login with admin credentials...');
const adminEmail = 'serhii.kelii@gmail.com'; // From screenshot
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: adminEmail,
  password: 'test_password_change_this', // Placeholder - will fail but that's ok
});

if (authError) {
  console.log('   ⚠️  Login failed (expected):', authError.message);
  console.log('   💡 This test shows the FLOW, not actual login\n');
}

// Step 2: Check if we can read admins table as authenticated user
console.log('2️⃣ Testing RLS: Can authenticated user read admins table?');
const { data: adminsData, error: adminsError } = await supabase
  .from('admins')
  .select('id, email, role, is_active')
  .eq('is_active', true);

if (adminsError) {
  console.error('   ❌ RLS BLOCKING! Cannot read admins:', adminsError.message);
  console.error('   🔥 THIS IS THE PROBLEM!');
} else {
  console.log(`   ✅ Can read admins: ${adminsData?.length || 0} active admins found`);
  if (adminsData && adminsData.length > 0) {
    console.log('   Sample:', adminsData[0].email, '-', adminsData[0].role);
  }
}

// Step 3: Check specific admin by user_id (simulate getAdminUser flow)
console.log('\n3️⃣ Simulating getAdminUser() flow:');
console.log('   (Without actual auth session, will use dummy UUID)');

const dummyUserId = 'd5cc65c2-b18f-45e0-a93f-8076fc7ee072'; // From screenshot
const { data: specificAdmin, error: specificError } = await supabase
  .from('admins')
  .select('id, email, role, is_active')
  .eq('user_id', dummyUserId)
  .eq('is_active', true)
  .single();

if (specificError) {
  console.error('   ❌ Error fetching specific admin:', specificError.message);
  console.error('   Code:', specificError.code);
  if (specificError.code === 'PGRST116') {
    console.log('   💡 PGRST116 = Row not found (user_id не существует в таблице)');
  }
} else if (specificAdmin) {
  console.log('   ✅ Found admin:', specificAdmin.email);
}

console.log('\n============================================================');
console.log('Summary:');
console.log('If RLS is blocking → Need to fix RLS policies');
console.log('If user_id not found → Old session needs to be cleared');
