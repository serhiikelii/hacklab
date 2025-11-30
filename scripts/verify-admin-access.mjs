import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '..', '.env.local');

dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 Verifying admin user_id matching between auth.users and public.admins...\n');

// Step 1: Get users from auth.users
console.log('1️⃣ Fetching from auth.users:');
const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

if (authError) {
  console.error('❌ Error fetching auth.users:', authError.message);
  process.exit(1);
}

const adminEmails = ['serhii.kelii@gmail.com', 'proservicemanor@gmail.com'];
const authData = authUsers.users
  .filter(u => adminEmails.includes(u.email))
  .map(u => ({ id: u.id, email: u.email }));

console.log('   Found users in auth.users:');
authData.forEach(u => console.log(`   - ${u.email}: ${u.id}`));

// Step 2: Get users from public.admins
console.log('\n2️⃣ Fetching from public.admins:');
const { data: adminsData, error: adminsError } = await supabase
  .from('admins')
  .select('user_id, email, role, is_active')
  .in('email', adminEmails);

if (adminsError) {
  console.error('❌ Error fetching admins:', adminsError.message);
  process.exit(1);
}

console.log('   Found users in public.admins:');
adminsData.forEach(a => console.log(`   - ${a.email}: ${a.user_id} (${a.role}, active: ${a.is_active})`));

// Step 3: Compare
console.log('\n3️⃣ Comparison:');
authData.forEach(auth => {
  const admin = adminsData.find(a => a.email === auth.email);
  if (!admin) {
    console.log(`   ❌ ${auth.email}: NOT FOUND in admins table`);
  } else if (auth.id !== admin.user_id) {
    console.log(`   ❌ ${auth.email}: MISMATCH!`);
    console.log(`      auth.users: ${auth.id}`);
    console.log(`      public.admins: ${admin.user_id}`);
  } else {
    console.log(`   ✅ ${auth.email}: MATCH (${auth.id})`);
  }
});

console.log('\n============================================================');
