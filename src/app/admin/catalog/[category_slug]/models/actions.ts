'use server'

import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { logCreate, logUpdate } from '@/lib/audit'

// Helper function to generate URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
}

// Validation schema for creating a model
const createModelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  release_year: z.string().transform((val) => parseInt(val, 10)),
  order: z.string().transform((val) => parseInt(val, 10)),
  category_id: z.string().uuid(),
})

export async function createModel(formData: FormData) {
  try {
    // Create authenticated client
    const supabase = await createClient()

    // Validation
    const validatedData = createModelSchema.parse({
      name: formData.get('name'),
      release_year: formData.get('release_year'),
      order: formData.get('order'),
      category_id: formData.get('category_id'),
    })

    // Generate slug from model name
    const slug = generateSlug(validatedData.name)

    // Insert into database
    const modelData = {
      name: validatedData.name,
      slug: slug,
      release_year: validatedData.release_year,
      order: validatedData.order,
      category_id: validatedData.category_id,
    }

    const { data, error } = await supabase
      .from('device_models')
      .insert(modelData)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Audit logging
    await logCreate('device_models', data.id, modelData)

    // Cache revalidation
    const { data: category } = await supabase
      .from('device_categories')
      .select('slug')
      .eq('id', validatedData.category_id)
      .single()

    if (category) {
      revalidatePath(`/admin/catalog/${category.slug}/models`)
    }

    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(', '),
      }
    }
    return { success: false, error: 'Unknown error' }
  }
}

// Validation schema for updating a model
const updateModelSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  release_year: z.string().transform((val) => parseInt(val, 10)),
  order: z.string().transform((val) => parseInt(val, 10)),
  category_slug: z.string(),
})

export async function updateModel(formData: FormData) {
  try {
    // Create authenticated client
    const supabase = await createClient()

    const validatedData = updateModelSchema.parse({
      id: formData.get('id'),
      name: formData.get('name'),
      release_year: formData.get('release_year'),
      order: formData.get('order'),
      category_slug: formData.get('category_slug'),
    })

    // Get old data for audit
    const { data: oldModel } = await supabase
      .from('device_models')
      .select('name, release_year, order')
      .eq('id', validatedData.id)
      .single()

    // Update model
    const newModelData = {
      name: validatedData.name,
      release_year: validatedData.release_year,
      order: validatedData.order,
    }

    const { error } = await supabase
      .from('device_models')
      .update(newModelData)
      .eq('id', validatedData.id)

    if (error) {
      return { success: false, error: error.message }
    }

    // Audit logging
    if (oldModel) {
      await logUpdate(
        'device_models',
        validatedData.id,
        oldModel,
        newModelData
      )
    }

    // Cache revalidation
    revalidatePath(`/admin/catalog/${validatedData.category_slug}/models`)
    revalidatePath(`/admin/catalog/${validatedData.category_slug}/models/${validatedData.id}`)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(', '),
      }
    }
    return { success: false, error: 'Unknown error' }
  }
}

// Get maximum order value for a category
export async function getMaxOrder(categoryId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('device_models')
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

// Update model order via drag-and-drop
export async function updateModelOrder(
  updates: Array<{ id: string; order: number }>
) {
  try {
    const supabase = await createClient()

    const updatePromises = updates.map(async (update) => {
      const { error } = await supabase
        .from('device_models')
        .update({ order: update.order })
        .eq('id', update.id)

      if (error) {
        throw error
      }

      await logUpdate('device_models', update.id, { order: null }, {
        order: update.order,
      })
    })

    await Promise.all(updatePromises)

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update model order' }
  }
}
