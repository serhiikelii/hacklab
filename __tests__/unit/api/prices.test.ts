import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/prices/route'
import { supabase } from '@/lib/supabase'

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}))

describe('/api/prices GET endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 400 when model parameter is missing', async () => {
    // Arrange
    const request = new Request('http://localhost/api/prices')

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Model parameter is required' })
  })

  it('should return 400 when model parameter is empty', async () => {
    // Arrange
    const request = new Request('http://localhost/api/prices?model=')

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Invalid model parameter' })
  })

  it('should return 400 when model parameter is whitespace', async () => {
    // Arrange
    const request = new Request('http://localhost/api/prices?model=   ')

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Invalid model parameter' })
  })

  it('should return 404 when model not found', async () => {
    // Arrange
    const request = new Request('http://localhost/api/prices?model=nonexistent')

    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(404)
    expect(data).toEqual({ error: 'Model not found' })
  })

  it('should return prices with model and service data for valid model', async () => {
    // Arrange
    const request = new Request('http://localhost/api/prices?model=iphone-15-pro')

    const mockModel = {
      id: 'model-1',
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      release_year: 2023,
      series: 'iPhone 15',
      image_url: '/images/iphone-15-pro.webp',
      category: {
        slug: 'iphone',
        name_en: 'iPhone',
        name_ru: 'iPhone',
        name_cz: 'iPhone'
      }
    }

    const mockPrices = [
      {
        id: 'price-1',
        model_id: 'model-1',
        service_id: 'service-1',
        price: 3500,
        price_type: 'fixed',
        duration_minutes: 60,
        warranty_months: 24,
        note_ru: null,
        note_en: null,
        note_cz: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        service: {
          id: 'service-1',
          slug: 'screen-replacement',
          name_en: 'Screen Replacement',
          name_ru: 'Замена экрана',
          name_cz: 'Výměna displeje',
          service_type: 'repair',
          is_active: true,
          order: 1,
          description_en: null,
          description_ru: null,
          description_cz: null,
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        }
      },
      {
        id: 'price-2',
        model_id: 'model-1',
        service_id: 'service-2',
        price: 2000,
        price_type: 'fixed',
        duration_minutes: 30,
        warranty_months: 24,
        note_ru: null,
        note_en: null,
        note_cz: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        service: {
          id: 'service-2',
          slug: 'battery-replacement',
          name_en: 'Battery Replacement',
          name_ru: 'Замена батареи',
          name_cz: 'Výměna baterie',
          service_type: 'repair',
          is_active: true,
          order: 2,
          description_en: null,
          description_ru: null,
          description_cz: null,
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        }
      }
    ]

    // Mock model lookup
    const mockModelSingle = vi.fn().mockResolvedValue({ data: mockModel, error: null })
    const mockModelEq = vi.fn().mockReturnValue({ single: mockModelSingle })
    const mockModelSelect = vi.fn().mockReturnValue({ eq: mockModelEq })

    // Mock prices query
    const mockPricesOrder = vi.fn().mockResolvedValue({ data: mockPrices, error: null })
    const mockPricesEq = vi.fn().mockReturnValue({ order: mockPricesOrder })
    const mockPricesSelect = vi.fn().mockReturnValue({ eq: mockPricesEq })

    const mockFrom = vi.fn()
      .mockReturnValueOnce({ select: mockModelSelect })  // First call for model
      .mockReturnValueOnce({ select: mockPricesSelect })  // Second call for prices

    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('model')
    expect(data).toHaveProperty('prices')
    expect(data.model.name).toBe('iPhone 15 Pro')
    expect(Array.isArray(data.prices)).toBe(true)
    expect(data.prices.length).toBe(2)
    expect(data.prices[0].service.name_en).toBe('Screen Replacement')
  })

  it('should return 404 when no prices found for model', async () => {
    // Arrange
    const request = new Request('http://localhost/api/prices?model=iphone-15-pro')

    const mockModel = {
      id: 'model-1',
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      release_year: 2023,
      series: null,
      image_url: null,
      category: {
        slug: 'iphone',
        name_en: 'iPhone',
        name_ru: 'iPhone',
        name_cz: 'iPhone'
      }
    }

    // Mock model lookup (success)
    const mockModelSingle = vi.fn().mockResolvedValue({ data: mockModel, error: null })
    const mockModelEq = vi.fn().mockReturnValue({ single: mockModelSingle })
    const mockModelSelect = vi.fn().mockReturnValue({ eq: mockModelEq })

    // Mock prices query (empty result)
    const mockPricesOrder = vi.fn().mockResolvedValue({ data: [], error: null })
    const mockPricesEq = vi.fn().mockReturnValue({ order: mockPricesOrder })
    const mockPricesSelect = vi.fn().mockReturnValue({ eq: mockPricesEq })

    const mockFrom = vi.fn()
      .mockReturnValueOnce({ select: mockModelSelect })
      .mockReturnValueOnce({ select: mockPricesSelect })

    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(404)
    expect(data).toEqual({ error: 'No prices found for this model' })
  })

  it('should return 500 on database error when fetching prices', async () => {
    // Arrange
    const request = new Request('http://localhost/api/prices?model=iphone-15-pro')

    const mockModel = { id: 'model-1', slug: 'iphone-15-pro', name: 'iPhone 15 Pro' }
    const dbError = { message: 'Database error' }

    // Mock model lookup (success)
    const mockModelSingle = vi.fn().mockResolvedValue({ data: mockModel, error: null })
    const mockModelEq = vi.fn().mockReturnValue({ single: mockModelSingle })
    const mockModelSelect = vi.fn().mockReturnValue({ eq: mockModelEq })

    // Mock prices query (error)
    const mockPricesOrder = vi.fn().mockResolvedValue({ data: null, error: dbError })
    const mockPricesEq = vi.fn().mockReturnValue({ order: mockPricesOrder })
    const mockPricesSelect = vi.fn().mockReturnValue({ eq: mockPricesEq })

    const mockFrom = vi.fn()
      .mockReturnValueOnce({ select: mockModelSelect })
      .mockReturnValueOnce({ select: mockPricesSelect })

    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(data).toEqual({ error: dbError.message })
  })

  it('should handle unexpected errors', async () => {
    // Arrange
    const request = new Request('http://localhost/api/prices?model=iphone-15-pro')

    const mockFrom = vi.fn().mockImplementation(() => {
      throw new Error('Unexpected error')
    })
    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Internal server error' })
  })

  it('should include category information in model response', async () => {
    // Arrange
    const request = new Request('http://localhost/api/prices?model=iphone-15-pro')

    const mockModel = {
      id: 'model-1',
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      release_year: 2023,
      series: 'iPhone 15',
      image_url: '/images/iphone-15-pro.webp',
      category: {
        slug: 'iphone',
        name_en: 'iPhone',
        name_ru: 'iPhone',
        name_cz: 'iPhone'
      }
    }

    const mockPrices = [{
      id: 'price-1',
      model_id: 'model-1',
      service_id: 'service-1',
      price: 3500,
      price_type: 'fixed',
      duration_minutes: 60,
      warranty_months: 24,
      note_ru: null,
      note_en: null,
      note_cz: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      service: {
        id: 'service-1',
        slug: 'screen-replacement',
        name_en: 'Screen Replacement',
        name_ru: 'Замена экрана',
        name_cz: 'Výměna displeje',
        service_type: 'repair',
        is_active: true,
        order: 1,
        description_en: null,
        description_ru: null,
        description_cz: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    }]

    const mockModelSingle = vi.fn().mockResolvedValue({ data: mockModel, error: null })
    const mockModelEq = vi.fn().mockReturnValue({ single: mockModelSingle })
    const mockModelSelect = vi.fn().mockReturnValue({ eq: mockModelEq })

    const mockPricesOrder = vi.fn().mockResolvedValue({ data: mockPrices, error: null })
    const mockPricesEq = vi.fn().mockReturnValue({ order: mockPricesOrder })
    const mockPricesSelect = vi.fn().mockReturnValue({ eq: mockPricesEq })

    const mockFrom = vi.fn()
      .mockReturnValueOnce({ select: mockModelSelect })
      .mockReturnValueOnce({ select: mockPricesSelect })

    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(data.model.category).toBeDefined()
    expect(data.model.category.slug).toBe('iphone')
    expect(data.model.category.name_en).toBe('iPhone')
    expect(data.model.category.name_ru).toBe('iPhone')
    expect(data.model.category.name_cz).toBe('iPhone')
  })

  it('should verify prices are sorted by service_id', async () => {
    // Arrange
    const request = new Request('http://localhost/api/prices?model=iphone-15-pro')

    const mockModel = { id: 'model-1', slug: 'iphone-15-pro', name: 'iPhone 15 Pro' }
    const mockPrices = [
      { id: 'price-1', service_id: 'service-1', price: 3500, service: { id: 'service-1', slug: 'screen' } }
    ]

    const mockModelSingle = vi.fn().mockResolvedValue({ data: mockModel, error: null })
    const mockModelEq = vi.fn().mockReturnValue({ single: mockModelSingle })
    const mockModelSelect = vi.fn().mockReturnValue({ eq: mockModelEq })

    const mockPricesOrder = vi.fn().mockResolvedValue({ data: mockPrices, error: null })
    const mockPricesEq = vi.fn().mockReturnValue({ order: mockPricesOrder })
    const mockPricesSelect = vi.fn().mockReturnValue({ eq: mockPricesEq })

    const mockFrom = vi.fn()
      .mockReturnValueOnce({ select: mockModelSelect })
      .mockReturnValueOnce({ select: mockPricesSelect })

    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    await GET(request)

    // Assert
    expect(mockPricesOrder).toHaveBeenCalledWith('service_id')
  })
})
