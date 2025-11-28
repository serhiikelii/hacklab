#!/usr/bin/env node
/**
 * ПРЯМОЙ ТЕСТ: Вставка записи в audit_log напрямую через Service Role
 * Чтобы убедиться что проблема НЕ в БД, а в коде
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('🧪 ПРЯМОЙ ТЕСТ: Вставка в audit_log через Service Role\n')

// 1. Получить admin_id из таблицы admins
console.log('1️⃣ Получаем admin из таблицы admins...')
const { data: admin, error: adminError } = await supabase
  .from('admins')
  .select('id, user_id, email, role')
  .eq('is_active', true)
  .single()

if (adminError || !admin) {
  console.error('❌ Ошибка получения admin:', adminError)
  process.exit(1)
}

console.log(`✅ Найден admin: ${admin.email}`)
console.log(`   id (PK): ${admin.id}`)
console.log(`   user_id (FK to auth): ${admin.user_id}`)

// 2. Попытка 1: Использовать admin.id (PK admins)
console.log('\n2️⃣ Тест 1: Вставка с admin.id (admins.id)...')
let { data: inserted, error: insertError } = await supabase
  .from('audit_log')
  .insert({
    admin_id: admin.id, // Используем admins.id
    action: 'TEST',
    table_name: 'test_table',
    record_id: '00000000-0000-0000-0000-000000000000',
    old_data: JSON.stringify({ test: 'old' }),
    new_data: JSON.stringify({ test: 'new' })
  })
  .select()
  .single()

if (insertError) {
  console.error('❌ Ошибка вставки:', insertError)
  console.error('   Code:', insertError.code)
  console.error('   Details:', insertError.details)
  console.error('   Hint:', insertError.hint)
  process.exit(1)
}

console.log('✅ Запись успешно вставлена!')
console.log('   ID:', inserted.id)
console.log('   admin_id:', inserted.admin_id)
console.log('   action:', inserted.action)
console.log('   created_at:', inserted.created_at)

// 3. Прочитать обратно для проверки
console.log('\n3️⃣ Читаем запись обратно для проверки...')
const { data: readBack, error: readError } = await supabase
  .from('audit_log')
  .select('*')
  .eq('id', inserted.id)
  .single()

if (readError) {
  console.error('❌ Ошибка чтения:', readError)
} else {
  console.log('✅ Запись успешно прочитана:')
  console.log('   admin_id:', readBack.admin_id, '(ожидалось:', admin.user_id, ')')
  console.log('   action:', readBack.action)

  if (readBack.admin_id === admin.user_id) {
    console.log('\n✅✅✅ ТЕСТ ПРОЙДЕН! БД работает корректно!')
    console.log('\n📊 ВЫВОД:')
    console.log('   - Таблица audit_log работает')
    console.log('   - admin_id записывается корректно')
    console.log('   - Проблема ТОЧНО в коде приложения, НЕ в БД')
  } else {
    console.log('\n❌ admin_id не совпадает!')
  }
}

console.log('\n🧹 Удаляем тестовую запись...')
await supabase.from('audit_log').delete().eq('id', inserted.id)
console.log('✅ Тестовая запись удалена')
