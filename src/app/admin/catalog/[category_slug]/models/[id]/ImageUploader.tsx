'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadModelImage, removeModelImage } from '@/app/actions/images'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ImageUploaderProps {
  modelId: string
  currentImageUrl: string | null
  categorySlug: string
  onUploadSuccess?: (newUrl: string) => void
}

export function ImageUploader({
  modelId,
  currentImageUrl,
  categorySlug,
  onUploadSuccess,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl
  )
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    try {
      // Вызываем Server Action напрямую
      const result = await uploadModelImage(modelId, categorySlug, file)

      if (!result.success || !result.imageUrl) {
        throw new Error(result.error || 'Ошибка загрузки изображения')
      }

      // Обновляем preview
      setPreviewUrl(result.imageUrl)

      // Вызываем callback если есть
      if (onUploadSuccess) {
        onUploadSuccess(result.imageUrl)
      }

      // Очищаем input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    setShowDeleteDialog(false)
    setIsUploading(true)
    setError(null)

    try {
      // Вызываем Server Action напрямую
      const result = await removeModelImage(modelId)

      if (!result.success) {
        throw new Error(result.error || 'Ошибка удаления изображения')
      }

      setPreviewUrl(null)

      if (onUploadSuccess) {
        onUploadSuccess('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="relative w-full max-w-md">
        {previewUrl ? (
          <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={previewUrl}
              alt="Model preview"
              fill
              className="object-contain bg-white"
              sizes="(max-width: 768px) 100vw, 448px"
            />
            {!isUploading && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Удалить изображение"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            <div className="text-center p-6">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Изображение не загружено
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".webp,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id={`file-input-${modelId}`}
        />
        <label
          htmlFor={`file-input-${modelId}`}
          className={`
            inline-flex items-center px-4 py-2 border border-transparent
            text-sm font-medium rounded-md shadow-sm text-white
            ${
              isUploading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Загрузка...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {previewUrl ? 'Заменить изображение' : 'Загрузить изображение'}
            </>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Форматы: .webp, .png, .jpg • Максимум 5 МБ
      </p>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить изображение?</DialogTitle>
            <DialogDescription>
              Это действие нельзя отменить. Изображение будет удалено из хранилища.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Отмена
            </button>
            <button
              onClick={handleRemoveImage}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Удалить
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
