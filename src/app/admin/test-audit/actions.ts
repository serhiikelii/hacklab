'use server'

import { logCreate, getCurrentAdminId } from '@/lib/audit'
import { redirect } from 'next/navigation'

export async function testAuditSystem(): Promise<void> {
  console.log('\n' + '='.repeat(60))
  console.log('🧪 ТЕСТИРОВАНИЕ СИСТЕМЫ АУДИТА')
  console.log('='.repeat(60))

  try {
    // Шаг 1: Получить admin ID
    console.log('\n📍 ШАГ 1: Вызов getCurrentAdminId()')
    const adminId = await getCurrentAdminId()

    if (!adminId) {
      console.error('❌ ОШИБКА: getCurrentAdminId() вернул NULL!')
      console.error('   Возможные причины:')
      console.error('   1. Пользователь не залогинен')
      console.error('   2. Cookies не доступны в Server Action')
      console.error('   3. User не найден в таблице admins')
      console.log('='.repeat(60) + '\n')
      return
    }

    console.log('✅ getCurrentAdminId() вернул:', adminId)

    // Шаг 2: Записать в audit_log
    console.log('\n📍 ШАГ 2: Вызов logCreate()')
    const result = await logCreate(
      'device_models',
      '00000000-0000-0000-0000-000000000000',
      { test: 'data', timestamp: new Date().toISOString() }
    )

    if (!result) {
      console.error('❌ ОШИБКА: logCreate() вернул false!')
      console.log('='.repeat(60) + '\n')
      return
    }

    console.log('✅ logCreate() выполнен успешно!')
    console.log('\n' + '='.repeat(60))
    console.log('✅ ТЕСТ ПРОЙДЕН!')
    console.log('Проверьте таблицу audit_log в БД - должна появиться новая запись')
    console.log('admin_id:', adminId)
    console.log('action: CREATE')
    console.log('table_name: device_models')
    console.log('='.repeat(60) + '\n')
  } catch (error) {
    console.error('❌ ИСКЛЮЧЕНИЕ в testAuditSystem:', error)
    console.log('='.repeat(60) + '\n')
  }
}
