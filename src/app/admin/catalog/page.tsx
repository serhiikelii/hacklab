import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'

interface DeviceCategory {
  id: string
  slug: string
  name_ru: string
  name_en: string
  name_cz: string
  icon: string | null
}

export default async function CatalogPage() {
  // Создаем клиент внутри компонента, НЕ на top-level
  const supabase = await createClient()

  // Загрузка категорий из БД
  const { data: categories, error } = await supabase
    .from('device_categories')
    .select('*')
    .order('name_ru')

  if (error) {
    console.error('Error loading categories:', error)
    return <div>Ошибка загрузки категорий</div>
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
                Каталог устройств
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600 mb-6">
          Выберите категорию для управления моделями и услугами
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories?.map((category: DeviceCategory) => (
            <Link
              key={category.id}
              href={`/admin/catalog/${category.slug}/models`}
            >
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Категория
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {category.name_ru}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
