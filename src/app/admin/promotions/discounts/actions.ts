'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { logCreate, logDelete, logUpdate } from '@/lib/audit'
import type { Discount, DiscountType } from '@/types/pricelist'

interface CategoryServiceWithNames {
  id: string
  category_id: string
  service_id: string
  category_name: string
  service_name: string
}

/**
 * Get all category_services with category and service names
 * Used for multi-select in discount form
 */
export async function getCategoryServices(): Promise<CategoryServiceWithNames[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('category_services')
      .select(`
        id,
        category_id,
        service_id,
        device_categories(name_en),
        services(name_en)
      `)
      .order('category_id')

    if (error) {
      console.error('Error fetching category_services:', error)
      return []
    }

    // Transform data to flat structure
    return (data || []).map((item: any) => ({
      id: item.id,
      category_id: item.category_id,
      service_id: item.service_id,
      category_name: item.device_categories?.name_en || 'Unknown',
      service_name: item.services?.name_en || 'Unknown',
    }))
  } catch (error) {
    console.error('Error in getCategoryServices:', error)
    return []
  }
}

/**
 * Get all discounts
 */
export async function getDiscounts(): Promise<Discount[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching discounts:', error)
      return []
    }

    return (data || []) as Discount[]
  } catch (error) {
    console.error('Error in getDiscounts:', error)
    return []
  }
}

/**
 * Get category_service IDs linked to a discount
 */
export async function getDiscountCategoryServices(
  discountId: string
): Promise<string[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('discount_category_services')
      .select('category_service_id')
      .eq('discount_id', discountId)

    if (error) {
      console.error('Error fetching discount_category_services:', error)
      return []
    }

    return (data || []).map((item) => item.category_service_id)
  } catch (error) {
    console.error('Error in getDiscountCategoryServices:', error)
    return []
  }
}

interface CreateDiscountData {
  name_ru: string
  name_en: string
  name_cz: string
  discount_type: DiscountType
  value: number
  conditions_ru?: string
  conditions_en?: string
  conditions_cz?: string
  start_date?: string | null
  end_date?: string | null
  display_badge: boolean
  active: boolean
  category_service_ids?: string[]
  // Removed: is_auto_apply (all discounts are now automatic - migration 007)
}

/**
 * Create a new discount
 */
export async function createDiscount(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Parse form data
    const data: CreateDiscountData = {
      name_ru: (formData.get('name_ru') as string)?.trim(),
      name_en: (formData.get('name_en') as string)?.trim(),
      name_cz: (formData.get('name_cz') as string)?.trim(),
      discount_type: formData.get('discount_type') as DiscountType,
      value: parseFloat(formData.get('value') as string),
      conditions_ru: (formData.get('conditions_ru') as string)?.trim() || undefined,
      conditions_en: (formData.get('conditions_en') as string)?.trim() || undefined,
      conditions_cz: (formData.get('conditions_cz') as string)?.trim() || undefined,
      start_date: (formData.get('start_date') as string) || undefined,
      end_date: (formData.get('end_date') as string) || undefined,
      display_badge: formData.get('display_badge') === 'true',
      active: formData.get('active') === 'true',
    }

    // Validation
    if (!data.name_ru) {
      return { success: false, error: 'Name (RU) is required' }
    }

    if (!data.discount_type || !['percentage', 'fixed', 'bonus'].includes(data.discount_type)) {
      return { success: false, error: 'Invalid discount type' }
    }

    if (!data.value || data.value <= 0) {
      return { success: false, error: 'Value must be greater than 0' }
    }

    if (data.discount_type === 'percentage' && (data.value < 1 || data.value > 100)) {
      return { success: false, error: 'Percentage must be between 1 and 100' }
    }

    if (data.end_date && data.start_date && data.end_date < data.start_date) {
      return { success: false, error: 'End date must be after start date' }
    }

    // Parse category_service_ids if present
    const categoryServiceIds = formData.get('category_service_ids') as string
    const parsedCategoryServiceIds = categoryServiceIds
      ? categoryServiceIds.split(',').filter((id) => id.trim())
      : []

    // All discounts are automatic, require at least one service
    if (parsedCategoryServiceIds.length === 0) {
      return {
        success: false,
        error: 'At least one service must be selected',
      }
    }

    // Create discount
    const { data: discount, error: discountError } = await supabase
      .from('discounts')
      .insert({
        name_ru: data.name_ru,
        name_en: data.name_en,
        name_cz: data.name_cz,
        discount_type: data.discount_type,
        value: data.value,
        conditions_ru: data.conditions_ru,
        conditions_en: data.conditions_en,
        conditions_cz: data.conditions_cz,
        start_date: data.start_date,
        end_date: data.end_date,
        display_badge: data.display_badge,
        active: data.active,
      })
      .select()
      .single()

    if (discountError) {
      console.error('Error creating discount:', discountError)
      return { success: false, error: 'Failed to create discount' }
    }

    // Link to category_services (always required for all discounts)
    if (parsedCategoryServiceIds.length > 0) {
      const links = parsedCategoryServiceIds.map((csId) => ({
        discount_id: discount.id,
        category_service_id: csId,
      }))

      const { error: linkError } = await supabase
        .from('discount_category_services')
        .insert(links)

      if (linkError) {
        console.error('Error linking discount to services:', linkError)
        // Rollback: delete the discount
        await supabase.from('discounts').delete().eq('id', discount.id)
        return { success: false, error: 'Failed to link discount to services' }
      }
    }

    // Audit log
    await logCreate('discounts', discount.id, data as any)

    revalidatePath('/admin/promotions/discounts')
    return { success: true }
  } catch (error) {
    console.error('Error in createDiscount:', error)
    return { success: false, error: 'Unexpected error' }
  }
}

/**
 * Update an existing discount
 */
export async function updateDiscount(
  discountId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get old data for audit log
    const { data: oldDiscount, error: fetchError } = await supabase
      .from('discounts')
      .select('*')
      .eq('id', discountId)
      .single()

    if (fetchError || !oldDiscount) {
      return { success: false, error: 'Discount not found' }
    }

    // Parse form data
    const data: CreateDiscountData = {
      name_ru: (formData.get('name_ru') as string)?.trim(),
      name_en: (formData.get('name_en') as string)?.trim(),
      name_cz: (formData.get('name_cz') as string)?.trim(),
      discount_type: formData.get('discount_type') as DiscountType,
      value: parseFloat(formData.get('value') as string),
      conditions_ru: (formData.get('conditions_ru') as string)?.trim() || undefined,
      conditions_en: (formData.get('conditions_en') as string)?.trim() || undefined,
      conditions_cz: (formData.get('conditions_cz') as string)?.trim() || undefined,
      start_date: (formData.get('start_date') as string) || undefined,
      end_date: (formData.get('end_date') as string) || undefined,
      display_badge: formData.get('display_badge') === 'true',
      active: formData.get('active') === 'true',
    }

    // Validation (same as create)
    if (!data.name_ru) {
      return { success: false, error: 'Name (RU) is required' }
    }

    if (!data.discount_type || !['percentage', 'fixed', 'bonus'].includes(data.discount_type)) {
      return { success: false, error: 'Invalid discount type' }
    }

    if (!data.value || data.value <= 0) {
      return { success: false, error: 'Value must be greater than 0' }
    }

    if (data.discount_type === 'percentage' && (data.value < 1 || data.value > 100)) {
      return { success: false, error: 'Percentage must be between 1 and 100' }
    }

    if (data.end_date && data.start_date && data.end_date < data.start_date) {
      return { success: false, error: 'End date must be after start date' }
    }

    // Parse category_service_ids if present
    const categoryServiceIds = formData.get('category_service_ids') as string
    const parsedCategoryServiceIds = categoryServiceIds
      ? categoryServiceIds.split(',').filter((id) => id.trim())
      : []

    // All discounts require at least one service
    if (parsedCategoryServiceIds.length === 0) {
      return {
        success: false,
        error: 'Discounts require at least one service',
      }
    }

    // Update discount
    const { error: updateError } = await supabase
      .from('discounts')
      .update({
        name_ru: data.name_ru,
        name_en: data.name_en,
        name_cz: data.name_cz,
        discount_type: data.discount_type,
        value: data.value,
        conditions_ru: data.conditions_ru,
        conditions_en: data.conditions_en,
        conditions_cz: data.conditions_cz,
        start_date: data.start_date,
        end_date: data.end_date,
        display_badge: data.display_badge,
        active: data.active,
      })
      // Note: is_auto_apply removed (migration 007)
      .eq('id', discountId)

    if (updateError) {
      console.error('Error updating discount:', updateError)
      return { success: false, error: 'Failed to update discount' }
    }

    // Update discount_category_services links
    // 1. Delete old links
    await supabase
      .from('discount_category_services')
      .delete()
      .eq('discount_id', discountId)

    // 2. Create new links (always required for all discounts)
    if (parsedCategoryServiceIds.length > 0) {
      const links = parsedCategoryServiceIds.map((csId) => ({
        discount_id: discountId,
        category_service_id: csId,
      }))

      const { error: linkError } = await supabase
        .from('discount_category_services')
        .insert(links)

      if (linkError) {
        console.error('Error linking discount to services:', linkError)
        return { success: false, error: 'Failed to link discount to services' }
      }
    }

    // Audit log
    await logUpdate('discounts', discountId, oldDiscount, data as any)

    revalidatePath('/admin/promotions/discounts')
    return { success: true }
  } catch (error) {
    console.error('Error in updateDiscount:', error)
    return { success: false, error: 'Unexpected error' }
  }
}

/**
 * Delete a discount
 */
export async function deleteDiscount(
  discountId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get discount data for audit log
    const { data: discount, error: fetchError } = await supabase
      .from('discounts')
      .select('*')
      .eq('id', discountId)
      .single()

    if (fetchError || !discount) {
      return { success: false, error: 'Discount not found' }
    }

    // Delete discount (cascade will delete discount_category_services)
    const { error: deleteError } = await supabase
      .from('discounts')
      .delete()
      .eq('id', discountId)

    if (deleteError) {
      console.error('Error deleting discount:', deleteError)
      return { success: false, error: 'Failed to delete discount' }
    }

    // Audit log
    await logDelete('discounts', discountId, discount)

    revalidatePath('/admin/promotions/discounts')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteDiscount:', error)
    return { success: false, error: 'Unexpected error' }
  }
}
