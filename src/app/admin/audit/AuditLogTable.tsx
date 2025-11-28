'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface AuditLog {
  id: string
  admin_id: string
  action: string
  table_name: string
  record_id: string | null
  old_data: string | null
  new_data: string | null
  created_at: string
  admins?: {
    email: string
    role: string
  } | null
}

interface AuditLogTableProps {
  logs: AuditLog[]
  currentPage: number
  totalPages: number
}

export function AuditLogTable({
  logs,
  currentPage,
  totalPages,
}: AuditLogTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      UPLOAD: 'bg-purple-100 text-purple-800',
      REMOVE: 'bg-orange-100 text-orange-800',
      TOGGLE: 'bg-yellow-100 text-yellow-800',
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          colors[action] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {action}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {logs.length === 0 ? (
        <div className="px-4 py-12 text-center text-gray-500">
          Записей не найдено
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Дата и время</TableHead>
                <TableHead className="w-[100px]">Действие</TableHead>
                <TableHead className="w-[150px]">Таблица</TableHead>
                <TableHead className="w-[200px]">Администратор</TableHead>
                <TableHead className="w-[150px]">Record ID</TableHead>
                <TableHead className="w-[100px]">Детали</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <TableRow>
                    <TableCell className="text-sm">
                      {formatDate(log.created_at)}
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell className="text-sm font-mono">
                      {log.table_name}
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.admins?.email || 'Неизвестно'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 font-mono">
                      {log.record_id?.substring(0, 8) || '—'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRow(log.id)}
                      >
                        {expandedRow === log.id ? 'Скрыть' : 'Показать'}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Развернутая строка с данными */}
                  {expandedRow === log.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-gray-50 p-4">
                        <div className="space-y-3">
                          {log.record_id && (
                            <div>
                              <span className="font-semibold text-sm">
                                Record ID:
                              </span>
                              <span className="ml-2 text-sm font-mono">
                                {log.record_id}
                              </span>
                            </div>
                          )}

                          {log.old_data && (
                            <div>
                              <span className="font-semibold text-sm block mb-1">
                                Старые данные:
                              </span>
                              <pre className="bg-white p-2 rounded border text-xs overflow-x-auto">
                                {typeof log.old_data === 'string'
                                  ? JSON.stringify(JSON.parse(log.old_data), null, 2)
                                  : JSON.stringify(log.old_data, null, 2)}
                              </pre>
                            </div>
                          )}

                          {log.new_data && (
                            <div>
                              <span className="font-semibold text-sm block mb-1">
                                Новые данные:
                              </span>
                              <pre className="bg-white p-2 rounded border text-xs overflow-x-auto">
                                {typeof log.new_data === 'string'
                                  ? JSON.stringify(JSON.parse(log.new_data), null, 2)
                                  : JSON.stringify(log.new_data, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Страница {currentPage} из {totalPages}
                </div>
                <div className="flex space-x-2">
                  {currentPage > 1 && (
                    <Link href={`/admin/audit?page=${currentPage - 1}`}>
                      <Button variant="outline" size="sm">
                        ← Назад
                      </Button>
                    </Link>
                  )}
                  {currentPage < totalPages && (
                    <Link href={`/admin/audit?page=${currentPage + 1}`}>
                      <Button variant="outline" size="sm">
                        Вперед →
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
