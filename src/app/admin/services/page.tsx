'use client'

import { useEffect, useState, useTransition } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { deleteService } from '@/app/actions/services'

interface Service {
  id: string
  slug: string
  name_ru: string
  name_en: string
  name_cz: string
  service_type: 'main' | 'extra'
  order: number
}

interface CategoryService {
  category_id: string
  device_categories: {
    name_ru: string
    slug: string
  }
}

interface ServiceWithCategories extends Service {
  category_services: CategoryService[]
}

interface Category {
  id: string
  slug: string
  name_ru: string
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceWithCategories[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      loadServices()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('device_categories')
        .select('id, slug, name_ru')
        .order('order')

      if (error) {
        console.error('Error loading categories:', error)
        throw error
      }

      console.log('Categories loaded:', data)
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadServices() {
    if (!selectedCategory) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('services')
        .select(
          `
          *,
          category_services!inner (
            category_id,
            device_categories (
              name_ru,
              slug
            )
          )
        `
        )
        .eq('category_services.category_id', selectedCategory)
        .order('order')

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(serviceId: string, serviceName: string) {
    if (
      !confirm(
        `Вы уверены, что хотите удалить услугу "${serviceName}"? Это также удалит все связанные цены.`
      )
    ) {
      return
    }

    startTransition(async () => {
      const result = await deleteService(serviceId)

      if (result.error) {
        alert(`Ошибка при удалении: ${result.error}`)
      } else {
        await loadServices()
      }
    })
  }

  if (loading && categories.length === 0) {
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
                Управление услугами
              </h1>
            </div>
            {selectedCategory && (
              <Link
                href={`/admin/services/new?category=${selectedCategory}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                + Добавить услугу
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Selection */}
        {!selectedCategory ? (
          <div className="bg-white shadow-sm rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Выберите категорию устройства
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {category.name_ru}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Selected Category Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  ← Сменить категорию
                </button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {categories.find((c) => c.id === selectedCategory)?.name_ru}
                </h2>
              </div>
            </div>

            {/* Services Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Услуга
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Тип
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Загрузка...
                      </td>
                    </tr>
                  ) : services.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Услуги не найдены
                      </td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {service.name_ru}
                          </div>
                          {service.name_en && (
                            <div className="text-xs text-gray-500 mt-1">
                              EN: {service.name_en}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              service.service_type === 'main'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {service.service_type === 'main'
                              ? 'Основная'
                              : 'Дополнительная'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <Link
                              href={`/admin/services/${service.id}/prices`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Редактировать
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(service.id, service.name_ru)
                              }
                              disabled={isPending}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Stats */}
            <div className="mt-4 text-sm text-gray-500">
              Всего услуг: {services.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
