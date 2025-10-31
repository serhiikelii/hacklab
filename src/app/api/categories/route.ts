import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types/database'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('device_categories')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No categories found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data as Category[])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
