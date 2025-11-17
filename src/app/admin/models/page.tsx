'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

interface DeviceModel {
  id: string
  name: string
  slug: string
  series: string | null
  release_year: number | null
  is_popular: boolean
  is_active: boolean
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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadModels()
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

  async function toggleActive(modelId: string, currentState: boolean) {
    try {
      const { error } = await supabase
        .from('device_models')
        .update({ is_active: !currentState })
        .eq('id', modelId)

      if (error) throw error
      await loadModels()
    } catch (error) {
      console.error('Error updating model:', error)
      alert('Ошибка при обновлении модели')
    }
  }

  async function togglePopular(modelId: string, currentState: boolean) {
    try {
      const { error } = await supabase
        .from('device_models')
        .update({ is_popular: !currentState })
        .eq('id', modelId)

      if (error) throw error
      await loadModels()
    } catch (error) {
      console.error('Error updating model:', error)
      alert('Ошибка при обновлении модели')
    }
  }

  async function deleteModel(modelId: string, modelName: string) {
    if (
      !confirm(
        `Вы уверены, что хотите удалить модель "${modelName}"? Это также удалит все связанные цены.`
      )
    ) {
      return
    }

    try {
      const { error } = await supabase
        .from('device_models')
        .delete()
        .eq('id', modelId)

      if (error) throw error
      await loadModels()
    } catch (error) {
      console.error('Error deleting model:', error)
      alert('Ошибка при удалении модели')
    }
  }

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (model.series &&
        model.series.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Поиск по названию, slug или серии..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Модели не найдены
                  </td>
                </tr>
              ) : (
                filteredModels.map((model) => (
                  <tr key={model.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {model.name}
                        {model.is_popular && (
                          <span className="ml-2 text-xs text-yellow-600">
                            ⭐ Популярная
                          </span>
                        )}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          model.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {model.is_active ? 'Активна' : 'Неактивна'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => toggleActive(model.id, model.is_active)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {model.is_active ? 'Деактивировать' : 'Активировать'}
                      </button>
                      <button
                        onClick={() =>
                          togglePopular(model.id, model.is_popular)
                        }
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        {model.is_popular ? 'Снять ⭐' : 'Пометить ⭐'}
                      </button>
                      <button
                        onClick={() => deleteModel(model.id, model.name)}
                        className="text-red-600 hover:text-red-900"
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
