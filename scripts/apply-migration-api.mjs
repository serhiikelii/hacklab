import { readFileSync } from 'fs';

const SUPABASE_ACCESS_TOKEN = 'sbp_d7c69b05f0883145037aa88c3f0638bdf07fbf4d';
const PROJECT_REF = 'leiornbrnenbaabeqawk';

// Получаем путь к миграции из аргументов командной строки
const migrationPath = process.argv[2];

if (!migrationPath) {
  console.error('❌ Ошибка: Укажите путь к миграции');
  console.error('Использование: node scripts/apply-migration-api.mjs <path-to-migration.sql>');
  console.error('Пример: node scripts/apply-migration-api.mjs supabase/migrations/038_fix_admin_authentication_rls.sql');
  process.exit(1);
}

console.log(`📥 Читаю миграцию: ${migrationPath}`);
const sql = readFileSync(migrationPath, 'utf-8');

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
