import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { getAdminUser } from '../actions'
import { AdminLayout } from '@/components/admin/AdminLayout'

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
  const adminUser = await getAdminUser()

  // Load categories from DB
  const { data: categories, error } = await supabase
    .from('device_categories')
    .select('*')
    .order('name_ru')

  if (error) {
    return <div>Error loading categories</div>
  }

  return (
    <AdminLayout
      userEmail={adminUser.email}
      userRole={adminUser.role}
      breadcrumbs={[{ label: 'Catalog' }]}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Device Catalog
        </h1>
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
              <div className="group bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    {/* Icon Section - SVG Outline Style */}
                    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                      <svg
                        className="w-14 h-14 text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        {getCategoryIcon(category.slug)}
                      </svg>
                    </div>
                    {/* Text Section */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 truncate">
                        Category
                      </p>
                      <h3 className="text-lg font-medium text-gray-900">
                        {category.name_ru}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

// Helper function to get category-specific SVG icons
function getCategoryIcon(slug: string) {
  const icons: Record<string, JSX.Element> = {
    'iphone': (
      // Smartphone icon
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
      />
    ),
    'ipad': (
      // Tablet icon
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z"
      />
    ),
    'macbook': (
      // Laptop icon
      <>
        <rect x="3" y="4" width="18" height="13" rx="1" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 17h20" />
      </>
    ),
    'apple-watch': (
      // Apple Watch icon
      <>
        <rect x="7" y="5" width="10" height="14" rx="3" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5V3.5C9 2.67 9.67 2 10.5 2h3C14.33 2 15 2.67 15 3.5V5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v1.5c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5V19" />
      </>
    ),
  }

  // Return matching icon or default smartphone icon
  return icons[slug] || icons['iphone']
}
