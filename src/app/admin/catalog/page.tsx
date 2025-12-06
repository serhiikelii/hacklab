import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { Smartphone } from 'lucide-react'

interface DeviceCategory {
  id: string
  slug: string
  name_ru: string
  name_en: string
  name_cz: string
  icon: string | null
}

export default async function CatalogPage() {
  // Create client inside component, NOT at top-level
  const supabase = await createClient()

  // Load categories from DB
  const { data: categories, error } = await supabase
    .from('device_categories')
    .select('*')
    .order('name_ru')

  if (error) {
    return <div>Error loading categories</div>
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
                ← Back to Panel
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                Device Catalog
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600 mb-6">
          Select a category to manage models and services
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories?.map((category: DeviceCategory) => (
            <Link
              key={category.id}
              href={`/admin/catalog/${category.slug}/models`}
            >
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-700 rounded-md p-3">
                      <Smartphone className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Category
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
