'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { createDeviceModel } from '@/app/actions/models'
import Link from 'next/link'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { createClient } from '@supabase/supabase-js'

interface Category {
  id: string
  slug: string
  name_ru: string
}

// Function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export default function NewModelPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(createDeviceModel, {
    errors: {},
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [modelName, setModelName] = useState('')
  const [slug, setSlug] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/models')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('device_categories')
        .select('id, slug, name_ru')
        .order('order')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setModelName(name)
    // Auto-generate slug
    setSlug(generateSlug(name))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Добавить новую модель устройства
          </h1>

          {state?.message && (
            <div
              className={`mb-6 rounded-md p-4 ${
                state.success ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  state.success ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {state.message}
              </p>
              {state?.errors && Object.keys(state.errors).length > 0 && (
                <div className="mt-2 text-xs text-red-700">
                  <p>Ошибки валидации:</p>
                  <ul className="list-disc list-inside">
                    {Object.entries(state.errors).map(([key, value]) => (
                      <li key={key}>{key}: {JSON.stringify(value)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <form action={formAction} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-gray-700"
              >
                Категория устройства <span className="text-red-500">*</span>
              </label>
              <select
                id="category_id"
                name="category_id"
                required
                disabled={pending}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name_ru}
                  </option>
                ))}
              </select>
              {state?.errors?.category_id && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.category_id}
                </p>
              )}
            </div>

            {/* Model Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Название модели <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled={pending}
                value={modelName}
                onChange={handleNameChange}
                placeholder="iPhone 15 Pro Max"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
              {state?.errors?.name && (
                <p className="mt-1 text-sm text-red-600">{state.errors.name}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Будет отображаться на сайте
              </p>
            </div>

            {/* Slug (auto-generated, read-only) */}
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700"
              >
                URL slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                disabled={pending}
                value={slug}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
              {state?.errors?.slug && (
                <p className="mt-1 text-sm text-red-600">{state.errors.slug}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Генерируется автоматически из названия модели
              </p>
            </div>

            {/* Release Year */}
            <div>
              <label
                htmlFor="release_year"
                className="block text-sm font-medium text-gray-700"
              >
                Год выпуска
              </label>
              <input
                type="number"
                id="release_year"
                name="release_year"
                min="2000"
                max="2030"
                disabled={pending}
                placeholder="Необязательно"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
              {state?.errors?.release_year && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.release_year}
                </p>
              )}
            </div>

            {/* Image Upload */}
            {slug ? (
              <ImageUpload
                modelSlug={slug}
                currentImageUrl={imageUrl}
                onImageUrlChange={setImageUrl}
                disabled={pending}
              />
            ) : (
              <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ℹ️ Введите название модели для загрузки изображения
                </p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-x-4 pt-6 border-t">
              <Link
                href="/admin/models"
                className="text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                Отмена
              </Link>
              <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? 'Создание...' : 'Создать модель'}
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              💡 Подсказка
            </h3>
            <p className="text-sm text-blue-700">
              После создания модели система автоматически создаст цены для всех
              услуг выбранной категории со статусом &quot;По запросу&quot;. Вы сможете
              отредактировать цены в разделе &quot;Цены&quot;.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
