'use client'

import { useState, useActionState, useEffect } from 'react'
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
import { addPrice } from './actions'

type Service = {
  id: string
  name_ru: string
  name_en: string
  name_cz: string
  service_type: 'main' | 'extra'
}

type AddPriceFormProps = {
  modelId: string
  categorySlug: string
  availableServices: Service[]
  existingServiceIds: string[]
}

export function AddPriceForm({
  modelId,
  categorySlug,
  availableServices,
  existingServiceIds,
}: AddPriceFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')

  const boundAddPrice = addPrice.bind(null, modelId, categorySlug)
  const [state, formAction, isPending] = useActionState(boundAddPrice, null)

  // Filter services that already have prices
  const filteredServices = availableServices.filter(
    (service) => !existingServiceIds.includes(service.id)
  )

  // Automatically close form on success
  useEffect(() => {
    if (state?.success && isOpen) {
      setIsOpen(false)
      setSelectedServiceId('')
    }
  }, [state?.success, isOpen])

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="primary" className="mb-4">
        <Plus className="h-4 w-4 mr-2" />
        Add Price
      </Button>
    )
  }

  if (filteredServices.length === 0) {
    return (
      <div className="mb-4 p-4 bg-yellow-50 rounded-md border border-yellow-200">
        <p className="text-sm text-yellow-800">
          All available services already added for this model
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="mt-2"
        >
          Close
        </Button>
      </div>
    )
  }

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium">Add New Price</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form action={formAction} className="space-y-4">
        {/* Service selection */}
        <div>
          <Label htmlFor="service_id">
            Service <span className="text-red-500">*</span>
          </Label>
          <Select
            value={selectedServiceId}
            onValueChange={setSelectedServiceId}
            disabled={isPending}
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {filteredServices.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  <div className="flex items-center gap-2">
                    <span>{service.name_en}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        service.service_type === 'main'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {service.service_type === 'main' ? 'Main' : 'Extra'}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="service_id" value={selectedServiceId} />
          {!selectedServiceId && !state?.errors?.service_id && (
            <p className="text-sm text-gray-500 mt-1">
              Please select a service to continue
            </p>
          )}
          {state?.errors?.service_id && (
            <p className="text-sm text-red-600 mt-1">
              {state.errors.service_id[0]}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price">Price (CZK)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="1500"
            min="0"
            step="1"
            disabled={isPending}
          />
          {state?.errors?.price && (
            <p className="text-sm text-red-600 mt-1">{state.errors.price[0]}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <Label htmlFor="duration_minutes">Duration (minutes)</Label>
          <Input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            placeholder="60"
            min="0"
            step="1"
            disabled={isPending}
          />
          {state?.errors?.duration_minutes && (
            <p className="text-sm text-red-600 mt-1">
              {state.errors.duration_minutes[0]}
            </p>
          )}
        </div>

        {/* Warranty */}
        <div>
          <Label htmlFor="warranty_months">Warranty (months)</Label>
          <Input
            id="warranty_months"
            name="warranty_months"
            type="number"
            placeholder="24"
            defaultValue="24"
            min="0"
            step="1"
            disabled={isPending}
          />
          {state?.errors?.warranty_months && (
            <p className="text-sm text-red-600 mt-1">
              {state.errors.warranty_months[0]}
            </p>
          )}
        </div>

        {/* Error message */}
        {state && !state.success && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{state.message}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <Button type="submit" variant="outline" disabled={isPending || !selectedServiceId}>
            {isPending ? 'Adding...' : 'Add'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
