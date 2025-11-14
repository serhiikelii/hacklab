import { readFileSync } from 'fs';

const SUPABASE_ACCESS_TOKEN = 'sbp_d7c69b05f0883145037aa88c3f0638bdf07fbf4d';
const PROJECT_REF = 'leiornbrnenbaabeqawk';

console.log('📥 Читаю миграцию...');
const sql = readFileSync('supabase/migrations/012_add_apple_watch_prices.sql', 'utf-8');

console.log('🚀 Отправляю SQL через Management API...\n');

const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: sql
  })
});

const result = await response.json();

if (!response.ok) {
  console.error('❌ Ошибка:', result);
  process.exit(1);
}

console.log('✅ Миграция применена успешно!');
console.log('Результат:', result);
