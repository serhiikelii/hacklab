import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getModelBySlug, getServicesForCategory, getPricesForModel, getModelsForCategory, getCategories } from '@/lib/queries'
import { supabase } from '@/lib/supabase'

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}))

// Mock Next.js cache
vi.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn
}))

describe('Database Queries Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getModelBySlug', () => {
    it('should return null for invalid slug', async () => {
      const result = await getModelBySlug('')
      expect(result).toBeNull()
    })

    it('should return null for non-string slug', async () => {
      const result = await getModelBySlug(null as any)
      expect(result).toBeNull()
    })

    it('should fetch model with category information', async () => {
      const mockData = {
        id: 'model-1',
        slug: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        series: 'iPhone 15',
        release_year: 2023,
        image_url: '/images/iphone-15-pro.webp',
        device_categories: {
          slug: 'iphone'
        }
      }

      const mockSingle = vi.fn().mockResolvedValue({ data: mockData, error: null })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
      vi.mocked(supabase.from).mockImplementation(mockFrom as any)

      const result = await getModelBySlug('iphone-15-pro')

      expect(result).not.toBeNull()
      expect(result?.slug).toBe('iphone-15-pro')
      expect(result?.category).toBe('iphone')
    })
  })

  describe('getServicesForCategory', () => {
    it('should fetch services for category using VIEW', async () => {
      const mockData = [
        {
          service_id: 'service-1',
          service_slug: 'screen-replacement',
          service_name_en: 'Screen Replacement',
          service_name_ru: 'Замена экрана',
          service_name_cz: 'Výměna displeje',
          service_type: 'repair'
        }
      ]

      const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null })
      const mockEq2 = vi.fn().mockReturnValue({ order: mockOrder })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
      vi.mocked(supabase.from).mockImplementation(mockFrom as any)

      const result = await getServicesForCategory('iphone')

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(result[0].slug).toBe('screen-replacement')
    })
  })

  describe('getModelsForCategory', () => {
    it('should return empty array for invalid category slug', async () => {
      const result = await getModelsForCategory('')
      expect(result).toEqual([])
    })

    it('should fetch models sorted by order, release_year, and name', async () => {
      const mockData = [
        {
          id: 'model-1',
          slug: 'iphone-15-pro',
          name: 'iPhone 15 Pro',
          device_categories: { slug: 'iphone' }
        }
      ]

      const mockOrder3 = vi.fn().mockResolvedValue({ data: mockData, error: null })
      const mockOrder2 = vi.fn().mockReturnValue({ order: mockOrder3 })
      const mockOrder1 = vi.fn().mockReturnValue({ order: mockOrder2 })
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder1 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
      vi.mocked(supabase.from).mockImplementation(mockFrom as any)

      const result = await getModelsForCategory('iphone')

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
    })
  })

  describe('getPricesForModel', () => {
    it('should return empty array for invalid model ID', async () => {
      const result = await getPricesForModel('')
      expect(result).toEqual([])
    })

    it('should fetch prices for model', async () => {
      const mockData = [
        {
          service_id: 'service-1',
          model_id: 'model-1',
          price: 3500,
          price_type: 'fixed',
          duration_minutes: 60,
          warranty_months: 24
        }
      ]

      const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null })
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
      vi.mocked(supabase.from).mockImplementation(mockFrom as any)

      const result = await getPricesForModel('model-1')

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(result[0].serviceId).toBe('service-1')
      expect(result[0].price).toBe(3500)
    })
  })

  describe('getCategories', () => {
    it('should fetch all categories sorted by order', async () => {
      const mockData = [
        { id: '1', slug: 'iphone', name_en: 'iPhone', order: 1 },
        { id: '2', slug: 'ipad', name_en: 'iPad', order: 2 }
      ]

      const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null })
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
      vi.mocked(supabase.from).mockImplementation(mockFrom as any)

      const result = await getCategories()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
    })
  })
})
