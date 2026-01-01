import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Parse request body
    const { orders } = await request.json()

    if (!orders || !Array.isArray(orders)) {
      return NextResponse.json(
        { success: false, error: 'Invalid orders format' },
        { status: 400 }
      )
    }

    // Validate orders format
    for (const order of orders) {
      if (!order.id || typeof order.display_order !== 'number') {
        return NextResponse.json(
          { success: false, error: 'Each order must have id and display_order' },
          { status: 400 }
        )
      }
    }

    // Update display_order for each announcement
    const updatePromises = orders.map(({ id, display_order }) =>
      supabase
        .from('announcements')
        .update({ display_order })
        .eq('id', id)
    )

    const results = await Promise.all(updatePromises)

    // Check for errors
    const errors = results.filter((result) => result.error)
    if (errors.length > 0) {
      console.error('Errors updating announcement orders:', errors)
      return NextResponse.json(
        { success: false, error: 'Failed to update some announcements' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in reorder endpoint:', error)
    return NextResponse.json(
      { success: false, error: 'Unexpected error' },
      { status: 500 }
    )
  }
}
