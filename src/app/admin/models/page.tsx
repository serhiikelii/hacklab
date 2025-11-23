'use client'

import { useEffect, useState, useTransition } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { deleteDeviceModel } from '@/app/actions/models'

interface DeviceModel {
  id: string
  name: string
  slug: string
  series: string | null
  release_year: number | null
  category_id: string
  device_categories: {
    name_ru: string
    slug: string
  }
}

export default function AdminModelsPage() {
  const [models, setModels] = useState<DeviceModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isPending, startTransition] = useTransition()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadModels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadModels() {
    try {
      const { data, error } = await supabase
        .from('device_models')
        .select(
          `
          *,
          device_categories (
            name_ru,
            slug
          )
        `
        )
        .order('created_at', { ascending: false })

      if (error) throw error
      setModels(data || [])
    } catch (error) {
      console.error('Error loading models:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(modelId: string, modelName: string) {
    if (
      !confirm(
        `Вы уверены, что хотите удалить модель "${modelName}"? Это также удалит все связанные цены.`
      )
    ) {
      return
    }

    startTransition(async () => {
      const result = await deleteDeviceModel(modelId)

      if (result.error) {
        alert(`Ошибка при удалении: ${result.error}`)
      } else {
        // Reload models after successful delete
        await loadModels()
      }
    })
  }

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (model.series &&
        model.series.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory =
      filterCategory === 'all' || model.device_categories?.slug === filterCategory

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/admin"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Назад к панели
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                Модели устройств
              </h1>
            </div>
            <Link
              href="/admin/models/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              + Добавить модель
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Поиск по названию, slug или серии..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Все категории</option>
            <option value="iphone">iPhone</option>
            <option value="ipad">iPad</option>
            <option value="macbook">MacBook</option>
            <option value="apple-watch">Apple Watch</option>
          </select>
        </div>

        {/* Models Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Модель
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Год выпуска
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Модели не найдены
                  </td>
                </tr>
              ) : (
                filteredModels.map((model) => (
                  <tr key={model.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {model.name}
                      </div>
                      <div className="text-sm text-gray-500">{model.slug}</div>
                      {model.series && (
                        <div className="text-xs text-gray-400">
                          Серия: {model.series}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {model.device_categories?.name_ru}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {model.release_year || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/models/${model.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Редактировать
                      </Link>
                      <button
                        onClick={() => handleDelete(model.id, model.name)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isPending}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mt-4 text-sm text-gray-500">
          Всего моделей: {models.length} | Отфильтровано: {filteredModels.length}
        </div>
      </div>
    </div>
  )
}
