'use server'

import { z } from 'zod'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Zod schema for service validation
const ServiceSchema = z.object({
  slug: z.string().min(2, 'Slug должен содержать минимум 2 символа'),
  name_en: z.string().min(2, 'Название (EN) обязательно'),
  name_ru: z.string().min(2, 'Название (RU) обязательно'),
  name_cz: z.string().min(2, 'Название (CZ) обязательно'),
  description_ru: z.string().optional().nullable(),
  description_en: z.string().optional().nullable(),
  description_cz: z.string().optional().nullable(),
  service_type: z.enum(['main', 'extra'], {
    errorMap: () => ({ message: 'Выберите тип услуги' }),
  }),
  order: z.number().int().min(0).optional().nullable(),
  category_id: z.string().uuid('Категория не выбрана'),
})

export type FormState = {
  errors?: {
    slug?: string
    name_en?: string
    name_ru?: string
    name_cz?: string
    service_type?: string
    order?: string
    category_id?: string
  }
  message?: string
  success?: boolean
}

export async function createService(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      message: 'Необходима авторизация',
      success: false,
    }
  }

  // Parse form data
  const rawFormData = {
    slug: formData.get('slug') as string,
    name_en: formData.get('name_en') as string,
    name_ru: formData.get('name_ru') as string,
    name_cz: formData.get('name_cz') as string,
    description_ru: (formData.get('description_ru') as string) || null,
    description_en: (formData.get('description_en') as string) || null,
    description_cz: (formData.get('description_cz') as string) || null,
    service_type: formData.get('service_type') as 'main' | 'extra',
    order: formData.get('order')
      ? parseInt(formData.get('order') as string)
      : null,
    category_id: formData.get('category_id') as string,
  }

  // Validate
  const validatedFields = ServiceSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as any,
      message: 'Проверьте правильность заполнения полей',
      success: false,
    }
  }

  const data = validatedFields.data

  try {
    // 1. Check if slug already exists
    const { data: existingService } = await supabase
      .from('services')
      .select('id')
      .eq('slug', data.slug)
      .single()

    if (existingService) {
      return {
        errors: {
          slug: 'Услуга с таким slug уже существует',
        },
        message: 'Slug должен быть уникальным',
        success: false,
      }
    }

    // 2. Create service
    const { data: newService, error: insertError } = await supabase
      .from('services')
      .insert({
        slug: data.slug,
        name_ru: data.name_ru,
        name_en: data.name_en,
        name_cz: data.name_cz,
        description_ru: data.description_ru,
        description_en: data.description_en,
        description_cz: data.description_cz,
        service_type: data.service_type,
        order: data.order || 0,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return {
        message: `Ошибка создания услуги: ${insertError.message}`,
        success: false,
      }
    }

    // 3. Create category_services link
    const { error: csError } = await supabase
      .from('category_services')
      .insert({
        service_id: newService.id,
        category_id: data.category_id,
      })

    if (csError) {
      console.error('Category services error:', csError)
      // Rollback service creation
      await supabase.from('services').delete().eq('id', newService.id)
      return {
        message: `Ошибка связывания с категорией: ${csError.message}`,
        success: false,
      }
    }

    // 4. Get all models from category
    const { data: models, error: modelsError } = await supabase
      .from('device_models')
      .select('id')
      .eq('category_id', data.category_id)

    if (modelsError) {
      console.error('Models error:', modelsError)
      // Continue anyway
    }

    // 5. Create prices for all models
    if (models && models.length > 0) {
      const pricesData = models.map((model) => ({
        model_id: model.id,
        service_id: newService.id,
        price: null,
        price_type: 'on_request' as const,
        duration_minutes: null,
        warranty_months: 24,
      }))

      const { error: pricesError } = await supabase
        .from('prices')
        .insert(pricesData)

      if (pricesError) {
        console.error('Prices creation error:', pricesError)
        // Continue anyway
      }
    }

    revalidatePath('/admin/services')
    redirect('/admin/services')
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      message: 'Произошла непредвиденная ошибка',
      success: false,
    }
  }
}

export async function deleteService(serviceId: string): Promise<{ success: boolean; error?: string }> {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: 'Необходима авторизация',
    }
  }

  try {
    // Delete service (cascade will delete related prices and category_services)
    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return {
        success: false,
        error: `Ошибка удаления: ${deleteError.message}`,
      }
    }

    revalidatePath('/admin/services')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Unexpected error during delete:', error)
    return {
      success: false,
      error: 'Произошла непредвиденная ошибка при удалении',
    }
  }
}
