import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { DeviceModel } from '@/types/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')

    if (!categorySlug) {
      return NextResponse.json(
        { error: 'Category parameter is required' },
        { status: 400 }
      )
    }

    if (typeof categorySlug !== 'string' || categorySlug.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid category parameter' },
        { status: 400 }
      )
    }

    const { data: category, error: categoryError } = await supabase
      .from('device_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single<{ id: string }>()

    if (categoryError || !category) {
      console.error('Category not found:', categoryError)
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('category_id', category.id)
      .order('release_year', { ascending: false })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching models:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No models found for this category' },
        { status: 404 }
      )
    }

    return NextResponse.json(data as DeviceModel[])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
