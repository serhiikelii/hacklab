'use server'

import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { logCreate, logUpdate } from '@/lib/audit'

// Generate slug from English name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
}


// Get available services for a category (services not yet added to category)
export async function getAvailableServicesForCategory(categoryId: string) {
  const supabase = await createClient()

  // Get all services
  const { data: allServices } = await supabase
    .from('services')
    .select('*')
    .order('order', { ascending: true })

  if (!allServices) {
    return []
  }

  // Get services already in this category
  const { data: categoryServices } = await supabase
    .from('category_services')
    .select('service_id')
    .eq('category_id', categoryId)

  const usedServiceIds = new Set(categoryServices?.map((cs) => cs.service_id) || [])

  // Filter out services already in category
  return allServices.filter((service) => !usedServiceIds.has(service.id))
}

// Add service(s) to category
export async function addServiceToCategory(
  categoryId: string,
  serviceIds: string[],
  categorySlug: string
) {
  try {
    const supabase = await createClient()

    // Get max order for this category
    const { data: maxOrderData } = await supabase
      .from('category_services')
      .select('order')
      .eq('category_id', categoryId)
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle()

    let currentOrder = maxOrderData?.order || 0

    // Add each service to category
    for (const serviceId of serviceIds) {
      currentOrder += 10

      const categoryServiceData = {
        category_id: categoryId,
        service_id: serviceId,
        order: currentOrder,
        is_active: true,
      }

      const { data: newCategoryService, error: linkError } = await supabase
        .from('category_services')
        .insert(categoryServiceData)
        .select()
        .single()

      if (linkError) {
        console.error('[ERROR] addServiceToCategory - Error creating link:', linkError)
        return { success: false, error: `Error linking service: ${linkError.message}` }
      }

      // Audit logging
      await logCreate('category_services', newCategoryService.id, categoryServiceData)
    }

    // Revalidation
    revalidatePath(`/admin/catalog/${categorySlug}/services`)

    return { success: true }
  } catch (error) {
    console.error('[ERROR] addServiceToCategory - Unexpected error:', error)
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

// Create global service
const createGlobalServiceSchema = z.object({
  name_ru: z.string().min(1, 'Name (RU) is required'),
  name_en: z.string().min(1, 'Name (EN) is required'),
  name_cz: z.string().min(1, 'Name (CZ) is required'),
  service_type: z.enum(['main', 'extra']),
  order: z.string().transform((val) => parseInt(val, 10)),
})

export async function createGlobalService(formData: FormData) {
  try {
    const supabase = await createClient()

    const rawData = {
      name_ru: formData.get('name_ru'),
      name_en: formData.get('name_en'),
      name_cz: formData.get('name_cz'),
      service_type: formData.get('service_type'),
      order: formData.get('order'),
    }

    const validatedData = createGlobalServiceSchema.parse(rawData)

    // Generate slug from English name
    const slug = generateSlug(validatedData.name_en)

    const { data: newService, error: serviceError } = await supabase
      .from('services')
      .insert({
        name_ru: validatedData.name_ru,
        name_en: validatedData.name_en,
        name_cz: validatedData.name_cz,
        slug: slug,
        service_type: validatedData.service_type,
        order: validatedData.order,
      })
      .select()
      .single()

    if (serviceError || !newService) {
      console.error('[ERROR] createGlobalService - Error creating service:', serviceError)
      return { success: false, error: `Error creating service: ${serviceError?.message || 'Unknown'}` }
    }

    // Audit logging
    await logCreate('services', newService.id, {
      name_ru: validatedData.name_ru,
      name_en: validatedData.name_en,
      name_cz: validatedData.name_cz,
      slug: slug,
      service_type: validatedData.service_type,
      order: validatedData.order,
    })

    // Revalidate all category services pages
    revalidatePath('/admin/catalog/[category_slug]/services', 'page')

    return { success: true }
  } catch (error) {
    console.error('[ERROR] createGlobalService - Unexpected error:', error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(', '),
      }
    }
    return { success: false, error: `Unknown error: ${error}` }
  }
}

// Get maximum order for global services
export async function getMaxGlobalServiceOrder() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('order')
    .order('order', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return 0
  }

  return data.order
}
