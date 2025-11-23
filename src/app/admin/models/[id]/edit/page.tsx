'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { updateDeviceModel } from '@/app/actions/models'
import { useActionState } from 'react'

interface DeviceModel {
  id: string
  name: string
  slug: string
  series: string | null
  release_year: number | null
  image_url: string | null
  category_id: string
  device_categories: {
    slug: string
    name_ru: string
  }
}

interface Category {
  id: string
  slug: string
  name_ru: string
}

export default function EditModelPage() {
  const router = useRouter()
  const params = useParams()
  const modelId = params.id as string

  const [model, setModel] = useState<DeviceModel | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const updateWithId = updateDeviceModel.bind(null, modelId)
  const [state, formAction, isPending] = useActionState(updateWithId, {})

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId])

  async function loadData() {
    try {
      // Load model
      const { data: modelData, error: modelError } = await supabase
        .from('device_models')
        .select(
          `
          *,
          device_categories (
            slug,
            name_ru
          )
        `
        )
        .eq('id', modelId)
        .single()

      if (modelError) throw modelError

      setModel(modelData)
      setImageUrl(modelData.image_url)

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('device_categories')
        .select('id, slug, name_ru')
        .order('order')

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Модель не найдена</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/models"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Назад к списку моделей
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Редактировать модель
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {model.name} ({model.device_categories?.name_ru})
            </p>
          </div>

          {state.message && !state.success && (
            <div className="mb-6 rounded-md p-4 bg-red-50">
              <p className="text-sm font-medium text-red-800">{state.message}</p>
            </div>
          )}

          {state.success && (
            <div className="mb-6 rounded-md p-4 bg-green-50">
              <p className="text-sm font-medium text-green-800">
                Модель успешно обновлена!
              </p>
            </div>
          )}

          <div className="mb-6 rounded-md p-4 bg-blue-50">
            <p className="text-sm text-blue-700">
              <strong>Информация:</strong> Название модели, slug и категория не могут быть изменены. Если нужно изменить
              эти данные, создайте новую модель.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            {/* Category (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Категория *
              </label>
              <input
                type="text"
                value={model.device_categories?.name_ru || ''}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
              <input
                type="hidden"
                name="category_id"
                value={model.category_id || ''}
              />
            </div>

            {/* Name (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Название модели *
              </label>
              <input
                type="text"
                value={model.name}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
              <input type="hidden" name="name" value={model.name} />
            </div>

            {/* Slug (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={model.slug}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
              <input type="hidden" name="slug" value={model.slug} />
            </div>

            {/* Series */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Серия (необязательно)
              </label>
              <input
                type="text"
                name="series"
                defaultValue={model.series || ''}
                placeholder="Например: MacBook Pro"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Release Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Год выпуска
              </label>
              <input
                type="number"
                name="release_year"
                defaultValue={model.release_year || ''}
                min="2000"
                max="2030"
                placeholder="2024"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {state.errors?.release_year && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.release_year}
                </p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Изображение модели
              </label>
              <ImageUpload
                currentImageUrl={imageUrl}
                modelSlug={model.slug}
                onImageUrlChange={setImageUrl}
              />
              <input type="hidden" name="image_url" value={imageUrl || ''} />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <Link
                href="/admin/models"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                {isPending ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
