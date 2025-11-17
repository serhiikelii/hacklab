'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

interface Price {
  id: string
  price: number | null
  price_type: 'fixed' | 'from' | 'free' | 'on_request'
  is_active: boolean
  device_models: {
    name: string
    slug: string
  }
  services: {
    name_ru: string
    slug: string
  }
}

interface Category {
  id: string
  name_ru: string
  slug: string
}

export default function AdminPricesPage() {
  const [prices, setPrices] = useState<Price[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadCategories()
    loadPrices()
  }, [selectedCategory])

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('device_categories')
        .select('id, name_ru, slug')
        .eq('is_active', true)
        .order('order')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  async function loadPrices() {
    try {
      let query = supabase
        .from('prices')
        .select(
          `
          *,
          device_models (
            name,
            slug,
            category_id
          ),
          services (
            name_ru,
            slug
          )
        `
        )
        .order('id')

      const { data, error } = await query

      if (error) throw error

      // Filter by category if selected
      let filteredData = data || []
      if (selectedCategory !== 'all') {
        filteredData = filteredData.filter(
          (price) =>
            price.device_models?.category_id === selectedCategory
        )
      }

      setPrices(filteredData)
    } catch (error) {
      console.error('Error loading prices:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updatePrice(priceId: string, newPrice: number | null) {
    try {
      const { error } = await supabase
        .from('prices')
        .update({ price: newPrice })
        .eq('id', priceId)

      if (error) throw error
      await loadPrices()
      setEditingPrice(null)
      setEditValue(null)
    } catch (error) {
      console.error('Error updating price:', error)
      alert('Ошибка при обновлении цены')
    }
  }

  async function toggleActive(priceId: string, currentState: boolean) {
    try {
      const { error } = await supabase
        .from('prices')
        .update({ is_active: !currentState })
        .eq('id', priceId)

      if (error) throw error
      await loadPrices()
    } catch (error) {
      console.error('Error updating price:', error)
      alert('Ошибка при обновлении цены')
    }
  }

  function startEditing(priceId: string, currentPrice: number | null) {
    setEditingPrice(priceId)
    setEditValue(currentPrice)
  }

  function saveEdit(priceId: string) {
    updatePrice(priceId, editValue)
  }

  function formatPrice(price: Price): string {
    switch (price.price_type) {
      case 'fixed':
        return `${price.price} CZK`
      case 'from':
        return `от ${price.price} CZK`
      case 'free':
        return 'Бесплатно'
      case 'on_request':
        return 'По запросу'
      default:
        return '-'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Назад к панели
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Управление ценами
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Фильтр по категории:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Все категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_ru}
              </option>
            ))}
          </select>
        </div>

        {/* Prices Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Модель
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Услуга
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
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
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Цены не найдены
                  </td>
                </tr>
              ) : (
                prices.map((price) => (
                  <tr key={price.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {price.device_models?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
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
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={() => saveEdit(price.id)}
                            className="text-green-600 hover:text-green-900 text-sm"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => {
                              setEditingPrice(null)
                              setEditValue(null)
                            }}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            ✗
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">
                          {formatPrice(price)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          price.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {price.is_active ? 'Активна' : 'Неактивна'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {price.price_type !== 'free' &&
                        price.price_type !== 'on_request' && (
                          <button
                            onClick={() =>
                              startEditing(price.id, price.price)
                            }
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Изменить
                          </button>
                        )}
                      <button
                        onClick={() => toggleActive(price.id, price.is_active)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        {price.is_active ? 'Деактивировать' : 'Активировать'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mt-4 text-sm text-gray-500">
          Всего цен: {prices.length}
        </div>
      </div>
    </div>
  )
}
