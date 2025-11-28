#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Отсутствуют env переменные!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

console.log('🔍 Проверка triggers на таблицах...\n')

// SQL запрос для получения всех triggers
const { data, error } = await supabase.rpc('exec_sql', {
  query: `
    SELECT
      t.tgname AS trigger_name,
      c.relname AS table_name,
      p.proname AS function_name,
      CASE t.tgtype & 66
        WHEN 2 THEN 'BEFORE'
        WHEN 64 THEN 'INSTEAD OF'
        ELSE 'AFTER'
      END AS trigger_timing,
      CASE t.tgtype & 28
        WHEN 4 THEN 'INSERT'
        WHEN 8 THEN 'DELETE'
        WHEN 16 THEN 'UPDATE'
        WHEN 12 THEN 'INSERT OR DELETE'
        WHEN 20 THEN 'INSERT OR UPDATE'
        WHEN 24 THEN 'DELETE OR UPDATE'
        WHEN 28 THEN 'INSERT OR UPDATE OR DELETE'
      END AS trigger_event
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_proc p ON t.tgfoid = p.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public'
      AND NOT t.tgisinternal
      AND c.relname IN ('device_models', 'prices', 'services', 'category_services')
    ORDER BY c.relname, t.tgname;
  `
})

if (error) {
  console.error('❌ Ошибка:', error)

  // Попробуем другой способ через SQL
  const query = `
    SELECT
      trigger_name,
      event_object_table AS table_name,
      action_timing,
      string_agg(event_manipulation, ', ') AS events
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
      AND event_object_table IN ('device_models', 'prices', 'services', 'category_services', 'admins')
    GROUP BY trigger_name, event_object_table, action_timing
    ORDER BY event_object_table, trigger_name;
  `

  console.log('Пробую альтернативный запрос...\n')
  console.log('SQL Query:\n', query)
  console.log('\n⚠️ Не могу выполнить SQL напрямую через Supabase клиент.')
  console.log('Попробуйте выполнить этот запрос в Supabase SQL Editor.')
  process.exit(1)
}

console.log('Найдено triggers:', data?.length || 0)
console.log(JSON.stringify(data, null, 2))
