'use client'

import { useState, useEffect } from 'react'
import { createDiscount, getCategoryServices } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, X } from 'lucide-react'
import type { DiscountType } from '@/types/pricelist'

interface CategoryServiceOption {
  id: string
  category_id: string
  service_id: string
  category_name: string
  service_name: string
}

export function AddDiscountForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // All discounts are now automatic (migration 007)
  const isAutoApply = true
  const [discountType, setDiscountType] = useState<DiscountType>('percentage')
  const [categoryServices, setCategoryServices] = useState<
    CategoryServiceOption[]
  >([])
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set()
  )

  // Load category_services when auto-apply is selected
  useEffect(() => {
    if (isAutoApply && categoryServices.length === 0) {
      getCategoryServices().then(setCategoryServices)
    }
  }, [isAutoApply, categoryServices.length])

  // Group services by category
  const groupedServices = categoryServices.reduce((acc, service) => {
    if (!acc[service.category_name]) {
      acc[service.category_name] = []
    }
    acc[service.category_name].push(service)
    return acc
  }, {} as Record<string, CategoryServiceOption[]>)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    // Add selected category_service_ids
    if (isAutoApply) {
      formData.set('category_service_ids', Array.from(selectedServices).join(','))
    }

    const result = await createDiscount(formData)

    if (result.success) {
      setIsOpen(false)
      setSelectedServices(new Set())
      ;(e.target as HTMLFormElement).reset()
    } else {
      setError(result.error || 'Error creating discount')
    }

    setLoading(false)
  }

  const toggleService = (serviceId: string) => {
    const newSet = new Set(selectedServices)
    if (newSet.has(serviceId)) {
      newSet.delete(serviceId)
    } else {
      newSet.add(serviceId)
    }
    setSelectedServices(newSet)
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="default" className="mb-4">
        <Plus className="h-4 w-4 mr-2" />
        Add Discount
      </Button>
    )
  }

  return (
    <div className="mb-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium">Add New Discount</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsOpen(false)
            setError('')
            setSelectedServices(new Set())
          }}
          disabled={loading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Names (RU/EN/CZ) */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="name_ru">Name (RU) *</Label>
            <Input id="name_ru" name="name_ru" required />
          </div>
          <div>
            <Label htmlFor="name_en">Name (EN) *</Label>
            <Input id="name_en" name="name_en" required />
          </div>
          <div>
            <Label htmlFor="name_cz">Name (CZ) *</Label>
            <Input id="name_cz" name="name_cz" required />
          </div>
        </div>

        {/* Conditions (optional) */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="conditions_ru">Conditions (RU)</Label>
            <Textarea
              id="conditions_ru"
              name="conditions_ru"
              rows={2}
              placeholder="Optional conditions..."
            />
          </div>
          <div>
            <Label htmlFor="conditions_en">Conditions (EN)</Label>
            <Textarea
              id="conditions_en"
              name="conditions_en"
              rows={2}
              placeholder="Optional conditions..."
            />
          </div>
          <div>
            <Label htmlFor="conditions_cz">Conditions (CZ)</Label>
            <Textarea
              id="conditions_cz"
              name="conditions_cz"
              rows={2}
              placeholder="Optional conditions..."
            />
          </div>
        </div>

        {/* Discount Calculation Type & Value */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="discount_type">Calculation Type *</Label>
            <Select
              name="discount_type"
              value={discountType}
              onValueChange={(value) => setDiscountType(value as DiscountType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount (Kč)</SelectItem>
                <SelectItem value="bonus">Bonus (text)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="value">
              Value *
              {discountType === 'percentage' && ' (1-100)'}
            </Label>
            <Input
              id="value"
              name="value"
              type="number"
              step={discountType === 'percentage' ? '1' : '0.01'}
              min={discountType === 'percentage' ? '1' : '0.01'}
              max={discountType === 'percentage' ? '100' : undefined}
              required
            />
          </div>
        </div>

        {/* Validity Period */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" name="start_date" type="date" />
          </div>
          <div>
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" name="end_date" type="date" />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Checkbox id="active" name="active" value="true" defaultChecked />
            <Label htmlFor="active" className="cursor-pointer font-normal">
              Active
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="display_badge"
              name="display_badge"
              value="true"
              defaultChecked
            />
            <Label
              htmlFor="display_badge"
              className="cursor-pointer font-normal"
            >
              Show discount badge
            </Label>
          </div>
        </div>

        {/* Category Services Multi-Select (only for auto-apply) */}
        {isAutoApply && (
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Apply to Services *
            </Label>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4 bg-white">
              {Object.entries(groupedServices).map(([categoryName, services]) => (
                <div key={categoryName} className="mb-4">
                  <div className="font-medium text-sm text-gray-700 mb-2">
                    {categoryName}
                  </div>
                  <div className="space-y-2 ml-4">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={selectedServices.has(service.id)}
                          onCheckedChange={() => toggleService(service.id)}
                        />
                        <Label
                          htmlFor={`service-${service.id}`}
                          className="cursor-pointer font-normal text-sm"
                        >
                          {service.service_name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {selectedServices.size > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {selectedServices.size} service(s)
              </p>
            )}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" variant="default" disabled={loading}>
            {loading ? 'Creating...' : 'Create Discount'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false)
              setError('')
              setSelectedServices(new Set())
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
