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

  // Создаем клиент внутри компонента, НЕ на top-level
  const supabase = await createClient()

  // Строим запрос с фильтрами
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

  // Применяем фильтры
  if (action) {
    query = query.eq('action', action)
  }
  if (table) {
    query = query.eq('table_name', table)
  }

  // Пагинация
  query = query.range(offset, offset + perPage - 1)

  const { data: logs, error, count } = await query

  if (error) {
    console.error('Error loading audit logs:', error)
    return (
      <div className="p-8 text-red-600">
        <h2 className="text-xl font-bold mb-2">Ошибка загрузки логов аудита</h2>
        <p className="text-sm">{error.message || String(error)}</p>
      </div>
    )
  }

  const totalPages = count ? Math.ceil(count / perPage) : 1

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Журнал аудита</h1>
        <p className="text-sm text-gray-500 mt-1">
          Все операции администраторов ({count || 0} записей)
        </p>
      </div>

      {/* Фильтры */}
      <div className="mb-6">
        <AuditLogFilters currentAction={action} currentTable={table} />
      </div>

      {/* Таблица логов */}
      <AuditLogTable
        logs={logs || []}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  )
}
