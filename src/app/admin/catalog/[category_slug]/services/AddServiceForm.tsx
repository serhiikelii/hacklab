'use client'

import { useState, useEffect } from 'react'
import { createService, getMaxServiceOrder } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, X } from 'lucide-react'

interface AddServiceFormProps {
  categoryId: string
  categorySlug: string
}

export function AddServiceForm({
  categoryId,
  categorySlug,
}: AddServiceFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [maxOrder, setMaxOrder] = useState<number>(0)
  const [serviceType, setServiceType] = useState<'main' | 'extra'>('main')

  useEffect(() => {
    if (isOpen) {
      getMaxServiceOrder(categoryId).then(setMaxOrder)
    }
  }, [isOpen, categoryId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    // Manual validation (avoid browser tooltips)
    const nameRu = formData.get('name_ru')
    const nameEn = formData.get('name_en')
    const nameCz = formData.get('name_cz')
    const order = formData.get('order')

    if (!nameRu || !nameEn || !nameCz || !order) {
      setError('All fields are required')
      setLoading(false)
      return
    }
    formData.append('category_id', categoryId)

    const result = await createService(formData)

    if (result.success) {
      setIsOpen(false)
      ;(e.target as HTMLFormElement).reset()
    } else {
      setError(result.error || 'Error creating service')
    }

    setLoading(false)
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="primary" className="mb-4">
        <Plus className="h-4 w-4 mr-2" />
        Add Service
      </Button>
    )
  }

  const recommendedOrder = maxOrder + 10

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium">Add New Service</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsOpen(false)
            setError('')
          }}
          disabled={loading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Multilingual fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="name_ru">
              Name (RU) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="name_ru"
              id="name_ru"
              placeholder="Замена экрана"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="name_en">
              Name (EN) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="name_en"
              id="name_en"
              placeholder="Screen replacement"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="name_cz">
              Name (CZ) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="name_cz"
              id="name_cz"
              placeholder="Výměna obrazovky"
              disabled={loading}
            />
          </div>
        </div>

        {/* Service Type */}
        <div>
          <Label htmlFor="service_type">Service Type</Label>
          <Select
            value={serviceType}
            onValueChange={(value) => setServiceType(value as 'main' | 'extra')}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Main - Repair</SelectItem>
              <SelectItem value="extra">Extra - Additional Service</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="service_type" value={serviceType} />
        </div>

        {/* Order */}
        <div>
          <Label htmlFor="order">
            Sort Order <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            name="order"
            id="order"
            min="1"
            defaultValue={recommendedOrder}
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Max order: <strong>{maxOrder}</strong>.
            Recommended: <strong>{recommendedOrder}</strong> (multiples of 10: 10, 20, 30, etc.)
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button type="submit" variant="outline" disabled={loading}>
            {loading ? 'Creating...' : 'Create Service'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false)
              setError('')
            }}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
