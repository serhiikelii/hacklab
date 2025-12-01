import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/models/route'
import { supabase } from '@/lib/supabase'
import type { DeviceModel } from '@/types/database'

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}))

describe('/api/models GET endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 400 when category parameter is missing', async () => {
    // Arrange
    const request = new Request('http://localhost/api/models')

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Category parameter is required' })
  })

  it('should return 400 when category parameter is empty', async () => {
    // Arrange
    const request = new Request('http://localhost/api/models?category=')

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Invalid category parameter' })
  })

  it('should return 400 when category parameter is whitespace', async () => {
    // Arrange
    const request = new Request('http://localhost/api/models?category=   ')

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Invalid category parameter' })
  })

  it('should return 404 when category not found', async () => {
    // Arrange
    const request = new Request('http://localhost/api/models?category=nonexistent')

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
    expect(data).toEqual({ error: 'Category not found' })
  })

  it('should return models for valid category', async () => {
    // Arrange
    const request = new Request('http://localhost/api/models?category=iphone')

    const mockCategory = { id: 'cat-1' }
    const mockModels: DeviceModel[] = [
      {
        id: 'model-1',
        category_id: 'cat-1',
        slug: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        series: 'iPhone 15',
        release_year: 2023,
        order: 1,
        image_url: '/images/iphone-15-pro.webp',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: 'model-2',
        category_id: 'cat-1',
        slug: 'iphone-14-pro',
        name: 'iPhone 14 Pro',
        series: 'iPhone 14',
        release_year: 2022,
        order: 2,
        image_url: '/images/iphone-14-pro.webp',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ]

    // Mock category lookup
    const mockCategorySingle = vi.fn().mockResolvedValue({ data: mockCategory, error: null })
    const mockCategoryEq = vi.fn().mockReturnValue({ single: mockCategorySingle })
    const mockCategorySelect = vi.fn().mockReturnValue({ eq: mockCategoryEq })

    // Mock models query
    const mockModelsOrder1 = vi.fn().mockResolvedValue({ data: mockModels, error: null })
    const mockModelsOrder2 = vi.fn().mockReturnValue({ order: mockModelsOrder1 })
    const mockModelsEq = vi.fn().mockReturnValue({ order: mockModelsOrder2 })
    const mockModelsSelect = vi.fn().mockReturnValue({ eq: mockModelsEq })

    const mockFrom = vi.fn()
      .mockReturnValueOnce({ select: mockCategorySelect })  // First call for category
      .mockReturnValueOnce({ select: mockModelsSelect })     // Second call for models

    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(2)
    expect(data[0].name).toBe('iPhone 15 Pro')
    expect(data[1].name).toBe('iPhone 14 Pro')
  })

  it('should return 404 when no models found for category', async () => {
    // Arrange
    const request = new Request('http://localhost/api/models?category=iphone')

    const mockCategory = { id: 'cat-1' }

    // Mock category lookup (success)
    const mockCategorySingle = vi.fn().mockResolvedValue({ data: mockCategory, error: null })
    const mockCategoryEq = vi.fn().mockReturnValue({ single: mockCategorySingle })
    const mockCategorySelect = vi.fn().mockReturnValue({ eq: mockCategoryEq })

    // Mock models query (empty result)
    const mockModelsOrder1 = vi.fn().mockResolvedValue({ data: [], error: null })
    const mockModelsOrder2 = vi.fn().mockReturnValue({ order: mockModelsOrder1 })
    const mockModelsEq = vi.fn().mockReturnValue({ order: mockModelsOrder2 })
    const mockModelsSelect = vi.fn().mockReturnValue({ eq: mockModelsEq })

    const mockFrom = vi.fn()
      .mockReturnValueOnce({ select: mockCategorySelect })
      .mockReturnValueOnce({ select: mockModelsSelect })

    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(404)
    expect(data).toEqual({ error: 'No models found for this category' })
  })

  it('should return 500 on database error when fetching models', async () => {
    // Arrange
    const request = new Request('http://localhost/api/models?category=iphone')

    const mockCategory = { id: 'cat-1' }
    const dbError = { message: 'Database error' }

    // Mock category lookup (success)
    const mockCategorySingle = vi.fn().mockResolvedValue({ data: mockCategory, error: null })
    const mockCategoryEq = vi.fn().mockReturnValue({ single: mockCategorySingle })
    const mockCategorySelect = vi.fn().mockReturnValue({ eq: mockCategoryEq })

    // Mock models query (error)
    const mockModelsOrder1 = vi.fn().mockResolvedValue({ data: null, error: dbError })
    const mockModelsOrder2 = vi.fn().mockReturnValue({ order: mockModelsOrder1 })
    const mockModelsEq = vi.fn().mockReturnValue({ order: mockModelsOrder2 })
    const mockModelsSelect = vi.fn().mockReturnValue({ eq: mockModelsEq })

    const mockFrom = vi.fn()
      .mockReturnValueOnce({ select: mockCategorySelect })
      .mockReturnValueOnce({ select: mockModelsSelect })

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
    const request = new Request('http://localhost/api/models?category=iphone')

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

  it('should verify models are sorted by release_year DESC and name ASC', async () => {
    // Arrange
    const request = new Request('http://localhost/api/models?category=iphone')

    const mockCategory = { id: 'cat-1' }
    const mockModels: DeviceModel[] = [
      {
        id: 'model-1',
        category_id: 'cat-1',
        slug: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        series: null,
        release_year: 2023,
        order: 1,
        image_url: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ]

    const mockCategorySingle = vi.fn().mockResolvedValue({ data: mockCategory, error: null })
    const mockCategoryEq = vi.fn().mockReturnValue({ single: mockCategorySingle })
    const mockCategorySelect = vi.fn().mockReturnValue({ eq: mockCategoryEq })

    const mockModelsOrder1 = vi.fn().mockResolvedValue({ data: mockModels, error: null })
    const mockModelsOrder2 = vi.fn().mockReturnValue({ order: mockModelsOrder1 })
    const mockModelsEq = vi.fn().mockReturnValue({ order: mockModelsOrder2 })
    const mockModelsSelect = vi.fn().mockReturnValue({ eq: mockModelsEq })

    const mockFrom = vi.fn()
      .mockReturnValueOnce({ select: mockCategorySelect })
      .mockReturnValueOnce({ select: mockModelsSelect })

    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    await GET(request)

    // Assert
    expect(mockModelsOrder2).toHaveBeenCalledWith('release_year', { ascending: false })
    expect(mockModelsOrder1).toHaveBeenCalledWith('name', { ascending: true })
  })
})
