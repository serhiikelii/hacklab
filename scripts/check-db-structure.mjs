#!/usr/bin/env node
/**
 * Проверка реальной структуры БД (audit_log, admins, RLS policies)
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('🔍 Проверка структуры БД...\n')

// 1. Проверка таблицы audit_log
console.log('1️⃣ Проверка таблицы audit_log:')
const { data: auditLog, error: auditError } = await supabase
  .from('audit_log')
  .select('*')
  .limit(1)

if (auditError) {
  console.error('❌ audit_log НЕ существует:', auditError.message)
} else {
  console.log('✅ audit_log существует')
  console.log('   Колонки:', Object.keys(auditLog[0] || {}).join(', '))
}

// 2. Проверка таблицы admins
console.log('\n2️⃣ Проверка таблицы admins:')
const { data: admins, error: adminsError } = await supabase
  .from('admins')
  .select('user_id, email, role, is_active')
  .limit(3)

if (adminsError) {
  console.error('❌ admins НЕ существует:', adminsError.message)
} else {
  console.log('✅ admins существует')
  console.log(`   Найдено админов: ${admins.length}`)
  admins.forEach(admin => {
    console.log(`   - ${admin.email} (${admin.role}, active: ${admin.is_active})`)
  })
}

// 3. Проверка функции is_admin()
console.log('\n3️⃣ Проверка функции is_admin():')
const { data: functionCheck, error: functionError } = await supabase.rpc('is_admin')

if (functionError) {
  console.error('❌ is_admin() НЕ существует:', functionError.message)
} else {
  console.log('✅ is_admin() существует')
  console.log(`   Результат вызова: ${functionCheck}`)
}

// 4. Проверка RLS включен ли для audit_log
console.log('\n4️⃣ Проверка RLS для audit_log:')
const { data: rlsCheck, error: rlsError } = await supabase
  .from('audit_log')
  .select('count')
  .limit(0)

if (rlsError && rlsError.code === 'PGRST301') {
  console.log('✅ RLS включен для audit_log')
} else if (rlsError) {
  console.log('⚠️  Ошибка проверки RLS:', rlsError.message)
} else {
  console.log('✅ RLS включен (доступ через service_role)')
}

// 5. Проверка последних записей audit_log
console.log('\n5️⃣ Последние записи в audit_log:')
const { data: recentAudits, error: recentError } = await supabase
  .from('audit_log')
  .select('id, admin_id, action, table_name, created_at')
  .order('created_at', { ascending: false })
  .limit(5)

if (recentError) {
  console.error('❌ Ошибка чтения audit_log:', recentError.message)
} else if (!recentAudits || recentAudits.length === 0) {
  console.log('⚠️  audit_log ПУСТ - нет записей!')
} else {
  console.log(`✅ Найдено записей: ${recentAudits.length}`)
  recentAudits.forEach(audit => {
    console.log(`   - ${audit.action} на ${audit.table_name} | admin_id: ${audit.admin_id || 'NULL'} | ${audit.created_at}`)
  })
}

console.log('\n✅ Проверка завершена')
