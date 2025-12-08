'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addServiceToCategory, getAvailableServicesForCategory } from './actions'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface AddCategoryServiceFormProps {
  categoryId: string
  categorySlug: string
}

interface AvailableService {
  id: string
  name_ru: string
  name_en: string
  name_cz: string
  service_type: string
  order: number
}

export function AddCategoryServiceForm({
  categoryId,
  categorySlug,
}: AddCategoryServiceFormProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableServices, setAvailableServices] = useState<AvailableService[]>([])
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isOpen) {
      loadAvailableServices()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, categoryId])

  const loadAvailableServices = async () => {
    const services = await getAvailableServicesForCategory(categoryId)
    setAvailableServices(services)
  }

  const handleToggleService = (serviceId: string) => {
    setSelectedServices((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId)
      } else {
        newSet.add(serviceId)
      }
      return newSet
    })
  }

  const handleSubmit = async () => {
    if (selectedServices.size === 0) {
      setError('Please select at least one service')
      return
    }

    setLoading(true)
    setError('')

    const result = await addServiceToCategory(
      categoryId,
      Array.from(selectedServices),
      categorySlug
    )

    if (result.success) {
      setIsOpen(false)
      setSelectedServices(new Set())
      router.refresh() // Refresh the page to show new services
    } else {
      setError(result.error || 'Error adding services')
    }

    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Services
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Services to Category</DialogTitle>
          <DialogDescription>
            Select services from the global list to add to this category
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {availableServices.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No available services to add.</p>
            <p className="text-sm mt-2">
              All global services are already added to this category, or no global services exist yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Select services to add ({selectedServices.size} selected)
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4">
              {availableServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-md"
                >
                  <Checkbox
                    id={service.id}
                    checked={selectedServices.has(service.id)}
                    onCheckedChange={() => handleToggleService(service.id)}
                    disabled={loading}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={service.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{service.name_en}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            service.service_type === 'main'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {service.service_type === 'main' ? 'Main' : 'Extra'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        RU: {service.name_ru} • CZ: {service.name_cz}
                      </p>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false)
              setSelectedServices(new Set())
              setError('')
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || selectedServices.size === 0}
          >
            {loading ? 'Adding...' : `Add ${selectedServices.size} Service${selectedServices.size !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
