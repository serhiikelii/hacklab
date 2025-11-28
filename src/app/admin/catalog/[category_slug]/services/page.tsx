import { createClient } from '@/lib/supabase-server'
import { AddServiceForm } from './AddServiceForm'
import { ServicesList } from './ServicesList'

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

  // Создаем клиент внутри компонента, НЕ на top-level
  const supabase = await createClient()

  // Получить категорию
  const { data: category, error: categoryError } = await supabase
    .from('device_categories')
    .select('id, name_ru, slug')
    .eq('slug', category_slug)
    .single()

  if (categoryError || !category) {
    return <div>Категория не найдена</div>
  }

  // Получить услуги категории из view
  const { data: services, error } = await supabase
    .from('category_services_view')
    .select('*')
    .eq('category_id', category.id)
    .order('order', { ascending: true }) // Fixed: changed from 'service_order' to 'order'

  if (error) {
    console.error('Error loading services:', error)
    return <div>Ошибка загрузки услуг</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Конфигурация услуг: {category.name_ru}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Управление доступными услугами для категории устройств
        </p>
      </div>

      {/* Форма добавления */}
      <div className="mb-8">
        <AddServiceForm categoryId={category.id} categorySlug={category_slug} />
      </div>

      {/* Список услуг с drag-and-drop */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Список услуг ({services?.length || 0})
          </h3>
        </div>

        <ServicesList
          initialServices={services || []}
          categorySlug={category_slug}
        />
      </div>
    </div>
  )
}
