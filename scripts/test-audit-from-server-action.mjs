#!/usr/bin/env node
/**
 * Тест: Эмуляция вызова audit функций из Server Action
 *
 * ЦЕЛЬ: Проверить что getCurrentAdminId() может получить user_id
 * когда вызывается из серверного контекста БЕЗ cookies (через service_role)
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

// Service role клиент (без auth session)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('🧪 Тест: Проверка audit logging из Server Action\n')

// ============================================================================
// Сценарий 1: Вызов через service_role (как в текущем коде)
// ============================================================================
console.log('1️⃣ Попытка получить auth.uid() через service_role:')

const { data: { user }, error: authError } = await supabase.auth.getUser()

console.log('   User:', user ? `${user.email} (${user.id})` : 'NULL')
console.log('   Error:', authError || 'нет ошибки')

if (!user) {
  console.log('   ❌ service_role НЕ имеет auth session!')
  console.log('   ℹ️  Service role bypasses RLS, но не имеет доступа к user context')
}

// ============================================================================
// Сценарий 2: Что происходит при вызове getCurrentAdminId()
// ============================================================================
console.log('\n2️⃣ Эмуляция getCurrentAdminId():')

async function testGetCurrentAdminId() {
  try {
    // Это то что делает getCurrentAdminId() в audit.ts
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('   ❌ auth.getUser() вернул NULL')
      console.log('   Причина: Server Action вызывается БЕЗ user session')
      return null
    }

    // Проверка что user есть в admins
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('user_id, role, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (adminError || !admin) {
      console.log('   ❌ User не найден в admins')
      return null
    }

    return admin.user_id
  } catch (error) {
    console.log('   ❌ Ошибка:', error.message)
    return null
  }
}

const adminId = await testGetCurrentAdminId()
console.log('   Результат getCurrentAdminId():', adminId || 'NULL')

// ============================================================================
// Вывод и рекомендации
// ============================================================================
console.log('\n📊 АНАЛИЗ:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

if (!adminId) {
  console.log('❌ ПРОБЛЕМА НАЙДЕНА!')
  console.log('')
  console.log('Server Actions НЕ имеют доступа к user session через service_role.')
  console.log('')
  console.log('🔧 РЕШЕНИЕ:')
  console.log('1. ✅ audit.ts уже использует createServerClient с cookies')
  console.log('2. ❓ НО Server Actions могут вызываться в контексте БЕЗ cookies')
  console.log('3. ⚠️  createServerClient требует Next.js request context')
  console.log('')
  console.log('🎯 ПРАВИЛЬНЫЙ ПОДХОД:')
  console.log('   - Server Actions должны передавать adminId явно')
  console.log('   - ИЛИ вызывать getCurrentAdminId() ВНУТРИ Server Action (где есть cookies)')
  console.log('   - НЕ полагаться на глобальный клиент!')
} else {
  console.log('✅ getCurrentAdminId() работает корректно!')
  console.log(`   Получен admin_id: ${adminId}`)
}

console.log('\n📝 СЛЕДУЮЩИЕ ШАГИ:')
console.log('1. Убедиться что Server Actions вызываются в Next.js request context')
console.log('2. Проверить что cookies доступны при вызове createServerClient')
console.log('3. Добавить debug logging в getCurrentAdminId() для отладки')
