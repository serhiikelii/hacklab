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
 * Logs event to audit_log table
 * @param params - Audit parameters
 * @returns Promise<boolean> - true if successful, false if error
 */
export async function logAuditEvent(
  params: AuditLogParams
): Promise<boolean> {
  try {
    const { adminId, action, tableName, recordId, oldData, newData } = params

    // Validation of required fields
    if (!adminId || !action || !tableName) {
      return false
    }

    // Create server client with cookies
    const supabase = await createClient()

    const { error } = await supabase.from('audit_log').insert({
      admin_id: adminId,
      action,
      table_name: tableName,
      record_id: recordId || null,
      old_data: oldData ? JSON.stringify(oldData) : null,
      new_data: newData ? JSON.stringify(newData) : null,
    })

    if (error) {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}

/**
 * Helper function to get current adminId
 * Uses real Supabase authentication via auth.uid()
 * @returns string - user_id of current authenticated administrator
 */
export async function getCurrentAdminId(): Promise<string | null> {
  try {
    // 1. Create server client with cookies
    const supabase = await createClient()

    // 2. Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return null
    }

    // 3. Verify user_id exists in admins table and is active
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('id, user_id, role, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (adminError || !admin) {
      return null
    }

    // 4. CRITICAL: Return admin.id (PK admins), NOT user_id!
    // audit_log.admin_id references admins.id, NOT admins.user_id!
    return admin.id
  } catch (error) {
    return null
  }
}

/**
 * Wrapper for logging create operations
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
 * Wrapper for logging update operations
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
 * Wrapper for logging delete operations
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
