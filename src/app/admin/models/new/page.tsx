'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { createDeviceModel } from '@/app/actions/models'
import Link from 'next/link'

export default function NewModelPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(createDeviceModel, {
    errors: {},
  })
  const [selectedCategory, setSelectedCategory] = useState('')

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
                <option value="iphone">iPhone</option>
                <option value="ipad">iPad</option>
                <option value="macbook">MacBook</option>
                <option value="apple-watch">Apple Watch</option>
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

            {/* Slug (auto-generated hint) */}
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
                placeholder="iphone-15-pro-max"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
              {state?.errors?.slug && (
                <p className="mt-1 text-sm text-red-600">{state.errors.slug}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Только латиница, цифры и дефисы. Например: iphone-15-pro-max
              </p>
            </div>

            {/* Series */}
            <div>
              <label
                htmlFor="series"
                className="block text-sm font-medium text-gray-700"
              >
                Серия (опционально)
              </label>
              <input
                type="text"
                id="series"
                name="series"
                disabled={pending}
                placeholder="iPhone 15"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
              {state?.errors?.series && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.series}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Для группировки моделей (например, "iPhone 15")
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
                placeholder="2024"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
              {state?.errors?.release_year && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.release_year}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="image_url"
                className="block text-sm font-medium text-gray-700"
              >
                URL изображения
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                disabled={pending}
                placeholder="https://example.com/image.png"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
              {state?.errors?.image_url && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.image_url}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Полный URL изображения устройства
              </p>
            </div>

            {/* Is Popular */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_popular"
                name="is_popular"
                disabled={pending}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
              />
              <label
                htmlFor="is_popular"
                className="ml-2 block text-sm text-gray-700"
              >
                Популярная модель (отображается в начале списка)
              </label>
            </div>

            {/* Is Active */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                defaultChecked
                disabled={pending}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
              />
              <label
                htmlFor="is_active"
                className="ml-2 block text-sm text-gray-700"
              >
                Активна (отображается на сайте)
              </label>
            </div>

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
              услуг выбранной категории со статусом "По запросу". Вы сможете
              отредактировать цены в разделе "Цены".
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
