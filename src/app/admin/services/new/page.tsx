'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { createService } from '@/app/actions/services'
import { useActionState } from 'react'

interface Category {
  id: string
  name_ru: string
  slug: string
}

function NewServiceForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState<string>('')
  const [categorySlug, setCategorySlug] = useState<string>('')
  const [nameEn, setNameEn] = useState<string>('')
  const [state, formAction, isPending] = useActionState(createService, {})

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadCategories()

    // Get category from URL
    const category = searchParams.get('category')
    if (category) {
      setCategoryId(category)
    } else {
      router.push('/admin/services')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('device_categories')
        .select('id, name_ru, slug')
        .order('order')

      if (error) throw error
      setCategories(data || [])

      // Set category slug from URL
      const categoryParam = searchParams.get('category')
      if (categoryParam) {
        const category = data?.find(c => c.id === categoryParam)
        if (category) {
          setCategorySlug(category.slug)
        }
      }
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  // Auto-generate slug from English name
  function generateSlug(nameEn: string): string {
    if (!nameEn) return ''

    let slug = nameEn.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Add category prefix
    if (categorySlug) {
      slug = `${categorySlug}-${slug}`
    }

    return slug
  }

  const autoSlug = generateSlug(nameEn)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/services"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Назад к списку услуг
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Добавить новую услугу
          </h1>

          {state.message && !state.success && (
            <div className="mb-6 rounded-md p-4 bg-red-50">
              <p className="text-sm font-medium text-red-800">{state.message}</p>
            </div>
          )}

          {state.success && (
            <div className="mb-6 rounded-md p-4 bg-green-50">
              <p className="text-sm font-medium text-green-800">
                Услуга успешно создана!
              </p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            {/* Hidden field for category_id */}
            <input type="hidden" name="category_id" value={categoryId} />
            {/* Hidden field for auto-generated slug */}
            <input type="hidden" name="slug" value={autoSlug} />

            {/* Selected Category (read-only) */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {categories.find(c => c.id === categoryId)?.name_ru || 'Не выбрана'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Slug будет: {autoSlug || `${categorySlug}-...`}
              </p>
            </div>

            {/* Name EN */}
            <div>
              <label
                htmlFor="name_en"
                className="block text-sm font-medium text-gray-700"
              >
                Название (EN) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name_en"
                name="name_en"
                required
                disabled={isPending}
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Main Camera Replacement"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
              <p className="mt-1 text-sm text-gray-500">
                Slug будет сгенерирован автоматически на основе английского названия
              </p>
              {state.errors?.name_en && (
                <p className="mt-1 text-sm text-red-600">{state.errors.name_en}</p>
              )}
            </div>

            {/* Name RU */}
            <div>
              <label
                htmlFor="name_ru"
                className="block text-sm font-medium text-gray-700"
              >
                Название (RU) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name_ru"
                name="name_ru"
                required
                disabled={isPending}
                placeholder="Замена основной камеры"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
              {state.errors?.name_ru && (
                <p className="mt-1 text-sm text-red-600">{state.errors.name_ru}</p>
              )}
            </div>

            {/* Name CZ */}
            <div>
              <label
                htmlFor="name_cz"
                className="block text-sm font-medium text-gray-700"
              >
                Название (CZ) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name_cz"
                name="name_cz"
                required
                disabled={isPending}
                placeholder="Výměna hlavní kamery"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
              {state.errors?.name_cz && (
                <p className="mt-1 text-sm text-red-600">{state.errors.name_cz}</p>
              )}
            </div>

            {/* Description RU */}
            <div>
              <label
                htmlFor="description_ru"
                className="block text-sm font-medium text-gray-700"
              >
                Описание (RU)
              </label>
              <textarea
                id="description_ru"
                name="description_ru"
                rows={3}
                disabled={isPending}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
            </div>

            {/* Description EN */}
            <div>
              <label
                htmlFor="description_en"
                className="block text-sm font-medium text-gray-700"
              >
                Описание (EN)
              </label>
              <textarea
                id="description_en"
                name="description_en"
                rows={3}
                disabled={isPending}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
            </div>

            {/* Description CZ */}
            <div>
              <label
                htmlFor="description_cz"
                className="block text-sm font-medium text-gray-700"
              >
                Описание (CZ)
              </label>
              <textarea
                id="description_cz"
                name="description_cz"
                rows={3}
                disabled={isPending}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
            </div>

            {/* Service Type */}
            <div>
              <label
                htmlFor="service_type"
                className="block text-sm font-medium text-gray-700"
              >
                Тип услуги <span className="text-red-500">*</span>
              </label>
              <select
                id="service_type"
                name="service_type"
                required
                disabled={isPending}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              >
                <option value="main">Основная</option>
                <option value="extra">Дополнительная</option>
              </select>
              {state.errors?.service_type && (
                <p className="mt-1 text-sm text-red-600">{state.errors.service_type}</p>
              )}
            </div>

            {/* Order */}
            <div>
              <label
                htmlFor="order"
                className="block text-sm font-medium text-gray-700"
              >
                Порядок отображения
              </label>
              <input
                type="number"
                id="order"
                name="order"
                min="0"
                defaultValue="0"
                disabled={isPending}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
              <p className="mt-1 text-sm text-gray-500">
                Меньшее число = выше в списке услуг на сайте
              </p>
              {state.errors?.order && (
                <p className="mt-1 text-sm text-red-600">{state.errors.order}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-x-4 pt-6 border-t">
              <Link
                href="/admin/services"
                className="text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                Отмена
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Создание...' : 'Создать услугу'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function NewServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-lg">Загрузка...</div></div>}>
      <NewServiceForm />
    </Suspense>
  )
}
