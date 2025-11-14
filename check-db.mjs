import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://leiornbrnenbaabeqawk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaW9ybmJybmVuYmFhYmVxYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODg0NTAsImV4cCI6MjA3NzE2NDQ1MH0.2XIDUt4j9kvA5rkNak918YTgyEygfBOrSEXcAyJnEME'
);

const tables = ['device_categories', 'device_models', 'services', 'category_services', 'prices'];

console.log('🔍 Проверка связи с Supabase...\n');

for (const table of tables) {
  const { data, error, count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.log(`❌ ${table}: ОШИБКА - ${error.message}`);
  } else {
    console.log(`✅ ${table}: ${count} записей`);
  }
}
