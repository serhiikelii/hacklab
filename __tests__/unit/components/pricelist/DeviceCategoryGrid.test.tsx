import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DeviceCategoryGrid } from '@/components/pricelist/DeviceCategoryGrid'
import { DEVICE_CATEGORIES, type CategoryInfo } from '@/types/pricelist'
import type { Category } from '@/types/database'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock LocaleContext
vi.mock('@/contexts/LocaleContext', () => ({
  useLocale: () => ({ locale: 'ru' }),
}))

// Mock i18n translations
vi.mock('@/lib/i18n', () => ({
  getTranslations: () => ({
    pricelistCategoryQuestion: 'Какое устройство нужно отремонтировать?',
    categoriesUnavailable: 'Категории временно недоступны',
    tryRefresh: 'Попробуйте обновить страницу',
  }),
}))

describe('DeviceCategoryGrid Component', () => {
  const mockCategories: CategoryInfo[] = Object.values(DEVICE_CATEGORIES)

  describe('Rendering', () => {
    it('should render category grid with default categories', () => {
      render(<DeviceCategoryGrid />)

      expect(screen.getByText('iPhone')).toBeInTheDocument()
      expect(screen.getByText('iPad')).toBeInTheDocument()
      expect(screen.getByText('MacBook')).toBeInTheDocument()
      expect(screen.getByText('Apple Watch')).toBeInTheDocument()
    })

    it('should render question text from translations', () => {
      render(<DeviceCategoryGrid />)

      expect(screen.getByText('Какое устройство нужно отремонтировать?')).toBeInTheDocument()
    })

    it('should render all category cards', () => {
      const { container } = render(<DeviceCategoryGrid categories={mockCategories} />)

      const categoryCards = container.querySelectorAll('a[href^="/pricelist/"]')
      expect(categoryCards).toHaveLength(4)
    })

    it('should render SVG icons for each category', () => {
      const { container } = render(<DeviceCategoryGrid />)

      const svgElements = container.querySelectorAll('svg')
      expect(svgElements.length).toBeGreaterThanOrEqual(4)
    })
  })

  describe('Navigation Links', () => {
    it('should have correct href for iPhone category', () => {
      render(<DeviceCategoryGrid />)

      const iphoneLink = screen.getByText('iPhone').closest('a')
      expect(iphoneLink).toHaveAttribute('href', '/pricelist/iphone')
    })

    it('should have correct href for iPad category', () => {
      render(<DeviceCategoryGrid />)

      const ipadLink = screen.getByText('iPad').closest('a')
      expect(ipadLink).toHaveAttribute('href', '/pricelist/ipad')
    })

    it('should have correct href for MacBook category', () => {
      render(<DeviceCategoryGrid />)

      const macbookLink = screen.getByText('MacBook').closest('a')
      expect(macbookLink).toHaveAttribute('href', '/pricelist/macbook')
    })

    it('should have correct href for Apple Watch category', () => {
      render(<DeviceCategoryGrid />)

      const watchLink = screen.getByText('Apple Watch').closest('a')
      expect(watchLink).toHaveAttribute('href', '/pricelist/apple-watch')
    })
  })

  describe('onClick Handler', () => {
    it('should call onCategorySelect when category is clicked', () => {
      const mockOnSelect = vi.fn()
      render(<DeviceCategoryGrid onCategorySelect={mockOnSelect} />)

      const iphoneCard = screen.getByText('iPhone').closest('div')
      iphoneCard?.click()

      expect(mockOnSelect).toHaveBeenCalledWith('iphone')
    })

    it('should not throw error when onCategorySelect is not provided', () => {
      render(<DeviceCategoryGrid />)

      const iphoneCard = screen.getByText('iPhone').closest('div')
      expect(() => iphoneCard?.click()).not.toThrow()
    })
  })

  describe('Empty State', () => {
    it('should use fallback categories when empty array is provided', () => {
      // Note: Component uses fallback to DEVICE_CATEGORIES when empty array is provided
      // This is by design - empty state is only shown when rendering fails, not for empty data
      render(<DeviceCategoryGrid categories={[]} />)

      // Should render default categories as fallback
      expect(screen.getByText('iPhone')).toBeInTheDocument()
      expect(screen.getByText('iPad')).toBeInTheDocument()
      expect(screen.getByText('MacBook')).toBeInTheDocument()
      expect(screen.getByText('Apple Watch')).toBeInTheDocument()
    })

    it('should render fallback categories when null is provided', () => {
      render(<DeviceCategoryGrid categories={undefined} />)

      expect(screen.getByText('iPhone')).toBeInTheDocument()
    })
  })

  describe('Database Categories Transformation', () => {
    it('should transform database categories to CategoryInfo format', () => {
      const dbCategories: Category[] = [
        {
          id: 1,
          slug: 'iphone',
          name_en: 'iPhone',
          name_ru: 'iPhone',
          name_cz: 'iPhone',
          icon: 'smartphone',
          order: 1,
          created_at: new Date().toISOString(),
        },
      ]

      render(<DeviceCategoryGrid categories={dbCategories} />)

      expect(screen.getByText('iPhone')).toBeInTheDocument()
    })

    it('should use fallback when database category has missing fields', () => {
      const dbCategories: Category[] = [
        {
          id: 1,
          slug: 'ipad',
          name_en: '',
          name_ru: 'iPad',
          name_cz: '',
          icon: null,
          order: 2,
          created_at: new Date().toISOString(),
        },
      ]

      render(<DeviceCategoryGrid categories={dbCategories} />)

      expect(screen.getByText('iPad')).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('should have responsive grid layout', () => {
      const { container } = render(<DeviceCategoryGrid />)

      const gridContainer = container.querySelector('.grid')
      expect(gridContainer).toHaveClass(
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-4',
        'gap-6'
      )
    })

    it('should apply hover effects to category cards', () => {
      const { container } = render(<DeviceCategoryGrid />)

      const firstCard = container.querySelector('a[href^="/pricelist/"]')
      const innerDiv = firstCard?.querySelector('div')
      expect(innerDiv).toHaveClass('hover:shadow-xl', 'hover:scale-[1.02]')
    })

    it('should have proper spacing and padding', () => {
      const { container } = render(<DeviceCategoryGrid />)

      const mainContainer = container.querySelector('.mx-auto')
      expect(mainContainer).toHaveClass('px-4', 'py-8')
    })

    it('should apply transition effects', () => {
      const { container } = render(<DeviceCategoryGrid />)

      const firstCard = container.querySelector('a[href^="/pricelist/"]')
      const innerDiv = firstCard?.querySelector('div')
      expect(innerDiv).toHaveClass('transition-all', 'duration-300')
    })
  })

  describe('Responsive Design', () => {
    it('should have max-width container', () => {
      const { container } = render(<DeviceCategoryGrid />)

      const mainContainer = container.querySelector('.max-w-6xl')
      expect(mainContainer).toBeInTheDocument()
    })

    it('should center content with mx-auto', () => {
      const { container } = render(<DeviceCategoryGrid />)

      const mainContainer = container.querySelector('.mx-auto')
      expect(mainContainer).toHaveClass('mx-auto')
    })
  })

  describe('Icon Rendering', () => {
    it('should render icon with proper size', () => {
      const { container } = render(<DeviceCategoryGrid />)

      const icons = container.querySelectorAll('svg')
      icons.forEach((icon) => {
        expect(icon).toHaveClass('w-14', 'h-14')
      })
    })

    it('should apply correct icon color', () => {
      const { container } = render(<DeviceCategoryGrid />)

      const icons = container.querySelectorAll('svg')
      icons.forEach((icon) => {
        expect(icon).toHaveClass('text-gray-700', 'group-hover:text-gray-900')
      })
    })

    it('should apply transition to icon colors', () => {
      const { container } = render(<DeviceCategoryGrid />)

      const icons = container.querySelectorAll('svg')
      icons.forEach((icon) => {
        expect(icon).toHaveClass('transition-colors', 'duration-300')
      })
    })
  })
})
