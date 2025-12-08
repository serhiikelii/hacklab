'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface AuditLogFiltersProps {
  currentAction?: string
  currentTable?: string
}

const ACTIONS = ['CREATE', 'UPDATE', 'DELETE', 'UPLOAD', 'REMOVE', 'TOGGLE']
const TABLES = [
  'device_models',
  'device_categories',
  'services',
  'category_services',
  'prices',
  'device_images',
]

export function AuditLogFilters({
  currentAction,
  currentTable,
}: AuditLogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (filterType: 'action' | 'table', value: string) => {
    const params = new URLSearchParams(searchParams?.toString())

    if (value === 'all') {
      params.delete(filterType)
    } else {
      params.set(filterType, value)
    }

    // Reset page on filter change
    params.delete('page')

    router.push(`/admin/audit?${params.toString()}`)
  }

  const handleReset = () => {
    router.push('/admin/audit')
  }

  const hasActiveFilters = currentAction || currentTable

  return (
    <div className="bg-white shadow sm:rounded-lg p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Filter by action */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Action:</label>
          <select
            value={currentAction || 'all'}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-[#052533] focus:ring-[#052533]"
          >
            <option value="all">All</option>
            {ACTIONS.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by table */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Table:</label>
          <select
            value={currentTable || 'all'}
            onChange={(e) => handleFilterChange('table', e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-[#052533] focus:ring-[#052533]"
          >
            <option value="all">All</option>
            {TABLES.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>

        {/* Reset filters button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="text-sm"
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  )
}
