'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { updateModelOrder } from './actions'

interface DeviceModel {
  id: string
  name: string
  release_year: number
  order: number
  image_url: string | null
}

interface ModelsListProps {
  initialModels: DeviceModel[]
  categorySlug: string
}

function SortableModelItem({
  model,
  categorySlug,
}: {
  model: DeviceModel
  categorySlug: string
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: model.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`${
        isDragging ? 'bg-gray-50 shadow-lg z-50' : 'bg-white'
      }`}
    >
      <div className="flex items-center px-4 py-4 sm:px-6">
        <button
          {...listeners}
          {...attributes}
          className="mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 focus:outline-none"
          suppressHydrationWarning
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <Link
          href={`/admin/catalog/${categorySlug}/models/${model.id}`}
          className="flex-1 flex items-center justify-between hover:bg-gray-50 transition-colors rounded px-2 py-1"
        >
          <div className="flex items-center space-x-4">
            {model.image_url ? (
              <img
                src={model.image_url}
                alt={model.name}
                className="h-12 w-12 rounded object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-900">
                {model.name}
              </p>
              <p className="text-sm text-gray-500">
                Year: {model.release_year} • Order: {model.order}
              </p>
            </div>
          </div>

          <div>
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>
      </div>
    </li>
  )
}

export function ModelsList({ initialModels, categorySlug }: ModelsListProps) {
  const [models, setModels] = useState(initialModels)
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

    if (isSaving) {
      return
    }

    const oldIndex = models.findIndex((m) => m.id === active.id)
    const newIndex = models.findIndex((m) => m.id === over.id)

    const newModels = arrayMove(models, oldIndex, newIndex)

    setModels(newModels)
    setIsSaving(true)

    try {
      const updates = newModels.map((model, index) => ({
        id: model.id,
        order: index + 1,
      }))

      const result = await updateModelOrder(updates)

      if (!result.success) {
        setModels(models)
        alert('Error updating model order')
      } else {
        router.refresh()
      }
    } catch (error) {
      setModels(models)
      alert('Error updating order')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Models List ({models.length})
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Drag models to change order
          {isSaving && <span className="ml-2 text-[#052533]">Saving...</span>}
        </p>
      </div>

      {models.length === 0 ? (
        <div className="px-4 py-12 text-center text-gray-500">
          No models found. Add the first model above.
        </div>
      ) : (
        <div className={isSaving ? 'pointer-events-none opacity-60' : ''}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={models.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="divide-y divide-gray-200">
                {models.map((model) => (
                  <SortableModelItem
                    key={model.id}
                    model={model}
                    categorySlug={categorySlug}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
