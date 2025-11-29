'use server'

import { logCreate, getCurrentAdminId } from '@/lib/audit'
import { redirect } from 'next/navigation'

export async function testAuditSystem(): Promise<void> {
  // Test audit system functionality
  try {
    // Step 1: Get admin ID
    const adminId = await getCurrentAdminId()

    if (!adminId) {
      return
    }

    // Step 2: Write to audit_log
    const result = await logCreate(
      'device_models',
      '00000000-0000-0000-0000-000000000000',
      { test: 'data', timestamp: new Date().toISOString() }
    )

    if (!result) {
      return
    }
  } catch (error) {
    // Error in testAuditSystem
  }
}
