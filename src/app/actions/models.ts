'use server'

import { z } from 'zod'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// Zod schema for device model validation
const DeviceModelSchema = z.object({
  category_id: z.string().min(1, 'Select a category'),
  name: z
    .string()
    .min(2, 'Name must contain at least 2 characters')
    .max(100, 'Name is too long'),
  slug: z
    .string()
    .min(2, 'Slug must contain at least 2 characters')
    .max(100, 'Slug is too long')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug can only contain lowercase letters, numbers and hyphens'
    ),
  series: z.string().max(100, 'Series is too long').optional().nullable(),
  release_year: z
    .number()
    .int()
    .min(2000, 'Year must be no less than 2000')
    .max(2030, 'Year must be no greater than 2030')
    .optional()
    .nullable(),
  image_url: z.string().url('Invalid URL format').optional().nullable().or(z.literal('')),
})

export type FormState = {
  errors?: {
    category_id?: string
    name?: string
    slug?: string
    series?: string
    release_year?: string
    image_url?: string
  }
  message?: string
  success?: boolean
}

export async function createDeviceModel(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Create Supabase client with cookies for authenticated operations
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
      message: 'Authentication required',
      success: false,
    }
  }

  // Parse and validate form data
  const rawFormData = {
    category_id: formData.get('category_id') as string,
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    series: formData.get('series') as string | null,
    release_year: formData.get('release_year')
      ? parseInt(formData.get('release_year') as string)
      : null,
    image_url: formData.get('image_url') as string | null,
  }

  console.log('📋 Raw FormData received:', rawFormData)

  // Validate form fields
  const validatedFields = DeviceModelSchema.safeParse(rawFormData)

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as any,
      message: 'Check field validation',
      success: false,
    }
  }

  const data = validatedFields.data

  try {
    // 1. Get category UUID by slug
    const { data: categoryData, error: categoryError } = await supabase
      .from('device_categories')
      .select('id')
      .eq('slug', data.category_id)
      .single()

    if (categoryError || !categoryData) {
      return {
        message: 'Category not found',
        success: false,
      }
    }

    const categoryUUID = categoryData.id

    // 2. Check if slug already exists
    const { data: existingModel } = await supabase
      .from('device_models')
      .select('id')
      .eq('slug', data.slug)
      .single()

    if (existingModel) {
      return {
        errors: {
          slug: 'Model with this slug already exists',
        },
        message: 'Slug должен быть уникальным',
        success: false,
      }
    }

    // 3. Insert new device model
    const { data: newModel, error: insertError } = await supabase
      .from('device_models')
      .insert({
        category_id: categoryUUID,
        name: data.name,
        slug: data.slug,
        series: data.series || null,
        release_year: data.release_year || null,
        image_url: data.image_url || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return {
        message: `Model creation error: ${insertError.message}`,
        success: false,
      }
    }

    // 4. Get all services for this category
    const { data: categoryServices, error: servicesError } = await supabase
      .from('category_services')
      .select('service_id')
      .eq('category_id', categoryUUID)

    if (servicesError) {
      console.error('Services error:', servicesError)
      // Continue anyway, prices can be added later
    }

    // 5. Create default prices for all category services
    if (categoryServices && categoryServices.length > 0) {
      const pricesData = categoryServices.map((cs) => ({
        model_id: newModel.id,
        service_id: cs.service_id,
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
        // Continue anyway, model is created
      }
    }

    // 6. Revalidate relevant pages
    revalidatePath('/admin/models')
    revalidatePath(`/pricelist/${data.category_id}`)

    // 7. Return success (redirect happens on client side)
    return {
      message: 'Model created successfully',
      success: true,
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      message: 'An unexpected error occurred',
      success: false,
    }
  }
}

export async function updateDeviceModel(
  modelId: string,
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
      message: 'Authentication required',
      success: false,
    }
  }

  const rawFormData = {
    category_id: formData.get('category_id') as string,
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    series: formData.get('series') as string | null,
    release_year: formData.get('release_year')
      ? parseInt(formData.get('release_year') as string)
      : null,
    image_url: formData.get('image_url') as string | null,
  }

  console.log('=== UPDATE MODEL DEBUG ===')
  console.log('modelId:', modelId)
  console.log('rawFormData:', rawFormData)

  const validatedFields = DeviceModelSchema.safeParse(rawFormData)

  console.log('validation success:', validatedFields.success)
  if (!validatedFields.success) {
    console.log('validation errors:', validatedFields.error.flatten())
  }

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as any,
      message: 'Check field validation',
      success: false,
    }
  }

  const data = validatedFields.data

  try {
    // category_id is already a UUID from the form, no need to look it up
    const categoryUUID = data.category_id

    // Check if slug exists for other models
    const { data: existingModel } = await supabase
      .from('device_models')
      .select('id')
      .eq('slug', data.slug)
      .neq('id', modelId)
      .single()

    if (existingModel) {
      return {
        errors: {
          slug: 'Model with this slug already exists',
        },
        success: false,
      }
    }

    // Update model
    const { error: updateError } = await supabase
      .from('device_models')
      .update({
        category_id: categoryUUID,
        name: data.name,
        slug: data.slug,
        series: data.series || null,
        release_year: data.release_year || null,
        image_url: data.image_url || null,
      })
      .eq('id', modelId)

    if (updateError) {
      console.error('Update error:', updateError)
      return {
        message: `Update error: ${updateError.message}`,
        success: false,
      }
    }

    revalidatePath('/admin/models')
    revalidatePath(`/admin/models/${modelId}/edit`)

    return {
      message: 'Model updated successfully',
      success: true,
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      message: 'An unexpected error occurred',
      success: false,
    }
  }
}

export async function deleteDeviceModel(modelId: string): Promise<{ success: boolean; error?: string }> {
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
      error: 'Authentication required',
    }
  }

  try {
    // Delete model (cascade will delete related prices)
    const { error: deleteError } = await supabase
      .from('device_models')
      .delete()
      .eq('id', modelId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return {
        success: false,
        error: `Delete error: ${deleteError.message}`,
      }
    }

    // Revalidate pages
    revalidatePath('/admin/models')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Unexpected error during delete:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during deletion',
    }
  }
}
