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
import { Pencil, Trash2, Eye, Megaphone, AlertTriangle, Info, Percent } from 'lucide-react'
import { AnnouncementForm } from './AnnouncementForm'

interface AnnouncementsListProps {
  announcements: Announcement[]
}

const TYPE_ICONS = {
  promo: <Megaphone className="w-4 h-4 text-indigo-600" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-600" />,
  info: <Info className="w-4 h-4 text-blue-600" />,
  sale: <Percent className="w-4 h-4 text-red-600" />,
}

const TYPE_LABELS = {
  promo: 'Promo',
  warning: 'Warning',
  info: 'Info',
  sale: 'Sale',
}

export function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null)

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
    }

    setDeletingId(null)
    setAnnouncementToDelete(null)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isActive = (announcement: Announcement) => {
    if (!announcement.active) return false
    const now = new Date()
    const start = new Date(announcement.start_date)
    if (now < start) return false
    if (announcement.end_date) {
      const end = new Date(announcement.end_date)
      if (now > end) return false
    }
    return true
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No announcements yet. Create your first one!</p>
      </div>
    )
  }

  // Show edit form if editing
  const editingAnnouncement = announcements.find((a) => a.id === editingId)
  if (editingAnnouncement) {
    return (
      <AnnouncementForm
        announcement={editingAnnouncement}
        onClose={() => setEditingId(null)}
      />
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title (RU)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
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
            {announcements.map((announcement) => (
              <tr
                key={announcement.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Display Order */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                    {announcement.display_order}
                  </span>
                </td>

                {/* Type */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {TYPE_ICONS[announcement.type]}
                    <span className="text-sm font-medium text-gray-700">
                      {TYPE_LABELS[announcement.type]}
                    </span>
                  </div>
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

                {/* Period */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div>
                    <div className="font-medium">
                      {formatDate(announcement.start_date)}
                    </div>
                    {announcement.end_date && (
                      <div className="text-xs text-gray-500">
                        to {formatDate(announcement.end_date)}
                      </div>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {isActive(announcement) ? (
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
                      onClick={() => setEditingId(announcement.id)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(announcement.id)}
                      disabled={deletingId === announcement.id}
                      title="Delete"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  )
}
