'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { updatePrice } from '@/app/actions/prices'

interface Price {
  id: string
  price: number | null
  service_id: string
  services: {
    name_ru: string
    slug: string
  }
}

interface DeviceModel {
  id: string
  name: string
  slug: string
  device_categories: {
    name_ru: string
  }
}

export default function EditModelPricesPage() {
  const params = useParams()
  const modelId = params.modelId as string

  const [model, setModel] = useState<DeviceModel | null>(null)
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadModelAndPrices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId])

  async function loadModelAndPrices() {
    try {
      // Load model info
      const { data: modelData, error: modelError } = await supabase
        .from('device_models')
        .select(
          `
          *,
          device_categories (
            name_ru
          )
        `
        )
        .eq('id', modelId)
        .single()

      if (modelError) throw modelError
      setModel(modelData)

      // Load prices for this model
      const { data: pricesData, error: pricesError } = await supabase
        .from('prices')
        .select(
          `
          *,
          services (
            name_ru,
            slug
          )
        `
        )
        .eq('model_id', modelId)
        .order('service_id')

      if (pricesError) throw pricesError
      setPrices(pricesData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdatePrice(priceId: string, newPrice: number | null) {
    try {
      const formData = new FormData()
      formData.append('priceId', priceId)
      if (newPrice !== null) {
        formData.append('price', newPrice.toString())
      }

      const result = await updatePrice(formData)

      if (result.error) {
        throw new Error(result.error)
      }

      await loadModelAndPrices()
      setEditingPrice(null)
      setEditValue(null)
    } catch (error: any) {
      console.error('Error updating price:', error)
      alert(`Ошибка при обновлении цены: ${error.message}`)
    }
  }

  function startEditing(priceId: string, currentPrice: number | null) {
    setEditingPrice(priceId)
    setEditValue(currentPrice)
  }

  function saveEdit(priceId: string) {
    handleUpdatePrice(priceId, editValue)
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/prices"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Назад к списку моделей
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Управление ценами: {model.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Категория: {model.device_categories?.name_ru}
            </p>
          </div>

          {/* Prices Table */}
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Услуга
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена (CZK)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Нет услуг для этой модели
                    </td>
                  </tr>
                ) : (
                  prices.map((price) => (
                    <tr key={price.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {price.services?.name_ru}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingPrice === price.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={editValue || ''}
                              onChange={(e) =>
                                setEditValue(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : null
                                )
                              }
                              className="w-32 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Цена"
                            />
                            <button
                              onClick={() => saveEdit(price.id)}
                              className="text-green-600 hover:text-green-900 text-sm font-medium"
                            >
                              ✓ Сохранить
                            </button>
                            <button
                              onClick={() => {
                                setEditingPrice(null)
                                setEditValue(null)
                              }}
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                              ✗ Отмена
                            </button>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-900">
                            {price.price ? `${price.price} CZK` : '-'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingPrice !== price.id && (
                          <button
                            onClick={() => startEditing(price.id, price.price)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Изменить
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href="/admin/prices"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Готово
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
