'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { ServiceToggle } from './ServiceToggle'
import { updateServiceOrder } from './actions'

interface CategoryService {
  id: string
  service_id: string
  service_name_ru: string
  service_name_en: string
  service_name_cz: string
  service_type: string
  order: number
  is_active: boolean
}

interface ServicesListProps {
  initialServices: CategoryService[]
  categorySlug: string
}

function SortableServiceItem({
  service,
  categorySlug,
}: {
  service: CategoryService
  categorySlug: string
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`px-4 py-4 sm:px-6 ${
        isDragging ? 'bg-gray-50 shadow-lg z-50' : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <div className="flex items-center space-x-3">
            {/* Service Type Badge */}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                service.service_type === 'main'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {service.service_type === 'main' ? 'Repair' : 'Extra Service'}
            </span>

            {/* Service Names */}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {service.service_name_en}
              </p>
              <p className="text-xs text-gray-500">
                RU: {service.service_name_ru} • CZ: {service.service_name_cz}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-1">Order: {service.order}</p>
        </div>

        {/* Toggle */}
        <div className="ml-4">
          <ServiceToggle
            categoryServiceId={service.id}
            isActive={service.is_active}
            categorySlug={categorySlug}
          />
        </div>
      </div>
    </li>
  )
}

export function ServicesList({
  initialServices,
  categorySlug,
}: ServicesListProps) {
  const [services, setServices] = useState(initialServices)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = services.findIndex((s) => s.id === active.id)
    const newIndex = services.findIndex((s) => s.id === over.id)

    // Optimistically update UI
    const newServices = arrayMove(services, oldIndex, newIndex)
    setServices(newServices)

    // Update order values based on new positions
    setIsSaving(true)

    try {
      // Calculate new order values (maintaining gaps for easier future insertions)
      const updates = newServices.map((service, index) => ({
        id: service.id,
        newOrder: (index + 1) * 10, // 10, 20, 30, etc.
      }))

      // Update each service's order
      for (const { id, newOrder } of updates) {
        await updateServiceOrder(id, newOrder, categorySlug)
      }

      // Refresh to get updated data
      router.refresh()
    } catch (error) {
      // Revert on error
      setServices(initialServices)
    } finally {
      setIsSaving(false)
    }
  }

  if (!services || services.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-gray-500">
        No services found. Add the first service above.
      </div>
    )
  }

  return (
    <div className="relative">
      {isSaving && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex items-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-indigo-600"
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
            <span className="text-sm text-gray-600">Saving...</span>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={services.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="divide-y divide-gray-200">
            {services.map((service) => (
              <SortableServiceItem
                key={service.id}
                service={service}
                categorySlug={categorySlug}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="mt-4 px-4 py-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Drag services to reorder display
        </p>
      </div>
    </div>
  )
}
