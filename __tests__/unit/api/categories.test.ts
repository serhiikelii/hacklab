import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/categories/route'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types/database'

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    }))
  }
}))

describe('/api/categories GET endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return all categories sorted by order', async () => {
    // Arrange
    const mockCategories: Category[] = [
      {
        id: '1',
        slug: 'iphone',
        name_en: 'iPhone',
        name_ru: 'iPhone',
        name_cz: 'iPhone',
        order: 1,
        icon_url: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '2',
        slug: 'ipad',
        name_en: 'iPad',
        name_ru: 'iPad',
        name_cz: 'iPad',
        order: 2,
        icon_url: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ]

    const mockOrder = vi.fn().mockResolvedValue({ data: mockCategories, error: null })
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET()
    const data = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(data).toEqual(mockCategories)
    expect(mockFrom).toHaveBeenCalledWith('device_categories')
    expect(mockSelect).toHaveBeenCalledWith('*')
    expect(mockOrder).toHaveBeenCalledWith('order', { ascending: true })
  })

  it('should return 404 when no categories found', async () => {
    // Arrange
    const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null })
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET()
    const data = await response.json()

    // Assert
    expect(response.status).toBe(404)
    expect(data).toEqual({ error: 'No categories found' })
  })

  it('should return 404 when data is null', async () => {
    // Arrange
    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: null })
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET()
    const data = await response.json()

    // Assert
    expect(response.status).toBe(404)
    expect(data).toEqual({ error: 'No categories found' })
  })

  it('should return 500 on database error', async () => {
    // Arrange
    const dbError = { message: 'Database connection failed', code: 'DB_ERROR' }
    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: dbError })
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET()
    const data = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(data).toEqual({ error: dbError.message })
  })

  it('should return 500 on unexpected error', async () => {
    // Arrange
    const mockFrom = vi.fn().mockImplementation(() => {
      throw new Error('Unexpected error')
    })
    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET()
    const data = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Internal server error' })
  })

  it('should validate response structure', async () => {
    // Arrange
    const mockCategories: Category[] = [
      {
        id: '1',
        slug: 'iphone',
        name_en: 'iPhone',
        name_ru: 'iPhone',
        name_cz: 'iPhone',
        order: 1,
        icon_url: '/icons/iphone.svg',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ]

    const mockOrder = vi.fn().mockResolvedValue({ data: mockCategories, error: null })
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
    vi.mocked(supabase.from).mockImplementation(mockFrom as any)

    // Act
    const response = await GET()
    const data = await response.json()

    // Assert
    expect(Array.isArray(data)).toBe(true)
    expect(data[0]).toHaveProperty('id')
    expect(data[0]).toHaveProperty('slug')
    expect(data[0]).toHaveProperty('name_en')
    expect(data[0]).toHaveProperty('name_ru')
    expect(data[0]).toHaveProperty('name_cz')
    expect(data[0]).toHaveProperty('order')
  })
})
