'use server'

import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { logAuditEvent } from '@/lib/audit'

const BUCKET_NAME = 'device-images'

export type ImageActionResult = {
  success: boolean
  imageUrl?: string
  error?: string
}

/**
 * Upload model image to Supabase Storage and update database
 * Uses authenticated Supabase client for DB operations with proper audit logging
 */
export async function uploadModelImage(
  modelId: string,
  categorySlug: string,
  file: File
): Promise<ImageActionResult> {
  try {
    console.log('[uploadModelImage] START:', { modelId, categorySlug, fileName: file.name })

    // 1. Validate file
    const allowedTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Only .webp, .png, .jpg file formats are allowed'
      }
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must not exceed 5 MB'
      }
    }

    // 2. Create authenticated Supabase client (with cookies for user session)
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    // 3. Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[uploadModelImage] Not authenticated:', authError?.message)
      return {
        success: false,
        error: 'Authentication required'
      }
    }

    console.log('[uploadModelImage] Authenticated user:', user.email)

    // 4. Get model info (including slug for file naming)
    const { data: model, error: modelError } = await supabase
      .from('device_models')
      .select('id, name, slug, image_url')
      .eq('id', modelId)
      .single()

    if (modelError || !model) {
      console.error('[uploadModelImage] Model not found:', modelError)
      return {
        success: false,
        error: 'Model not found'
      }
    }

    // 5. Create admin client for Storage operations (SERVICE_ROLE_KEY needed for storage)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // 6. Delete old image if exists
    if (model.image_url) {
      const oldPath = model.image_url.split('/').pop()
      if (oldPath) {
        console.log('[uploadModelImage] Deleting old image:', `${categorySlug}/${oldPath}`)
        await supabaseAdmin.storage
          .from(BUCKET_NAME)
          .remove([`${categorySlug}/${oldPath}`])
      }
    }

    // 7. Generate filename based on slug (for SEO and readability)
    const fileExt = file.name.split('.').pop()
    const fileName = `${model.slug}.${fileExt}`
    const filePath = `${categorySlug}/${fileName}`

    console.log('[uploadModelImage] Uploading:', filePath)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('[uploadModelImage] Upload error:', uploadError)
      return {
        success: false,
        error: `Upload error: ${uploadError.message}`
      }
    }

    // 8. Get public URL with cache-busting parameter
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    const imageUrlWithCacheBust = `${urlData.publicUrl}?v=${Date.now()}`

    console.log('[uploadModelImage] Image uploaded:', imageUrlWithCacheBust)

    // 9. Update database using AUTHENTICATED client (this is the key point!)
    const { error: updateError } = await supabase
      .from('device_models')
      .update({ image_url: imageUrlWithCacheBust })
      .eq('id', modelId)

    if (updateError) {
      console.error('[uploadModelImage] DB update error:', updateError)
      return {
        success: false,
        error: `Database update error: ${updateError.message}`
      }
    }

    console.log('[uploadModelImage] DB updated successfully')

    // 10. Audit log
    const { getCurrentAdminId } = await import('@/lib/audit')
    const adminId = await getCurrentAdminId()

    if (adminId) {
      await logAuditEvent({
        adminId,
        action: 'UPLOAD',
        tableName: 'device_images',
        recordId: modelId,
        newData: {
          image_url: imageUrlWithCacheBust,
          file_path: filePath,
          model_name: model.name
        },
      })
      console.log('[uploadModelImage] Audit log written')
    } else {
      console.warn('[uploadModelImage] Could not get adminId for audit log')
    }

    return {
      success: true,
      imageUrl: imageUrlWithCacheBust
    }
  } catch (error) {
    console.error('[uploadModelImage] Exception:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }
  }
}

/**
 * Remove model image from Supabase Storage and update database
 */
export async function removeModelImage(
  modelId: string
): Promise<ImageActionResult> {
  try {
    console.log('[removeModelImage] START:', { modelId })

    // 1. Create authenticated Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    // 2. Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[removeModelImage] Not authenticated:', authError?.message)
      return {
        success: false,
        error: 'Authentication required'
      }
    }

    // 3. Get model info
    const { data: model, error: modelError } = await supabase
      .from('device_models')
      .select('id, name, image_url, category_id, device_categories(slug)')
      .eq('id', modelId)
      .single()

    if (modelError || !model) {
      console.error('[removeModelImage] Model not found:', modelError)
      return {
        success: false,
        error: 'Model not found'
      }
    }

    if (!model.image_url) {
      return {
        success: true, // Already no image
        error: 'Image already absent'
      }
    }

    // 4. Create admin client for Storage
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // 5. Get category slug
    const categorySlug = (model.device_categories as any)?.slug

    if (!categorySlug) {
      return {
        success: false,
        error: 'Category not found'
      }
    }

    // 6. Extract filename and delete from storage
    const fileName = model.image_url.split('/').pop()
    if (fileName) {
      const filePath = `${categorySlug}/${fileName}`
      console.log('[removeModelImage] Deleting:', filePath)

      const { error: deleteError } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([filePath])

      if (deleteError) {
        console.error('[removeModelImage] Storage delete error:', deleteError)
        // Continue even if storage deletion failed
      }
    }

    // 7. Update database using AUTHENTICATED client
    const { error: updateError } = await supabase
      .from('device_models')
      .update({ image_url: null })
      .eq('id', modelId)

    if (updateError) {
      console.error('[removeModelImage] DB update error:', updateError)
      return {
        success: false,
        error: `Database update error: ${updateError.message}`
      }
    }

    console.log('[removeModelImage] DB updated successfully')

    // 8. Audit log
    const { getCurrentAdminId } = await import('@/lib/audit')
    const adminId = await getCurrentAdminId()

    if (adminId) {
      await logAuditEvent({
        adminId,
        action: 'REMOVE',
        tableName: 'device_images',
        recordId: modelId,
        oldData: {
          image_url: model.image_url,
          file_path: `${categorySlug}/${fileName}`,
          model_name: model.name
        },
      })
      console.log('[removeModelImage] Audit log written')
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('[removeModelImage] Exception:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }
  }
}
