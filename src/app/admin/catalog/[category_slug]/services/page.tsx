import { createClient } from '@/lib/supabase-server'
import { getAdminUser } from '@/app/admin/actions'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { CategoryTabs } from '@/components/admin/CategoryTabs'
import { AddCategoryServiceForm } from './AddCategoryServiceForm'
import { ServicesList } from './ServicesList'
import { AddGlobalServiceDialog } from './AddGlobalServiceDialog'

interface CategoryService {
  id: string
  service_id: string
  service_name_ru: string
  service_name_en: string
  service_name_cz: string
  service_type: string
  order: number
  is_active: boolean
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ category_slug: string }>
}) {
  const { category_slug } = await params

  // Create client inside component, NOT at top-level
  const supabase = await createClient()
  const adminUser = await getAdminUser()

  // Get category
  const { data: category, error: categoryError } = await supabase
    .from('device_categories')
    .select('id, name_ru, name_en, slug')
    .eq('slug', category_slug)
    .single()

  if (categoryError || !category) {
    return <div>Category not found</div>
  }

  // Get category services from view
  const { data: services, error } = await supabase
    .from('category_services_view')
    .select('*')
    .eq('category_id', category.id)
    .order('order', { ascending: true })

  if (error) {
    return <div>Error loading services</div>
  }

  return (
    <AdminLayout
      userEmail={adminUser.email}
      userRole={adminUser.role}
      breadcrumbs={[
        { label: 'Catalog', href: '/admin/catalog' },
        { label: category.name_en },
      ]}
    >
      <CategoryTabs categorySlug={category_slug} />

      <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Services Configuration: {category.name_ru}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage available services for device category
        </p>
      </div>

      {/* Global Services Configuration Section */}
      <div className="mb-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900">
              Services Configuration for all categories
            </h3>
            <p className="text-sm text-teal-800 mt-1">
              Add new global services, set service types (Main/Extra)
            </p>
          </div>
          <AddGlobalServiceDialog />
        </div>
      </div>

      {/* Services list with drag-and-drop */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Services List ({services?.length || 0})
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage available services for {category.name_ru}
              </p>
            </div>
            <AddCategoryServiceForm
              categoryId={category.id}
              categorySlug={category_slug}
            />
          </div>
        </div>

        <ServicesList
          initialServices={services || []}
          categorySlug={category_slug}
        />
      </div>
      </div>
    </AdminLayout>
  )
}
