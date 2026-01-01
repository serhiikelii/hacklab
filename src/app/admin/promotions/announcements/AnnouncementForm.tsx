'use client'

import { useState, useEffect } from 'react'
import {
  createAnnouncement,
  updateAnnouncement,
  getInfoDiscounts,
  type AnnouncementType,
  type Announcement,
  type InfoDiscount,
} from './actions'
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
import { Plus, X, Megaphone, AlertTriangle, Info as InfoIcon, Percent } from 'lucide-react'
import { AnnouncementPreview } from './AnnouncementPreview'

interface AnnouncementFormProps {
  announcement?: Announcement
  onClose?: () => void
}

const TYPE_OPTIONS: { value: AnnouncementType; label: string; icon: React.ReactNode }[] = [
  { value: 'promo', label: 'Promo', icon: <Megaphone className="w-5 h-5 text-indigo-600" /> },
  { value: 'warning', label: 'Warning', icon: <AlertTriangle className="w-5 h-5 text-amber-600" /> },
  { value: 'info', label: 'Info', icon: <InfoIcon className="w-5 h-5 text-blue-600" /> },
  { value: 'sale', label: 'Sale', icon: <Percent className="w-5 h-5 text-red-600" /> },
]

export function AnnouncementForm({ announcement, onClose }: AnnouncementFormProps) {
  const isEditMode = !!announcement
  const [isOpen, setIsOpen] = useState(isEditMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoDiscounts, setInfoDiscounts] = useState<InfoDiscount[]>([])

  // Form state for live preview
  const [type, setType] = useState<AnnouncementType>(announcement?.type || 'info')
  const [titleRu, setTitleRu] = useState(announcement?.title_ru || '')
  const [titleEn, setTitleEn] = useState(announcement?.title_en || '')
  const [titleCz, setTitleCz] = useState(announcement?.title_cz || '')
  const [messageRu, setMessageRu] = useState(announcement?.message_ru || '')
  const [messageEn, setMessageEn] = useState(announcement?.message_en || '')
  const [messageCz, setMessageCz] = useState(announcement?.message_cz || '')
  const [startDate, setStartDate] = useState(
    announcement?.start_date?.split('T')[0] || ''
  )
  const [endDate, setEndDate] = useState(announcement?.end_date?.split('T')[0] || '')
  const [backgroundColor, setBackgroundColor] = useState(
    announcement?.background_color || ''
  )
  const [textColor, setTextColor] = useState(announcement?.text_color || '#FFFFFF')
  const [icon, setIcon] = useState(announcement?.icon || '')
  const [linkUrl, setLinkUrl] = useState(announcement?.link_url || '')
  const [linkTextRu, setLinkTextRu] = useState(announcement?.link_text_ru || '')
  const [linkTextEn, setLinkTextEn] = useState(announcement?.link_text_en || '')
  const [linkTextCz, setLinkTextCz] = useState(announcement?.link_text_cz || '')
  const [discountId, setDiscountId] = useState<string>(announcement?.discount_id || '')
  const [displayOrder, setDisplayOrder] = useState(
    announcement?.display_order?.toString() || '0'
  )

  // Load info discounts
  useEffect(() => {
    if (isOpen) {
      getInfoDiscounts().then(setInfoDiscounts)
    }
  }, [isOpen])

  // Auto-fill from selected discount
  const handleDiscountSelect = (selectedDiscountId: string) => {
    setDiscountId(selectedDiscountId)

    if (!selectedDiscountId) return

    const discount = infoDiscounts.find((d) => d.id === selectedDiscountId)
    if (!discount) return

    // Auto-fill titles if empty
    if (!titleRu) setTitleRu(discount.name_ru)
    if (!titleEn) setTitleEn(discount.name_en)
    if (!titleCz) setTitleCz(discount.name_cz)

    // Auto-fill messages with discount info
    const discountText =
      discount.discount_type === 'percentage'
        ? `${discount.value}%`
        : `${discount.value} Kč`

    if (!messageRu) setMessageRu(`Скидка ${discountText}`)
    if (!messageEn) setMessageEn(`Discount ${discountText}`)
    if (!messageCz) setMessageCz(`Sleva ${discountText}`)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    const result = isEditMode
      ? await updateAnnouncement(announcement.id, formData)
      : await createAnnouncement(formData)

    if (result.success) {
      setIsOpen(false)
      if (onClose) onClose()
      if (!isEditMode) {
        // Reset form for create mode
        ;(e.target as HTMLFormElement).reset()
        setType('info')
        setTitleRu('')
        setTitleEn('')
        setTitleCz('')
        setMessageRu('')
        setMessageEn('')
        setMessageCz('')
        setStartDate('')
        setEndDate('')
        setBackgroundColor('')
        setTextColor('#FFFFFF')
        setIcon('')
        setLinkUrl('')
        setLinkTextRu('')
        setLinkTextEn('')
        setLinkTextCz('')
        setDiscountId('')
        setDisplayOrder('0')
      }
    } else {
      setError(result.error || 'Error saving announcement')
    }

    setLoading(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setError('')
    if (onClose) onClose()
  }

  if (!isOpen && !isEditMode) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="default" className="mb-4">
        <Plus className="h-4 w-4 mr-2" />
        Add Announcement
      </Button>
    )
  }

  return (
    <div className="mb-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium">
          {isEditMode ? 'Edit Announcement' : 'Add New Announcement'}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Type and Content */}
        <div className="space-y-4">
          <h5 className="font-semibold text-gray-900 pb-2 border-b">
            1. Type and Content
          </h5>

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
                value={messageRu}
                onChange={(e) => setMessageRu(e.target.value)}
                rows={2}
                placeholder="Optional message..."
              />
            </div>
            <div>
              <Label htmlFor="message_en">Message (EN)</Label>
              <Textarea
                id="message_en"
                name="message_en"
                value={messageEn}
                onChange={(e) => setMessageEn(e.target.value)}
                rows={2}
                placeholder="Optional message..."
              />
            </div>
            <div>
              <Label htmlFor="message_cz">Message (CZ)</Label>
              <Textarea
                id="message_cz"
                name="message_cz"
                value={messageCz}
                onChange={(e) => setMessageCz(e.target.value)}
                rows={2}
                placeholder="Optional message..."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Validity Period */}
        <div className="space-y-4">
          <h5 className="font-semibold text-gray-900 pb-2 border-b">
            2. Validity Period
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date/Time *</Label>
              <Input
                id="start_date"
                name="start_date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date/Time</Label>
              <Input
                id="end_date"
                name="end_date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Design */}
        <div className="space-y-4">
          <h5 className="font-semibold text-gray-900 pb-2 border-b">3. Design</h5>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="background_color">Background Color (HEX)</Label>
              <div className="flex gap-2">
                <Input
                  id="background_color"
                  name="background_color"
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="#4F46E5"
                />
                <input
                  type="color"
                  value={backgroundColor || '#4F46E5'}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for default by type
              </p>
            </div>
            <div>
              <Label htmlFor="text_color">Text Color (HEX) *</Label>
              <div className="flex gap-2">
                <Input
                  id="text_color"
                  name="text_color"
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  placeholder="#FFFFFF"
                  required
                />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="icon">Icon (emoji or text)</Label>
              <Input
                id="icon"
                name="icon"
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="🎉"
                maxLength={10}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for default icon
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Link (Optional) */}
        <div className="space-y-4">
          <h5 className="font-semibold text-gray-900 pb-2 border-b">
            4. Link (Optional)
          </h5>
          <div>
            <Label htmlFor="link_url">Link URL</Label>
            <Input
              id="link_url"
              name="link_url"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="link_text_ru">Link Text (RU)</Label>
              <Input
                id="link_text_ru"
                name="link_text_ru"
                value={linkTextRu}
                onChange={(e) => setLinkTextRu(e.target.value)}
                placeholder="Learn more"
              />
            </div>
            <div>
              <Label htmlFor="link_text_en">Link Text (EN)</Label>
              <Input
                id="link_text_en"
                name="link_text_en"
                value={linkTextEn}
                onChange={(e) => setLinkTextEn(e.target.value)}
                placeholder="Learn more"
              />
            </div>
            <div>
              <Label htmlFor="link_text_cz">Link Text (CZ)</Label>
              <Input
                id="link_text_cz"
                name="link_text_cz"
                value={linkTextCz}
                onChange={(e) => setLinkTextCz(e.target.value)}
                placeholder="Zjistit více"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Link to Discount (Optional) */}
        <div className="space-y-4">
          <h5 className="font-semibold text-gray-900 pb-2 border-b">
            5. Link to Informational Discount (Optional)
          </h5>
          <div>
            <Label htmlFor="discount_id">Select Discount</Label>
            <Select
              name="discount_id"
              value={discountId}
              onValueChange={handleDiscountSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="None (manual entry)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {infoDiscounts.map((discount) => (
                  <SelectItem key={discount.id} value={discount.id}>
                    {discount.name_ru} (
                    {discount.discount_type === 'percentage'
                      ? `${discount.value}%`
                      : `${discount.value} Kč`}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Selecting a discount will auto-fill title and message fields
            </p>
          </div>
        </div>

        {/* Section 6: Display Order */}
        <div className="space-y-4">
          <h5 className="font-semibold text-gray-900 pb-2 border-b">
            6. Display Order
          </h5>
          <div>
            <Label htmlFor="display_order">Display Order (0-999) *</Label>
            <Input
              id="display_order"
              name="display_order"
              type="number"
              min="0"
              max="999"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower number = higher priority (shown first)
            </p>
          </div>
        </div>

        {/* Section 7: Preview */}
        <div className="space-y-4">
          <h5 className="font-semibold text-gray-900 pb-2 border-b">7. Preview</h5>
          <AnnouncementPreview
            type={type}
            titleRu={titleRu}
            titleEn={titleEn}
            titleCz={titleCz}
            messageRu={messageRu}
            messageEn={messageEn}
            messageCz={messageCz}
            backgroundColor={backgroundColor}
            textColor={textColor}
            icon={icon}
            linkUrl={linkUrl}
            linkTextRu={linkTextRu}
            linkTextEn={linkTextEn}
            linkTextCz={linkTextCz}
          />
        </div>

        {/* Active checkbox */}
        <div className="flex items-center gap-2 pt-4 border-t">
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

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" variant="default" disabled={loading}>
            {loading
              ? 'Saving...'
              : isEditMode
              ? 'Update Announcement'
              : 'Create Announcement'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
