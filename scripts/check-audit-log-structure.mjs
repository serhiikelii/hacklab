#!/usr/bin/env node
/**
 * Проверка РЕАЛЬНОЙ структуры audit_log включая constraints
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('🔍 Проверка структуры audit_log\n')

// 1. Получить структуру таблицы через information_schema
console.log('1️⃣ Колонки таблицы audit_log:')
const { data: columns } = await supabase.rpc('exec_sql', {
  sql: `
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'audit_log' AND table_schema = 'public'
    ORDER BY ordinal_position
  `
}).catch(() => ({ data: null }))

if (columns) {
  columns.forEach(col => {
    console.log(`   - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`)
  })
} else {
  console.log('   ⚠️  Не удалось получить через information_schema')
}

// 2. Получить foreign keys
console.log('\n2️⃣ Foreign Key Constraints:')
const { data: fkeys } = await supabase.rpc('exec_sql', {
  sql: `
    SELECT
      tc.constraint_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'audit_log'
  `
}).catch(() => ({ data: null }))

if (fkeys) {
  fkeys.forEach(fk => {
    console.log(`   - ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`)
  })
} else {
  console.log('   ⚠️  Не удалось получить foreign keys')
}

// 3. Проверить структуру admins table
console.log('\n3️⃣ Структура таблицы admins:')
const { data: adminCols } = await supabase.rpc('exec_sql', {
  sql: `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'admins' AND table_schema = 'public'
    ORDER BY ordinal_position
  `
}).catch(() => ({ data: null }))

if (adminCols) {
  adminCols.forEach(col => {
    console.log(`   - ${col.column_name}: ${col.data_type}`)
  })
} else {
  console.log('   ⚠️  Не удалось получить структуру admins')
}

// 4. Проверить какие UUID есть в admins
console.log('\n4️⃣ Записи в admins (все колонки):')
const { data: admins } = await supabase
  .from('admins')
  .select('*')
  .limit(5)

if (admins) {
  admins.forEach(admin => {
    console.log(`   Admin:`, admin)
  })
}

console.log('\n✅ Проверка завершена')
