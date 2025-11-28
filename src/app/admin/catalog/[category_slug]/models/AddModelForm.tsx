'use client'

import { useState, useEffect } from 'react'
import { createModel, getMaxOrder } from './actions'

interface AddModelFormProps {
  categoryId: string
  categorySlug: string
}

export function AddModelForm({ categoryId, categorySlug }: AddModelFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [maxOrder, setMaxOrder] = useState<number>(0)

  // Загрузить максимальный order при открытии формы
  useEffect(() => {
    if (isOpen) {
      getMaxOrder(categoryId).then(setMaxOrder)
    }
  }, [isOpen, categoryId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.append('category_id', categoryId)

    const result = await createModel(formData)

    if (result.success) {
      // Закрыть форму и сбросить состояние
      setIsOpen(false)
      ;(e.target as HTMLFormElement).reset()
    } else {
      setError(result.error || 'Ошибка при создании модели')
    }

    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg
          className="-ml-1 mr-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Добавить модель
      </button>
    )
  }

  const recommendedOrder = maxOrder + 1

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Добавить новую модель
        </h3>
        <button
          onClick={() => {
            setIsOpen(false)
            setError('')
          }}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Название */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Название модели
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="например: iPhone 15 Pro"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Год выпуска */}
        <div>
          <label
            htmlFor="release_year"
            className="block text-sm font-medium text-gray-700"
          >
            Год выпуска
          </label>
          <input
            type="number"
            name="release_year"
            id="release_year"
            required
            min="2000"
            max="2030"
            defaultValue={new Date().getFullYear()}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Order с UX Helper */}
        <div>
          <label
            htmlFor="order"
            className="block text-sm font-medium text-gray-700"
          >
            Порядок сортировки (Order)
          </label>
          <input
            type="number"
            name="order"
            id="order"
            required
            min="1"
            defaultValue={recommendedOrder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">
            Текущий макс. order: <strong>{maxOrder}</strong>.
            Рекомендуемый: <strong>{recommendedOrder}</strong> (шаг 1)
          </p>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              setError('')
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Создаю...
              </>
            ) : (
              'Создать модель'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
