import { createClient } from '@/lib/supabase-server'
import { getAdminUser } from '@/app/admin/actions'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { CategoryTabs } from '@/components/admin/CategoryTabs'
import { AddModelForm } from './AddModelForm'
import { ModelsList } from './ModelsList'

interface DeviceModel {
  id: string
  name: string
  release_year: number
  order: number
  image_url: string | null
}

export default async function ModelsPage({
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

  // Get category models sorted by order
  const { data: models, error } = await supabase
    .from('device_models')
    .select('*')
    .eq('category_id', category.id)
    .order('order', { ascending: true })

  if (error) {
    return <div>Error loading models</div>
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
      {/* Header with add button */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Category Models: {category.name_ru}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Device and model management
          </p>
        </div>
      </div>

      {/* Add model form */}
      <div className="mb-8">
        <AddModelForm categoryId={category.id} categorySlug={category_slug} />
      </div>

      {/* Models list with drag-and-drop */}
      <ModelsList initialModels={models || []} categorySlug={category_slug} />
      </div>
    </AdminLayout>
  )
}
