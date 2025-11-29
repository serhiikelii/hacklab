import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { AuditLogTable } from './AuditLogTable'
import { AuditLogFilters } from './AuditLogFilters'

interface PageProps {
  searchParams: Promise<{
    action?: string
    table?: string
    page?: string
  }>
}

export default async function AuditPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { action, table, page = '1' } = params

  const currentPage = parseInt(page, 10)
  const perPage = 50
  const offset = (currentPage - 1) * perPage

  // Create client inside component, NOT at top-level
  const supabase = await createClient()

  // Build query with filters
  let query = supabase
    .from('audit_log')
    .select(
      `
      *,
      admins (
        email,
        role
      )
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })

  // Apply filters
  if (action) {
    query = query.eq('action', action)
  }
  if (table) {
    query = query.eq('table_name', table)
  }

  // Pagination
  query = query.range(offset, offset + perPage - 1)

  const { data: logs, error, count } = await query

  if (error) {
    return (
      <div className="p-8 text-red-600">
        <h2 className="text-xl font-bold mb-2">Error loading audit logs</h2>
        <p className="text-sm">{error.message || String(error)}</p>
      </div>
    )
  }

  const totalPages = count ? Math.ceil(count / perPage) : 1

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-gray-700 inline-block mb-2"
        >
          ← Back to Admin Panel
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
        <p className="text-sm text-gray-500 mt-1">
          All administrator operations ({count || 0} records)
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <AuditLogFilters currentAction={action} currentTable={table} />
      </div>

      {/* Logs table */}
      <AuditLogTable
        logs={logs || []}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  )
}
