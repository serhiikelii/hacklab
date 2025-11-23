'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

const updatePriceSchema = z.object({
  priceId: z.string().uuid(),
  price: z.number().nullable(),
  duration_minutes: z.number().int().positive().nullable().optional(),
  warranty_months: z.number().int().positive().nullable().optional(),
})

export async function updatePrice(formData: FormData) {
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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Validate input
  const rawData = {
    priceId: formData.get('priceId') as string,
    price: formData.get('price')
      ? parseFloat(formData.get('price') as string)
      : null,
    duration_minutes: formData.get('duration_minutes')
      ? parseInt(formData.get('duration_minutes') as string)
      : undefined,
    warranty_months: formData.get('warranty_months')
      ? parseInt(formData.get('warranty_months') as string)
      : undefined,
  }

  const result = updatePriceSchema.safeParse(rawData)

  if (!result.success) {
    return { error: result.error.message }
  }

  const { priceId, price, duration_minutes, warranty_months } = result.data

  // Build update object
  const updateData: any = { price }
  if (duration_minutes !== undefined) updateData.duration_minutes = duration_minutes
  if (warranty_months !== undefined) updateData.warranty_months = warranty_months

  // Update price
  const { error } = await supabase
    .from('prices')
    .update(updateData)
    .eq('id', priceId)

  if (error) {
    console.error('Error updating price:', error)
    return { error: error.message }
  }

  return { success: true }
}
