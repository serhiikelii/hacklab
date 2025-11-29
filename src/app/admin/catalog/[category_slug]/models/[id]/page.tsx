import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { EditModelForm } from './EditModelForm'
import { ImageUploader } from './ImageUploader'
import { PricesTable } from './PricesTable'
import { AddPriceForm } from './AddPriceForm'
import { getActiveServicesForModel } from './actions'

export default async function EditModelPage({
  params,
}: {
  params: Promise<{ category_slug: string; id: string }>
}) {
  const { category_slug, id } = await params

  // Create client inside component, NOT at top-level
  const supabase = await createClient()

  // Get model
  const { data: model, error } = await supabase
    .from('device_models')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !model) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-800">Model not found</p>
        </div>
      </div>
    )
  }

  // Get category
  const { data: category } = await supabase
    .from('device_categories')
    .select('name_en, slug')
    .eq('id', model.category_id)
    .single()

  // Get model prices with service information
  const { data: prices } = await supabase
    .from('prices')
    .select(`
      id,
      service_id,
      price,
      duration_minutes,
      warranty_months,
      services (
        id,
        name_ru,
        name_en,
        name_cz,
        service_type
      )
    `)
    .eq('model_id', id)
    .order('service_id')

  // Get available services for category
  const availableServices = await getActiveServicesForModel(id)

  // IDs of services that already have prices
  const existingServiceIds = prices?.map((p: any) => p.service_id) || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm">
        <Link
          href="/admin/catalog"
          className="text-gray-500 hover:text-gray-700"
        >
          Catalog
        </Link>
        {' / '}
        <Link
          href={`/admin/catalog/${category_slug}/models`}
          className="text-gray-500 hover:text-gray-700"
        >
          {category?.name_en}
        </Link>
        {' / '}
        <span className="text-gray-900">{model.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Edit Model
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          ID: {model.id}
        </p>
      </div>

      {/* Edit Form */}
      <div className="bg-white shadow sm:rounded-lg p-6">
        <EditModelForm model={model} categorySlug={category_slug} />
      </div>

      {/* Section: Model Image */}
      <div className="mt-6 bg-white shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Model Image
        </h3>
        <ImageUploader
          modelId={model.id}
          currentImageUrl={model.image_url}
          categorySlug={category_slug}
        />
      </div>

      {/* Section: Price Table */}
      <div className="mt-6 bg-white shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Price Table
        </h3>

        {/* Add price form */}
        <AddPriceForm
          modelId={id}
          categorySlug={category_slug}
          availableServices={availableServices}
          existingServiceIds={existingServiceIds}
        />

        {/* Prices table */}
        <PricesTable
          prices={(prices || []) as any}
          modelId={id}
          categorySlug={category_slug}
        />
      </div>
    </div>
  )
}
