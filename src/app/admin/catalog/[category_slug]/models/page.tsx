import { createClient } from '@/lib/supabase-server'
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

  // Получить модели категории с сортировкой по order
  const { data: models, error } = await supabase
    .from('device_models')
    .select('*')
    .eq('category_id', category.id)
    .order('order', { ascending: true })

  if (error) {
    console.error('Error loading models:', error)
    return <div>Ошибка загрузки моделей</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header с кнопкой добавления */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Модели категории: {category.name_ru}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Управление устройствами и моделями
          </p>
        </div>
      </div>

      {/* Форма добавления модели */}
      <div className="mb-8">
        <AddModelForm categoryId={category.id} categorySlug={category_slug} />
      </div>

      {/* Список моделей с drag-and-drop */}
      <ModelsList initialModels={models || []} categorySlug={category_slug} />
    </div>
  )
}
