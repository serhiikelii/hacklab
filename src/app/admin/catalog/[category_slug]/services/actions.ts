'use server'

import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { logCreate, logUpdate } from '@/lib/audit'

// Временный обходной путь для типизации


// Схема валидации для создания услуги
const createServiceSchema = z.object({
  name_ru: z.string().min(1, 'Название (RU) обязательно'),
  name_en: z.string().min(1, 'Название (EN) обязательно'),
  name_cz: z.string().min(1, 'Название (CZ) обязательно'),
  service_type: z.enum(['main', 'extra']), // Fixed: lowercase to match DB enum
  order: z.string().transform((val) => parseInt(val, 10)),
  category_id: z.string().uuid(),
})

export async function createService(formData: FormData) {
  try {
    const supabase = await createClient()

    const validatedData = createServiceSchema.parse({
      name_ru: formData.get('name_ru'),
      name_en: formData.get('name_en'),
      name_cz: formData.get('name_cz'),
      service_type: formData.get('service_type'),
      order: formData.get('order'),
      category_id: formData.get('category_id'),
    })

    // 1. Создать или найти услугу в таблице services
    const { data: existingService } = await supabase
      .from('services')
      .select('id')
      .eq('name_ru', validatedData.name_ru)
      .single()

    let serviceId: string

    if (existingService) {
      serviceId = existingService.id
    } else {
      // Создать новую услугу
      const { data: newService, error: serviceError } = await supabase
        .from('services')
        .insert({
          name_ru: validatedData.name_ru,
          name_en: validatedData.name_en,
          name_cz: validatedData.name_cz,
          service_type: validatedData.service_type, // Fixed: save service_type template
          order: validatedData.order, // Fixed: save order template
        })
        .select()
        .single()

      if (serviceError || !newService) {
        return { success: false, error: 'Ошибка создания услуги' }
      }

      serviceId = newService.id
    }

    // 2. Создать связь в category_services
    const categoryServiceData = {
      category_id: validatedData.category_id,
      service_id: serviceId,
      order: validatedData.order, // Fixed: added order field
      is_active: true,
      // Note: service_type is stored in services table, not here
    }

    const { data: newCategoryService, error: linkError } = await supabase
      .from('category_services')
      .insert(categoryServiceData)
      .select()
      .single()

    if (linkError) {
      return { success: false, error: 'Услуга уже добавлена в категорию' }
    }

    // Логирование
    await logCreate(
      'category_services',
      newCategoryService.id,
      categoryServiceData
    )

    // Ревалидация
    const { data: category } = await supabase
      .from('device_categories')
      .select('slug')
      .eq('id', validatedData.category_id)
      .single()

    if (category) {
      revalidatePath(`/admin/catalog/${category.slug}/services`)
    }

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(', '),
      }
    }
    return { success: false, error: 'Неизвестная ошибка' }
  }
}

// Toggle is_active для услуги
export async function toggleServiceActive(
  categoryServiceId: string,
  categorySlug: string
) {
  try {
    const supabase = await createClient()

    // Получить текущее значение is_active
    const { data: current } = await supabase
      .from('category_services')
      .select('*')
      .eq('id', categoryServiceId)
      .single()

    if (!current) {
      return { success: false, error: 'Запись не найдена' }
    }

    const newActiveState = !current.is_active

    // Переключить значение
    const { error } = await supabase
      .from('category_services')
      .update({ is_active: newActiveState })
      .eq('id', categoryServiceId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Логирование
    await logUpdate(
      'category_services',
      categoryServiceId,
      { is_active: current.is_active },
      { is_active: newActiveState }
    )

    revalidatePath(`/admin/catalog/${categorySlug}/services`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Ошибка переключения статуса' }
  }
}

// Получить максимальный order для услуг категории
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
      return { success: false, error: 'Запись не найдена' }
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
    return { success: false, error: 'Ошибка обновления порядка' }
  }
}
