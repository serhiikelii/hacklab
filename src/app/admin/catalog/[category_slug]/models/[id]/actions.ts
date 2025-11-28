'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logCreate, logUpdate, logDelete } from '@/lib/audit'

// Временный обходной путь для типизации


// ============= Валидация =============

const PriceSchema = z.object({
  service_id: z.string().uuid('Некорректный ID услуги'),
  price: z.coerce
    .number()
    .positive('Цена должна быть положительной')
    .nullable()
    .optional(),
  duration_minutes: z.coerce
    .number()
    .int('Время должно быть целым числом')
    .positive('Время должно быть положительным')
    .nullable()
    .optional(),
  warranty_months: z.coerce
    .number()
    .int('Гарантия должна быть целым числом')
    .positive('Гарантия должна быть положительной')
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
 * Добавить новую цену для модели
 */
export async function addPrice(
  modelId: string,
  categorySlug: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient()

    // Валидация входных данных
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
        message: 'Ошибка валидации',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { service_id, price, duration_minutes, warranty_months } = validatedFields.data

    // Проверить, существует ли уже цена для этой услуги
    const { data: existingPrice } = await supabase
      .from('prices')
      .select('id')
      .eq('model_id', modelId)
      .eq('service_id', service_id)
      .single()

    if (existingPrice) {
      return {
        success: false,
        message: 'Цена для этой услуги уже существует',
      }
    }

    // Создать новую цену
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
      console.error('Error adding price:', error)
      return {
        success: false,
        message: 'Ошибка при добавлении цены',
      }
    }

    // Логирование
    await logCreate('prices', newPrice.id, newPriceData)

    revalidatePath(`/admin/catalog/${categorySlug}/models/${modelId}`)

    return {
      success: true,
      message: 'Цена успешно добавлена',
    }
  } catch (error) {
    console.error('Unexpected error in addPrice:', error)
    return {
      success: false,
      message: 'Непредвиденная ошибка',
    }
  }
}

/**
 * Обновить существующую цену
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

    // Валидация входных данных
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
        message: 'Ошибка валидации',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { price, duration_minutes, warranty_months } = validatedFields.data

    // Получить старые данные для аудита
    const { data: oldPrice } = await supabase
      .from('prices')
      .select('*')
      .eq('id', priceId)
      .single()

    // Обновить цену
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
        message: 'Ошибка при обновлении цены',
      }
    }

    // Логирование
    if (oldPrice) {
      await logUpdate('prices', priceId, oldPrice, newPriceData)
    }

    revalidatePath(`/admin/catalog/${categorySlug}/models/${modelId}`)

    return {
      success: true,
      message: 'Цена успешно обновлена',
    }
  } catch (error) {
    console.error('Unexpected error in updatePrice:', error)
    return {
      success: false,
      message: 'Непредвиденная ошибка',
    }
  }
}

/**
 * Удалить цену
 */
export async function deletePrice(
  priceId: string,
  modelId: string,
  categorySlug: string
): Promise<ActionState> {
  try {
    const supabase = await createClient()

    // Получить данные для аудита перед удалением
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
        message: 'Ошибка при удалении цены',
      }
    }

    // Логирование
    if (oldPrice) {
      await logDelete('prices', priceId, oldPrice)
    }

    revalidatePath(`/admin/catalog/${categorySlug}/models/${modelId}`)

    return {
      success: true,
      message: 'Цена успешно удалена',
    }
  } catch (error) {
    console.error('Unexpected error in deletePrice:', error)
    return {
      success: false,
      message: 'Непредвиденная ошибка',
    }
  }
}

/**
 * Получить активные услуги для категории модели
 */
export async function getActiveServicesForModel(modelId: string) {
  try {
    const supabase = await createClient()

    // Получить категорию модели
    const { data: model } = await supabase
      .from('device_models')
      .select('category_id')
      .eq('id', modelId)
      .single()

    if (!model) {
      return []
    }

    // Получить активные услуги для этой категории через category_services
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
        // Сортировка: main услуги первыми
        if (a.service_type === 'main' && b.service_type !== 'main') return -1
        if (a.service_type !== 'main' && b.service_type === 'main') return 1
        return a.name_ru.localeCompare(b.name_ru)
      })
  } catch (error) {
    console.error('Unexpected error in getActiveServicesForModel:', error)
    return []
  }
}
