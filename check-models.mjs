import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://leiornbrnenbaabeqawk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaW9ybmJybmVuYmFhYmVxYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODg0NTAsImV4cCI6MjA3NzE2NDQ1MH0.2XIDUt4j9kvA5rkNak918YTgyEygfBOrSEXcAyJnEME'
);

console.log('📱 Модели Apple Watch в БД:\n');
const { data: awModels } = await supabase
  .from('device_models')
  .select('slug, name, image_url')
  .eq('category_id', (await supabase.from('device_categories').select('id').eq('slug', 'apple-watch').single()).data.id)
  .order('name');

awModels?.forEach(m => {
  const hasImage = m.image_url ? '✅' : '❌';
  console.log(`${hasImage} ${m.slug} - ${m.name}`);
  if (m.image_url) console.log(`   URL: ${m.image_url}`);
});

console.log(`\nВсего: ${awModels?.length} моделей\n`);
console.log('='.repeat(50));

console.log('\n💻 Модели MacBook в БД:\n');
const { data: mbModels } = await supabase
  .from('device_models')
  .select('slug, name, image_url')
  .eq('category_id', (await supabase.from('device_categories').select('id').eq('slug', 'macbook').single()).data.id)
  .order('name');

mbModels?.forEach(m => {
  const hasImage = m.image_url ? '✅' : '❌';
  console.log(`${hasImage} ${m.slug} - ${m.name}`);
  if (m.image_url) console.log(`   URL: ${m.image_url}`);
});

console.log(`\nВсего: ${mbModels?.length} моделей`);
