'use server'

import { createClient } from '@supabase/supabase-js'

const BUCKET_NAME = 'device-images'

export type UploadImageResult = {
  success: boolean
  publicUrl?: string
  error?: string
}

/**
 * Upload image to Supabase Storage
 * @param formData - FormData containing the image file
 * @param modelSlug - Model slug for filename (e.g., 'iphone-15-pro-max')
 * @returns Public URL of uploaded image or error
 */
export async function uploadModelImage(
  formData: FormData,
  modelSlug: string
): Promise<UploadImageResult> {
  try {
    console.log('=== UPLOAD IMAGE DEBUG ===')
    console.log('modelSlug:', modelSlug)
    console.log('formData keys:', Array.from(formData.keys()))

    const file = formData.get('image') as File

    if (!file) {
      console.log('ERROR: No file in formData')
      return {
        success: false,
        error: 'Файл не выбран'
      }
    }

    console.log('file:', { name: file.name, type: file.type, size: file.size })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Файл должен быть изображением'
      }
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'Размер файла не должен превышать 5MB'
      }
    }

    // Create Supabase client with service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Generate filename: model-slug.extension
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${modelSlug}.${extension}`

    // Delete old file if exists (to replace)
    const { data: existingFiles } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        search: modelSlug
      })

    if (existingFiles && existingFiles.length > 0) {
      // Delete all old versions of this model's image
      const filesToDelete = existingFiles.map(f => f.name)
      await supabase.storage
        .from(BUCKET_NAME)
        .remove(filesToDelete)
    }

    // Upload new file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return {
        success: false,
        error: `Ошибка загрузки: ${uploadError.message}`
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    if (!urlData.publicUrl) {
      return {
        success: false,
        error: 'Не удалось получить публичный URL'
      }
    }

    return {
      success: true,
      publicUrl: urlData.publicUrl
    }
  } catch (error) {
    console.error('Unexpected error in uploadModelImage:', error)
    return {
      success: false,
      error: 'Произошла непредвиденная ошибка при загрузке'
    }
  }
}

/**
 * Delete image from Supabase Storage
 * @param imageUrl - Full public URL of the image
 * @returns Success status
 */
export async function deleteModelImage(
  imageUrl: string
): Promise<UploadImageResult> {
  try {
    // Extract filename from URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]

    if (!fileName) {
      return {
        success: false,
        error: 'Неверный URL изображения'
      }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName])

    if (error) {
      console.error('Delete error:', error)
      return {
        success: false,
        error: `Ошибка удаления: ${error.message}`
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Unexpected error in deleteModelImage:', error)
    return {
      success: false,
      error: 'Произошла непредвиденная ошибка при удалении'
    }
  }
}
