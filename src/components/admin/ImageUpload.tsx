'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { uploadModelImage } from '@/app/actions/upload-image'
import Image from 'next/image'

interface ImageUploadProps {
  modelSlug: string
  currentImageUrl?: string | null
  onImageUrlChange: (url: string | null) => void
  disabled?: boolean
}

export function ImageUpload({
  modelSlug,
  currentImageUrl,
  onImageUrlChange,
  disabled = false
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Clear previous error
    setError(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Файл должен быть изображением')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Размер файла не должен превышать 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Supabase Storage
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const result = await uploadModelImage(formData, modelSlug)

      if (result.success && result.publicUrl) {
        onImageUrlChange(result.publicUrl)
        setError(null)
      } else {
        setError(result.error || 'Ошибка загрузки')
        setPreview(currentImageUrl || null)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Произошла ошибка при загрузке')
      setPreview(currentImageUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onImageUrlChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Изображение модели
      </label>

      <div className="flex items-start gap-4">
        {/* Preview or Upload Area */}
        <div
          className={`relative flex items-center justify-center w-40 h-40 border-2 border-dashed rounded-lg overflow-hidden ${
            disabled || isUploading
              ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
              : 'bg-white border-gray-300 cursor-pointer hover:border-gray-400'
          }`}
          onClick={handleClick}
        >
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              {!disabled && !isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove()
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Удалить изображение"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 p-4">
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p className="text-xs text-center">
                    Нажмите для загрузки
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Info and Input */}
        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleClick}
            disabled={disabled || isUploading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Загрузка...' : 'Выбрать файл'}
          </button>

          <p className="text-xs text-gray-500">
            PNG, JPG, WEBP до 5MB
          </p>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          {preview && !error && (
            <p className="text-sm text-green-600">
              ✓ Изображение загружено
            </p>
          )}
        </div>
      </div>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name="image_url"
        value={preview || ''}
      />
    </div>
  )
}
