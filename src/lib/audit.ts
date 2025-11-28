'use server'

import { createClient } from '@/lib/supabase-server'

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'UPLOAD'
  | 'REMOVE'
  | 'TOGGLE'

export type AuditTable =
  | 'device_models'
  | 'device_categories'
  | 'services'
  | 'category_services'
  | 'prices'
  | 'device_images'

interface AuditLogParams {
  adminId: string
  action: AuditAction
  tableName: AuditTable
  recordId?: string
  oldData?: Record<string, any> | null
  newData?: Record<string, any> | null
}

/**
 * Записывает событие в таблицу audit_log
 * @param params - Параметры аудита
 * @returns Promise<boolean> - true если успешно, false если ошибка
 */
export async function logAuditEvent(
  params: AuditLogParams
): Promise<boolean> {
  try {
    const { adminId, action, tableName, recordId, oldData, newData } = params

    console.log('[logAuditEvent] START:', { action, tableName, adminId, recordId })

    // Валидация обязательных полей
    if (!adminId || !action || !tableName) {
      console.error('[logAuditEvent] Missing required fields:', { adminId, action, tableName })
      return false
    }

    // Создаем серверный клиент с cookies
    const supabase = await createClient()
    console.log('[logAuditEvent] Server client created, inserting into audit_log...')

    const { error } = await supabase.from('audit_log').insert({
      admin_id: adminId,
      action,
      table_name: tableName,
      record_id: recordId || null,
      old_data: oldData ? JSON.stringify(oldData) : null,
      new_data: newData ? JSON.stringify(newData) : null,
    })

    if (error) {
      console.error('[logAuditEvent] Insert error:', error)
      return false
    }

    console.log('[logAuditEvent] ✅ Successfully logged to audit_log')
    return true
  } catch (error) {
    console.error('[logAuditEvent] Exception:', error)
    return false
  }
}

/**
 * Вспомогательная функция для получения текущего adminId
 * Использует реальную аутентификацию Supabase через auth.uid()
 * @returns string - user_id текущего аутентифицированного администратора
 */
export async function getCurrentAdminId(): Promise<string | null> {
  try {
    console.log('[getCurrentAdminId] START')

    // 1. Создаем серверный клиент с cookies
    const supabase = await createClient()
    console.log('[getCurrentAdminId] Server client created')

    // 2. Получаем текущего аутентифицированного пользователя
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[getCurrentAdminId] Not authenticated:', authError?.message || 'No user')
      return null
    }

    console.log('[getCurrentAdminId] User found:', user.email, user.id)

    // 3. Проверяем что этот user_id существует в таблице admins и активен
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('id, user_id, role, is_active')  // ✅ Выбираем оба ID!
      .eq('user_id', user.id)  // ВАЖНО: сравниваем с user_id, НЕ с id!
      .eq('is_active', true)
      .single()

    if (adminError || !admin) {
      console.error('[getCurrentAdminId] User is not an active admin:', adminError?.message || 'Not found')
      return null
    }

    console.log('[getCurrentAdminId] Admin found:', admin.id, admin.role, '(user_id:', admin.user_id, ')')
    // 4. КРИТИЧНО: Возвращаем admin.id (PK admins), а НЕ user_id!
    // audit_log.admin_id references admins.id, NOT admins.user_id!
    console.log('[getCurrentAdminId] ✅ Returning admin.id (PK):', admin.id)
    return admin.id
  } catch (error) {
    console.error('[getCurrentAdminId] Exception:', error)
    return null
  }
}

/**
 * Обертка для логирования операций создания
 */
export async function logCreate(
  tableName: AuditTable,
  recordId: string,
  newData: Record<string, any>
) {
  const adminId = await getCurrentAdminId()
  if (!adminId) return false

  return logAuditEvent({
    adminId,
    action: 'CREATE',
    tableName,
    recordId,
    newData,
  })
}

/**
 * Обертка для логирования операций обновления
 */
export async function logUpdate(
  tableName: AuditTable,
  recordId: string,
  oldData: Record<string, any>,
  newData: Record<string, any>
) {
  const adminId = await getCurrentAdminId()
  if (!adminId) return false

  return logAuditEvent({
    adminId,
    action: 'UPDATE',
    tableName,
    recordId,
    oldData,
    newData,
  })
}

/**
 * Обертка для логирования операций удаления
 */
export async function logDelete(
  tableName: AuditTable,
  recordId: string,
  oldData: Record<string, any>
) {
  const adminId = await getCurrentAdminId()
  if (!adminId) return false

  return logAuditEvent({
    adminId,
    action: 'DELETE',
    tableName,
    recordId,
    oldData,
  })
}
