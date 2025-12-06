'use server'

import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { logCreate, logUpdate } from '@/lib/audit'

// Temporary workaround for typing

// Generate slug from English name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
}


// Validation schema for creating a service
const createServiceSchema = z.object({
  name_ru: z.string().min(1, 'Name (RU) is required'),
  name_en: z.string().min(1, 'Name (EN) is required'),
  name_cz: z.string().min(1, 'Name (CZ) is required'),
  service_type: z.enum(['main', 'extra']), // Fixed: lowercase to match DB enum
  order: z.string().transform((val) => parseInt(val, 10)),
  category_id: z.string().uuid(),
})

export async function createService(formData: FormData) {
  try {
    const supabase = await createClient()

    const rawData = {
      name_ru: formData.get('name_ru'),
      name_en: formData.get('name_en'),
      name_cz: formData.get('name_cz'),
      service_type: formData.get('service_type'),
      order: formData.get('order'),
      category_id: formData.get('category_id'),
    }

    console.error('[DEBUG] createService - Raw form data:', rawData)

    const validatedData = createServiceSchema.parse(rawData)
    console.error('[DEBUG] createService - Validated data:', validatedData)

    // 1. Create or find service in services table
    const { data: existingService, error: findError } = await supabase
      .from('services')
      .select('id')
      .eq('name_ru', validatedData.name_ru)
      .maybeSingle()

    if (findError) {
      console.error('[ERROR] createService - Error finding existing service:', findError)
    }

    let serviceId: string

    if (existingService) {
      console.error('[DEBUG] createService - Found existing service:', existingService.id)
      serviceId = existingService.id
    } else {
      console.error('[DEBUG] createService - Creating new service...')
      // Create new service
      const slug = generateSlug(validatedData.name_en)
      console.error('[DEBUG] createService - Generated slug:', slug)

      const { data: newService, error: serviceError } = await supabase
        .from('services')
        .insert({
          name_ru: validatedData.name_ru,
          name_en: validatedData.name_en,
          name_cz: validatedData.name_cz,
          slug: slug,
          service_type: validatedData.service_type, // Fixed: save service_type template
          order: validatedData.order, // Fixed: save order template
        })
        .select()
        .single()

      if (serviceError || !newService) {
        console.error('[ERROR] createService - Error creating service:', serviceError)
        return { success: false, error: `Error creating service: ${serviceError?.message || 'Unknown'}` }
      }

      console.error('[DEBUG] createService - New service created:', newService)
      serviceId = newService.id
    }

    // 2. Create link in category_services
    const categoryServiceData = {
      category_id: validatedData.category_id,
      service_id: serviceId,
      order: validatedData.order, // Fixed: added order field
      is_active: true,
      // Note: service_type is stored in services table, not here
    }

    console.error('[DEBUG] createService - Creating category_services link:', categoryServiceData)

    const { data: newCategoryService, error: linkError } = await supabase
      .from('category_services')
      .insert(categoryServiceData)
      .select()
      .single()

    if (linkError) {
      console.error('[ERROR] createService - Error creating category_services link:', linkError)
      return { success: false, error: `Error linking service: ${linkError.message}` }
    }

    console.error('[DEBUG] createService - Category service link created:', newCategoryService)

    // Audit logging
    await logCreate(
      'category_services',
      newCategoryService.id,
      categoryServiceData
    )

    // Revalidation
    const { data: category } = await supabase
      .from('device_categories')
      .select('slug')
      .eq('id', validatedData.category_id)
      .single()

    if (category) {
      revalidatePath(`/admin/catalog/${category.slug}/services`)
    }

    console.error('[DEBUG] createService - Success!')
    return { success: true }
  } catch (error) {
    console.error('[ERROR] createService - Unexpected error:', error)
    if (error instanceof z.ZodError) {
      console.error('[ERROR] createService - Validation errors:', error.errors)
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(', '),
      }
    }
    return { success: false, error: `Unknown error: ${error}` }
  }
}

// Toggle is_active for service
export async function toggleServiceActive(
  categoryServiceId: string,
  categorySlug: string
) {
  try {
    const supabase = await createClient()

    // Get current is_active value
    const { data: current } = await supabase
      .from('category_services')
      .select('*')
      .eq('id', categoryServiceId)
      .single()

    if (!current) {
      return { success: false, error: 'Record not found' }
    }

    const newActiveState = !current.is_active

    // Toggle value
    const { error } = await supabase
      .from('category_services')
      .update({ is_active: newActiveState })
      .eq('id', categoryServiceId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Audit logging
    await logUpdate(
      'category_services',
      categoryServiceId,
      { is_active: current.is_active },
      { is_active: newActiveState }
    )

    revalidatePath(`/admin/catalog/${categorySlug}/services`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error toggling status' }
  }
}

// Get maximum order for category services
export async function getMaxServiceOrder(categoryId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('category_services')
    .select('order')
    .eq('category_id', categoryId)
    .order('order', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return 0
  }

  return data.order
}

// Update service order (for drag-and-drop reordering)
export async function updateServiceOrder(
  categoryServiceId: string,
  newOrder: number,
  categorySlug: string
) {
  try {
    const supabase = await createClient()

    // Get current data for audit log
    const { data: current } = await supabase
      .from('category_services')
      .select('*')
      .eq('id', categoryServiceId)
      .single()

    if (!current) {
      return { success: false, error: 'Record not found' }
    }

    // Update order
    const { error } = await supabase
      .from('category_services')
      .update({ order: newOrder })
      .eq('id', categoryServiceId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Audit log
    await logUpdate(
      'category_services',
      categoryServiceId,
      { order: current.order },
      { order: newOrder }
    )

    revalidatePath(`/admin/catalog/${categorySlug}/services`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error updating order' }
  }
}
