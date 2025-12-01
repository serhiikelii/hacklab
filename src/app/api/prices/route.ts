import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { DeviceModel, Service, Price } from '@/types/database'

interface ModelWithCategory {
  id: string
  name: string
  slug: string
  series: string | null
  image_url: string | null
  release_year: number | null
  category: {
    slug: string
    name_en: string
    name_ru: string
    name_cz: string
  } | null
}

interface PriceWithService extends Price {
  service: Service | null
}

interface PricesResponse {
  model: ModelWithCategory
  prices: PriceWithService[]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const modelSlug = searchParams.get('model')

    if (modelSlug === null) {
      return NextResponse.json(
        { error: 'Model parameter is required' },
        { status: 400 }
      )
    }

    if (typeof modelSlug !== 'string' || modelSlug.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid model parameter' },
        { status: 400 }
      )
    }

    const { data: model, error: modelError } = await supabase
      .from('device_models')
      .select(`
        id,
        name,
        slug,
        release_year,
        series,
        image_url,
        category:device_categories(slug, name_en, name_ru, name_cz)
      `)
      .eq('slug', modelSlug)
      .single<ModelWithCategory>()

    if (modelError || !model) {
      console.error('Model not found:', modelError)
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    const { data: prices, error: pricesError } = await supabase
      .from('prices')
      .select(`
        *,
        service:services(*)
      `)
      .eq('model_id', model.id)
      .order('service_id')

    if (pricesError) {
      console.error('Error fetching prices:', pricesError)
      return NextResponse.json(
        { error: pricesError.message },
        { status: 500 }
      )
    }

    if (!prices || prices.length === 0) {
      return NextResponse.json(
        { error: 'No prices found for this model' },
        { status: 404 }
      )
    }

    const response: PricesResponse = {
      model,
      prices: prices as PriceWithService[]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
