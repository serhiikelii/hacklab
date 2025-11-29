'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logCreate, logUpdate, logDelete } from '@/lib/audit'

// Temporary workaround for typing


// ============= Validation =============

const PriceSchema = z.object({
  service_id: z.string().uuid('Invalid service ID'),
  price: z.coerce
    .number()
    .positive('Price must be positive')
    .nullable()
    .optional(),
  duration_minutes: z.coerce
    .number()
    .int('Duration must be an integer')
    .positive('Duration must be positive')
    .nullable()
    .optional(),
  warranty_months: z.coerce
    .number()
    .int('Warranty must be an integer')
    .positive('Warranty must be positive')
    .nullable()
    .optional()
    .default(24),
})

type ActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

// ============= Actions =============

/**
 * Add new price for a model
 */
export async function addPrice(
  modelId: string,
  categorySlug: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient()

    // Validate input data
    const rawData = {
      service_id: formData.get('service_id'),
      price: formData.get('price'),
      duration_minutes: formData.get('duration_minutes'),
      warranty_months: formData.get('warranty_months'),
    }

    const validatedFields = PriceSchema.safeParse(rawData)

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Validation error',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { service_id, price, duration_minutes, warranty_months } = validatedFields.data

    // Check if price already exists for this service
    const { data: existingPrice } = await supabase
      .from('prices')
      .select('id')
      .eq('model_id', modelId)
      .eq('service_id', service_id)
      .single()

    if (existingPrice) {
      return {
        success: false,
        message: 'Price for this service already exists',
      }
    }

    // Create new price
    const newPriceData = {
      model_id: modelId,
      service_id,
      price: price ?? null,
      price_type: 'fixed',
      duration_minutes: duration_minutes ?? null,
      warranty_months: warranty_months ?? 24,
      is_active: true,
    }

    const { data: newPrice, error } = await supabase
      .from('prices')
      .insert(newPriceData)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        message: 'Error adding price',
      }
    }

    // Audit logging
    await logCreate('prices', newPrice.id, newPriceData)

    revalidatePath(`/admin/catalog/${categorySlug}/models/${modelId}`)

    return {
      success: true,
      message: 'Price successfully added',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Unexpected error',
    }
  }
}

/**
 * Update existing price
 */
export async function updatePrice(
  priceId: string,
  modelId: string,
  categorySlug: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient()

    // Validate input data
    const rawData = {
      service_id: formData.get('service_id'),
      price: formData.get('price'),
      duration_minutes: formData.get('duration_minutes'),
      warranty_months: formData.get('warranty_months'),
    }

    const validatedFields = PriceSchema.safeParse(rawData)

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Validation error',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { price, duration_minutes, warranty_months } = validatedFields.data

    // Get old data for audit
    const { data: oldPrice } = await supabase
      .from('prices')
      .select('*')
      .eq('id', priceId)
      .single()

    // Update price
    const newPriceData = {
      price: price ?? null,
      duration_minutes: duration_minutes ?? null,
      warranty_months: warranty_months ?? 24,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('prices')
      .update(newPriceData)
      .eq('id', priceId)

    if (error) {
      console.error('Error updating price:', error)
      return {
        success: false,
        message: 'Error updating price',
      }
    }

    // Audit logging
    if (oldPrice) {
      await logUpdate('prices', priceId, oldPrice, newPriceData)
    }

    revalidatePath(`/admin/catalog/${categorySlug}/models/${modelId}`)

    return {
      success: true,
      message: 'Price successfully updated',
    }
  } catch (error) {
    console.error('Unexpected error in updatePrice:', error)
    return {
      success: false,
      message: 'Unexpected error',
    }
  }
}

/**
 * Delete price
 */
export async function deletePrice(
  priceId: string,
  modelId: string,
  categorySlug: string
): Promise<ActionState> {
  try {
    const supabase = await createClient()

    // Get data for audit before deletion
    const { data: oldPrice } = await supabase
      .from('prices')
      .select('*')
      .eq('id', priceId)
      .single()

    const { error } = await supabase.from('prices').delete().eq('id', priceId)

    if (error) {
      console.error('Error deleting price:', error)
      return {
        success: false,
        message: 'Error deleting price',
      }
    }

    // Audit logging
    if (oldPrice) {
      await logDelete('prices', priceId, oldPrice)
    }

    revalidatePath(`/admin/catalog/${categorySlug}/models/${modelId}`)

    return {
      success: true,
      message: 'Price successfully deleted',
    }
  } catch (error) {
    console.error('Unexpected error in deletePrice:', error)
    return {
      success: false,
      message: 'Unexpected error',
    }
  }
}

/**
 * Get active services for model category
 */
export async function getActiveServicesForModel(modelId: string) {
  try {
    const supabase = await createClient()

    // Get model category
    const { data: model } = await supabase
      .from('device_models')
      .select('category_id')
      .eq('id', modelId)
      .single()

    if (!model) {
      return []
    }

    // Get active services for this category via category_services
    const { data: services, error } = await supabase
      .from('category_services')
      .select(`
        service_id,
        services (
          id,
          name_ru,
          name_en,
          name_cz,
          service_type
        )
      `)
      .eq('category_id', model.category_id)
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching active services:', error)
      return []
    }

    return services
      .map((cs: any) => cs.services)
      .filter(Boolean)
      .sort((a: any, b: any) => {
        // Sort: main services first
        if (a.service_type === 'main' && b.service_type !== 'main') return -1
        if (a.service_type !== 'main' && b.service_type === 'main') return 1
        return a.name_ru.localeCompare(b.name_ru)
      })
  } catch (error) {
    console.error('Unexpected error in getActiveServicesForModel:', error)
    return []
  }
}
