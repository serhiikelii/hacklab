'use client'

import { useState, useEffect } from 'react'
import {
  createAnnouncement,
  updateAnnouncement,
  getInfoDiscounts,
  type AnnouncementType,
  type Announcement,
  type InfoDiscount,
} from '@/app/admin/promotions/announcements/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Megaphone, AlertTriangle, Info as InfoIcon, Percent } from 'lucide-react'

const TYPE_OPTIONS: { value: AnnouncementType; label: string; icon: React.ReactNode }[] = [
  { value: 'promo', label: 'Promo', icon: <Megaphone className="w-5 h-5 text-indigo-600" /> },
  { value: 'warning', label: 'Warning', icon: <AlertTriangle className="w-5 h-5 text-amber-600" /> },
  { value: 'info', label: 'Info', icon: <InfoIcon className="w-5 h-5 text-blue-600" /> },
  { value: 'sale', label: 'Sale', icon: <Percent className="w-5 h-5 text-red-600" /> },
]

interface AnnouncementDialogProps {
  announcement?: Announcement
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AnnouncementDialog({ announcement, trigger, open: controlledOpen, onOpenChange }: AnnouncementDialogProps) {
  const isEditMode = !!announcement
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoDiscounts, setInfoDiscounts] = useState<InfoDiscount[]>([])

  // Form state
  const [type, setType] = useState<AnnouncementType>(announcement?.type || 'info')
  const [theme, setTheme] = useState<'matte' | 'glossy' | 'outline'>(announcement?.theme || 'glossy')
  const [titleRu, setTitleRu] = useState(announcement?.title_ru || '')
  const [titleEn, setTitleEn] = useState(announcement?.title_en || '')
  const [titleCz, setTitleCz] = useState(announcement?.title_cz || '')

  // Load info discounts when dialog opens
  useEffect(() => {
    if (open) {
      getInfoDiscounts().then(setInfoDiscounts)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    const result = isEditMode
      ? await updateAnnouncement(announcement.id, formData)
      : await createAnnouncement(formData)

    if (result.success) {
      setOpen(false)
      if (!isEditMode) {
        ;(e.target as HTMLFormElement).reset()
        setType('info')
        setTheme('glossy')
        setTitleRu('')
        setTitleEn('')
        setTitleCz('')
      }
    } else {
      setError(result.error || `Error ${isEditMode ? 'updating' : 'creating'} announcement`)
    }

    setLoading(false)
  }

  const defaultTrigger = (
    <Button variant="default">
      <Plus className="h-4 w-4 mr-2" />
      Add Announcement
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Announcement' : 'Add New Announcement'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update announcement details and save changes.'
              : 'Create a new promotional banner for the homepage.'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type selector */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Banner Type *</Label>
            <div className="grid grid-cols-4 gap-3">
              {TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    type === option.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={option.value}
                    checked={type === option.value}
                    onChange={(e) => setType(e.target.value as AnnouncementType)}
                    className="sr-only"
                  />
                  {option.icon}
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Theme selector */}
          <div>
            <Label htmlFor="theme">Banner Theme *</Label>
            <Select
              value={theme}
              onValueChange={(value) => setTheme(value as 'matte' | 'glossy' | 'outline')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matte">Matte (Матовый)</SelectItem>
                <SelectItem value="glossy">Glossy (Глянцевый) - Recommended</SelectItem>
                <SelectItem value="outline">Outline (Аутлайн)</SelectItem>
              </SelectContent>
            </Select>
            {/* Hidden input to pass theme value to FormData */}
            <input type="hidden" name="theme" value={theme} />
            <p className="text-xs text-gray-500 mt-1">
              Matte (opacity 90%), Glossy (gradient with shadow), Outline (border only)
            </p>
          </div>

          {/* Titles */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="title_ru">Title (RU) *</Label>
              <Input
                id="title_ru"
                name="title_ru"
                value={titleRu}
                onChange={(e) => setTitleRu(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="title_en">Title (EN) *</Label>
              <Input
                id="title_en"
                name="title_en"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="title_cz">Title (CZ) *</Label>
              <Input
                id="title_cz"
                name="title_cz"
                value={titleCz}
                onChange={(e) => setTitleCz(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Messages */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="message_ru">Message (RU)</Label>
              <Textarea
                id="message_ru"
                name="message_ru"
                rows={2}
                defaultValue={announcement?.message_ru || ''}
                placeholder="Optional message..."
              />
            </div>
            <div>
              <Label htmlFor="message_en">Message (EN)</Label>
              <Textarea
                id="message_en"
                name="message_en"
                rows={2}
                defaultValue={announcement?.message_en || ''}
                placeholder="Optional message..."
              />
            </div>
            <div>
              <Label htmlFor="message_cz">Message (CZ)</Label>
              <Textarea
                id="message_cz"
                name="message_cz"
                rows={2}
                defaultValue={announcement?.message_cz || ''}
                placeholder="Optional message..."
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date/Time *</Label>
              <Input
                id="start_date"
                name="start_date"
                type="datetime-local"
                defaultValue={announcement?.start_date?.slice(0, 16)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date/Time</Label>
              <Input
                id="end_date"
                name="end_date"
                type="datetime-local"
                defaultValue={announcement?.end_date?.slice(0, 16)}
              />
            </div>
          </div>

          {/* Display Order */}
          <div>
            <Label htmlFor="display_order">Display Order (0-999) *</Label>
            <Input
              id="display_order"
              name="display_order"
              type="number"
              min="0"
              max="999"
              defaultValue={announcement?.display_order || 0}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower number = higher priority (shown first)
            </p>
          </div>

          {/* Active checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="active"
              name="active"
              value="true"
              defaultChecked={announcement?.active ?? true}
            />
            <Label htmlFor="active" className="cursor-pointer font-normal">
              Active (show on website)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Update Announcement' : 'Create Announcement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
