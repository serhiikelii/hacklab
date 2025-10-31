/**
 * TypeScript types for API responses
 * Обеспечивает строгую типизацию между backend API routes и frontend
 */

import type { Category, DeviceModel, Service, Price } from './database'

export interface ApiError {
  error: string
}

export interface CategoriesResponse {
  data: Category[]
}

export interface ModelsResponse {
  data: DeviceModel[]
}

export interface ModelWithCategory {
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

export interface PriceWithService extends Price {
  service: Service | null
}

export interface PricesResponse {
  model: ModelWithCategory
  prices: PriceWithService[]
}

export type ApiResponse<T> = T | ApiError

export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as ApiError).error === 'string'
  )
}
