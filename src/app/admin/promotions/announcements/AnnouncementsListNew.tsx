'use client'

import { useState } from 'react'
import { deleteAnnouncement, type Announcement } from './actions'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Pencil, Trash2, GripVertical } from 'lucide-react'
import { AnnouncementDialog } from '@/components/admin/AnnouncementDialog'
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface AnnouncementsListProps {
  announcements: Announcement[]
}

function SortableRow({ announcement, onEdit, onDelete, deletingId }: {
  announcement: Announcement
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  deletingId: string | null
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: announcement.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isActive = announcement.active &&
    new Date(announcement.start_date) <= new Date() &&
    (!announcement.end_date || new Date(announcement.end_date) >= new Date())

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gray-50 transition-colors">
      {/* Drag Handle */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="h-5 w-5" />
        </div>
      </td>

      {/* Display Order */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
          {announcement.display_order}
        </span>
      </td>

      {/* Title */}
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">
          {announcement.title_ru}
        </div>
        {announcement.message_ru && (
          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
            {announcement.message_ru}
          </div>
        )}
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isActive ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        ) : announcement.active ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Scheduled
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Inactive
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(announcement.id)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(announcement.id)}
            disabled={deletingId === announcement.id}
            title="Delete"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

export function AnnouncementsListNew({ announcements: initialAnnouncements }: AnnouncementsListProps) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDeleteClick = (id: string) => {
    setAnnouncementToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!announcementToDelete) return

    setDeletingId(announcementToDelete)
    setDeleteDialogOpen(false)

    const result = await deleteAnnouncement(announcementToDelete)

    if (!result.success) {
      console.error('Failed to delete announcement:', result.error)
    } else {
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementToDelete))
    }

    setDeletingId(null)
    setAnnouncementToDelete(null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = announcements.findIndex((a) => a.id === active.id)
    const newIndex = announcements.findIndex((a) => a.id === over.id)

    const newAnnouncements = arrayMove(announcements, oldIndex, newIndex)

    // Update display_order based on new positions
    const updatedAnnouncements = newAnnouncements.map((announcement, index) => ({
      ...announcement,
      display_order: index,
    }))

    // Optimistic update
    setAnnouncements(updatedAnnouncements)

    // Send to backend
    try {
      const orders = updatedAnnouncements.map((a) => ({
        id: a.id,
        display_order: a.display_order,
      }))

      const response = await fetch('/api/admin/announcements/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      // Revert on error
      setAnnouncements(announcements)
    }
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No announcements yet. Create your first one!</p>
      </div>
    )
  }

  const editingAnnouncement = announcements.find((a) => a.id === editingId)

  return (
    <>
      {editingAnnouncement && (
        <AnnouncementDialog
          announcement={editingAnnouncement}
          open={!!editingId}
          onOpenChange={(open) => setEditingId(open ? editingId : null)}
        />
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {/* Drag handle column */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title (RU)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <SortableContext
                  items={announcements.map((a) => a.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {announcements.map((announcement) => (
                    <SortableRow
                      key={announcement.id}
                      announcement={announcement}
                      onEdit={setEditingId}
                      onDelete={handleDeleteClick}
                      deletingId={deletingId}
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this announcement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
