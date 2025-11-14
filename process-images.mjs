import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  'https://leiornbrnenbaabeqawk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaW9ybmJybmVuYmFhYmVxYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODg0NTAsImV4cCI6MjA3NzE2NDQ1MH0.2XIDUt4j9kvA5rkNak918YTgyEygfBOrSEXcAyJnEME'
);

const SOURCE_WATCH = 'C:\\Users\\prose\\Automation\\projects\\apple-watch-scraped';
const SOURCE_MACBOOK = 'C:\\Users\\prose\\Automation\\projects\\macbook-scraped';
const DEST_WATCH = 'C:\\Users\\prose\\Automation\\projects\\mojservice\\public\\images\\devices\\apple-watch';
const DEST_MACBOOK = 'C:\\Users\\prose\\Automation\\projects\\mojservice\\public\\images\\devices\\macbook';

console.log('🔍 Получаем модели из БД...\n');

// Получаем модели Apple Watch
const { data: awModels } = await supabase
  .from('device_models')
  .select('slug, name')
  .eq('category_id', (await supabase.from('device_categories').select('id').eq('slug', 'apple-watch').single()).data.id)
  .order('name');

// Получаем модели MacBook
const { data: mbModels } = await supabase
  .from('device_models')
  .select('slug, name')
  .eq('category_id', (await supabase.from('device_categories').select('id').eq('slug', 'macbook').single()).data.id)
  .order('name');

console.log(`✅ Apple Watch: ${awModels.length} моделей`);
console.log(`✅ MacBook: ${mbModels.length} моделей\n`);

// Читаем скачанные файлы
const watchFiles = fs.readdirSync(SOURCE_WATCH).filter(f => f.match(/\.(jpg|png|webp)$/i) && !f.includes('instruction') && !f.includes('logo'));
const macbookFiles = fs.readdirSync(SOURCE_MACBOOK).filter(f => f.match(/\.(jpg|png|webp)$/i) && !f.includes('logo') && !f.includes('apple-logo'));

console.log(`📦 Скачано Apple Watch: ${watchFiles.length} файлов`);
console.log(`📦 Скачано MacBook: ${macbookFiles.length} файлов\n`);

console.log('='

.repeat(70));
console.log('APPLE WATCH - Сопоставление');
console.log('='.repeat(70) + '\n');

const watchMapping = [];

// Сопоставление Apple Watch
for (const model of awModels) {
  const possibleNames = [
    model.slug,
    model.slug.replace(/-/g, ''),
    model.slug.replace('apple-watch-', ''),
    model.slug.replace('apple-watch-', 'aw-'),
    model.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  ];

  let found = null;
  for (const fileName of watchFiles) {
    const fileNameLower = fileName.toLowerCase().replace(/[-_]/g, '');
    for (const possible of possibleNames) {
      const possibleNorm = possible.toLowerCase().replace(/[-_]/g, '');
      if (fileNameLower.includes(possibleNorm) || possibleNorm.includes(fileNameLower.split('.')[0])) {
        found = fileName;
        break;
      }
    }
    if (found) break;
  }

  if (found) {
    const ext = path.extname(found);
    const destFile = `${model.slug}${ext}`;
    watchMapping.push({ model: model.slug, source: found, dest: destFile });
    console.log(`✅ ${model.slug.padEnd(30)} -> ${found}`);
  } else {
    console.log(`❌ ${model.slug.padEnd(30)} -> НЕ НАЙДЕНО`);
  }
}

console.log('\n' + '='.repeat(70));
console.log('MACBOOK - Сопоставление');
console.log('='.repeat(70) + '\n');

const macbookMapping = [];

// Сопоставление MacBook
for (const model of mbModels) {
  const modelNumbers = model.slug.match(/a\d{4}/gi) || [];
  const modelInfo = model.slug
    .replace(/macbook-/, '')
    .replace(/-a\d{4}.*/, '')
    .replace(/pro-/, 'pro-')
    .replace(/air-/, 'air-');

  let found = null;
  for (const fileName of macbookFiles) {
    const fileNameLower = fileName.toLowerCase();

    // Проверяем по номерам моделей (A1234)
    for (const num of modelNumbers) {
      if (fileNameLower.includes(num.toLowerCase())) {
        found = fileName;
        break;
      }
    }

    // Проверяем по описанию (macbook-air-13-m2)
    if (!found && fileNameLower.includes(modelInfo.toLowerCase().replace(/-/g, ''))) {
      found = fileName;
    }

    if (found) break;
  }

  if (found) {
    const ext = path.extname(found);
    const destFile = `${model.slug}${ext}`;
    macbookMapping.push({ model: model.slug, source: found, dest: destFile });
    console.log(`✅ ${model.slug.padEnd(40)} -> ${found}`);
  } else {
    console.log(`❌ ${model.slug.padEnd(40)} -> НЕ НАЙДЕНО`);
  }
}

console.log('\n' + '='.repeat(70));
console.log(`Итого сопоставлено:`);
console.log(`  Apple Watch: ${watchMapping.length}/${awModels.length}`);
console.log(`  MacBook: ${macbookMapping.length}/${mbModels.length}`);
console.log('='.repeat(70) + '\n');

// Копируем файлы
console.log('📋 Копирование файлов...\n');

for (const item of watchMapping) {
  const src = path.join(SOURCE_WATCH, item.source);
  const dest = path.join(DEST_WATCH, item.dest);
  fs.copyFileSync(src, dest);
  console.log(`✅ ${item.dest}`);
}

for (const item of macbookMapping) {
  const src = path.join(SOURCE_MACBOOK, item.source);
  const dest = path.join(DEST_MACBOOK, item.dest);
  fs.copyFileSync(src, dest);
  console.log(`✅ ${item.dest}`);
}

console.log('\n✨ Готово! Файлы скопированы.');
console.log(`\n📊 Статистика:`);
console.log(`  Apple Watch: ${watchMapping.length} изображений скопировано`);
console.log(`  MacBook: ${macbookMapping.length} изображений скопировано`);
