'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { updatePrice } from '@/app/actions/prices'

interface Service {
  id: string
  slug: string
  name_ru: string
  name_en: string
  name_cz: string
  service_type: 'main' | 'extra'
}

interface DeviceModel {
  id: string
  name: string
  slug: string
  release_year: number | null
  device_categories: {
    name_ru: string
    slug: string
  }
}

interface Price {
  id: string
  model_id: string
  service_id: string
  price: number | null
  price_type: 'fixed' | 'from' | 'free' | 'on_request'
  duration_minutes: number | null
  warranty_months: number | null
  device_models: DeviceModel
}

interface Category {
  id: string
  name_ru: string
  slug: string
}

export default function ServicePricesPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  const [service, setService] = useState<Service | null>(null)
  const [prices, setPrices] = useState<Price[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadService()
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId])

  useEffect(() => {
    if (service) {
      loadPrices()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, selectedCategory, service])

  async function loadService() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single()

      if (error) throw error
      setService(data)
    } catch (error) {
      console.error('Error loading service:', error)
    }
  }

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('device_categories')
        .select('id, name_ru, slug')
        .order('order')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  async function loadPrices() {
    try {
      setLoading(true)
      let query = supabase
        .from('prices')
        .select(
          `
          *,
          device_models (
            id,
            name,
            slug,
            release_year,
            category_id,
            device_categories (
              name_ru,
              slug
            )
          )
        `
        )
        .eq('service_id', serviceId)
        .order('device_models(name)')

      const { data, error } = await query

      if (error) throw error

      // Filter by category if selected
      let filteredData = data || []
      if (selectedCategory !== 'all') {
        filteredData = filteredData.filter(
          (price) => price.device_models.category_id === selectedCategory
        )
      }

      setPrices(filteredData)
    } catch (error) {
      console.error('Error loading prices:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdatePrice(
    priceId: string,
    price: number | null,
    duration_minutes: number | null,
    warranty_months: number | null
  ) {
    setSaving(priceId)

    const formData = new FormData()
    formData.append('priceId', priceId)
    if (price !== null) formData.append('price', price.toString())
    if (duration_minutes !== null)
      formData.append('duration_minutes', duration_minutes.toString())
    if (warranty_months !== null)
      formData.append('warranty_months', warranty_months.toString())

    const result = await updatePrice(formData)

    if (result.error) {
      alert(`Ошибка: ${result.error}`)
    } else {
      await loadPrices()
    }

    setSaving(null)
  }

  if (loading && !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Услуга не найдена</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <Link
              href="/admin/services"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Назад к услугам
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Управление ценами: {service.name_ru}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Тип: {service.service_type === 'main' ? 'Основная' : 'Дополнительная'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-6 bg-white shadow-sm rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Фильтр по категории:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена (CZK)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Длительность (мин)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Гарантия (мес)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Загрузка...
                  </td>
                </tr>
              ) : prices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Цены не найдены
                  </td>
                </tr>
              ) : (
                prices.map((price) => (
                  <PriceRow
                    key={price.id}
                    price={price}
                    isSaving={saving === price.id}
                    onUpdate={handleUpdatePrice}
                  />
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

function PriceRow({
  price,
  isSaving,
  onUpdate,
}: {
  price: Price
  isSaving: boolean
  onUpdate: (
    priceId: string,
    price: number | null,
    duration: number | null,
    warranty: number | null
  ) => Promise<void>
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editPrice, setEditPrice] = useState(price.price?.toString() || '')
  const [editDuration, setEditDuration] = useState(
    price.duration_minutes?.toString() || ''
  )
  const [editWarranty, setEditWarranty] = useState(
    price.warranty_months?.toString() || '24'
  )

  const handleSave = async () => {
    await onUpdate(
      price.id,
      editPrice ? parseFloat(editPrice) : null,
      editDuration ? parseInt(editDuration) : null,
      editWarranty ? parseInt(editWarranty) : null
    )
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditPrice(price.price?.toString() || '')
    setEditDuration(price.duration_minutes?.toString() || '')
    setEditWarranty(price.warranty_months?.toString() || '24')
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <tr className="bg-blue-50">
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">
            {price.device_models.name}
          </div>
          {price.device_models.release_year && (
            <div className="text-xs text-gray-500">
              {price.device_models.release_year}
            </div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {price.device_models.device_categories.name_ru}
        </td>
        <td className="px-6 py-4">
          <input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Цена"
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="number"
            value={editDuration}
            onChange={(e) => setEditDuration(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Минуты"
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="number"
            value={editWarranty}
            onChange={(e) => setEditWarranty(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Месяцы"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="text-green-600 hover:text-green-900 disabled:opacity-50"
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              Отмена
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">
          {price.device_models.name}
        </div>
        {price.device_models.release_year && (
          <div className="text-xs text-gray-500">
            {price.device_models.release_year}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {price.device_models.device_categories.name_ru}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {price.price ? `${price.price} Kč` : '—'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {price.duration_minutes || '—'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {price.warranty_months || '—'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => setIsEditing(true)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Редактировать
        </button>
      </td>
    </tr>
  )
}
