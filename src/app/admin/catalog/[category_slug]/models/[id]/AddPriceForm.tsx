'use client'

import { useState, useActionState } from 'react'
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

  // Фильтровать услуги, для которых уже есть цены
  const filteredServices = availableServices.filter(
    (service) => !existingServiceIds.includes(service.id)
  )

  const handleSuccess = () => {
    if (state?.success) {
      setIsOpen(false)
      setSelectedServiceId('')
    }
  }

  // Автоматически закрыть форму при успехе
  if (state?.success && isOpen) {
    handleSuccess()
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="mb-4">
        <Plus className="h-4 w-4 mr-2" />
        Добавить цену
      </Button>
    )
  }

  if (filteredServices.length === 0) {
    return (
      <div className="mb-4 p-4 bg-yellow-50 rounded-md border border-yellow-200">
        <p className="text-sm text-yellow-800">
          Все доступные услуги уже добавлены для этой модели
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="mt-2"
        >
          Закрыть
        </Button>
      </div>
    )
  }

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium">Добавить новую цену</h4>
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
        {/* Выбор услуги */}
        <div>
          <Label htmlFor="service_id">
            Услуга <span className="text-red-500">*</span>
          </Label>
          <Select
            name="service_id"
            value={selectedServiceId}
            onValueChange={setSelectedServiceId}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите услугу" />
            </SelectTrigger>
            <SelectContent>
              {filteredServices.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  <div className="flex items-center gap-2">
                    <span>{service.name_ru}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        service.service_type === 'main'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {service.service_type === 'main' ? 'Ремонт' : 'Доп.'}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state?.errors?.service_id && (
            <p className="text-sm text-red-600 mt-1">
              {state.errors.service_id[0]}
            </p>
          )}
        </div>

        {/* Цена */}
        <div>
          <Label htmlFor="price">Цена (CZK)</Label>
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

        {/* Время работы */}
        <div>
          <Label htmlFor="duration_minutes">Время работы (минуты)</Label>
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

        {/* Гарантия */}
        <div>
          <Label htmlFor="warranty_months">Гарантия (месяцы)</Label>
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

        {/* Сообщение об ошибке */}
        {state && !state.success && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{state.message}</p>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending || !selectedServiceId}>
            {isPending ? 'Добавление...' : 'Добавить'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  )
}
