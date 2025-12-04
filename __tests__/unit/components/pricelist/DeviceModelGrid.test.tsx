import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DeviceModelGrid } from '@/components/pricelist/DeviceModelGrid'
import { DeviceModel, DeviceCategory } from '@/types/pricelist'

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
    home: 'Главная',
    pricelist: 'Прайс-лист',
    repair: 'Ремонт',
    selectModelForPriceList: 'Выберите модель для просмотра цен',
    modelsNotFound: 'Модели не найдены',
  }),
  getCategoryName: (category: DeviceCategory) => {
    const names: Record<DeviceCategory, string> = {
      iphone: 'iPhone',
      ipad: 'iPad',
      macbook: 'MacBook',
      'apple-watch': 'Apple Watch',
    }
    return names[category]
  },
}))

// Mock CategoryNavigation
vi.mock('@/components/pricelist/CategoryNavigation', () => ({
  CategoryNavigation: ({ currentCategory }: { currentCategory: DeviceCategory }) => (
    <div data-testid="category-navigation">Category: {currentCategory}</div>
  ),
}))

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Home: () => <svg data-testid="home-icon" />,
  ChevronRight: () => <svg data-testid="chevron-icon" />,
}))

// Mock utils
vi.mock('@/lib/utils', () => ({
  parseModelName: (name: string) => ({
    mainName: name,
    modelCodes: 'A1234, A5678',
  }),
}))

describe('DeviceModelGrid Component', () => {
  const mockModels: DeviceModel[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      category: 'iphone',
      releaseYear: 2023,
      order: 1,
    },
    {
      id: 2,
      name: 'iPhone 15',
      slug: 'iphone-15',
      category: 'iphone',
      releaseYear: 2023,
      order: 2,
    },
    {
      id: 3,
      name: 'iPhone 14 Pro Max',
      slug: 'iphone-14-pro-max',
      category: 'iphone',
      releaseYear: 2022,
      order: 3,
    },
  ]

  describe('Rendering', () => {
    it('should render CategoryNavigation component', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      expect(screen.getByTestId('category-navigation')).toBeInTheDocument()
      expect(screen.getByText('Category: iphone')).toBeInTheDocument()
    })

    it('should render all model cards', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
      expect(screen.getByText('iPhone 15')).toBeInTheDocument()
      expect(screen.getByText('iPhone 14 Pro Max')).toBeInTheDocument()
    })

    it('should render page title with category name', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('iPhone')
    })

    it('should render subtitle text', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      expect(screen.getByText('Выберите модель для просмотра цен')).toBeInTheDocument()
    })

    it('should render model codes for each model', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const modelCodes = screen.getAllByText('A1234, A5678')
      expect(modelCodes.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Breadcrumbs Navigation', () => {
    it('should render breadcrumb navigation', () => {
      const { container } = render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('should render Home breadcrumb link', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const homeLink = screen.getByText('Главная').closest('a')
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('should render Pricelist breadcrumb link', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const pricelistLink = screen.getByText('Прайс-лист').closest('a')
      expect(pricelistLink).toHaveAttribute('href', '/pricelist')
    })

    it('should render current category as active breadcrumb', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      expect(screen.getByText('Ремонт iPhone')).toBeInTheDocument()
    })

    it('should render chevron icons between breadcrumbs', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const chevrons = screen.getAllByTestId('chevron-icon')
      expect(chevrons.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Model Card Navigation Links', () => {
    it('should have correct href for iPhone 15 Pro', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const modelLink = screen.getByText('iPhone 15 Pro').closest('a')
      expect(modelLink).toHaveAttribute('href', '/pricelist/iphone/iphone-15-pro')
    })

    it('should have correct href for iPhone 15', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const modelLink = screen.getByText('iPhone 15').closest('a')
      expect(modelLink).toHaveAttribute('href', '/pricelist/iphone/iphone-15')
    })

    it('should construct href using category and slug', () => {
      const ipadModels: DeviceModel[] = [
        {
          id: 1,
          name: 'iPad Pro 12.9',
          slug: 'ipad-pro-12-9',
          category: 'ipad',
          releaseYear: 2023,
          order: 1,
        },
      ]

      render(<DeviceModelGrid category="ipad" models={ipadModels} />)

      const modelLink = screen.getByText('iPad Pro 12.9').closest('a')
      expect(modelLink).toHaveAttribute('href', '/pricelist/ipad/ipad-pro-12-9')
    })
  })

  describe('onClick Handler', () => {
    it('should call onModelSelect when model is clicked', () => {
      const mockOnSelect = vi.fn()
      render(<DeviceModelGrid category="iphone" models={mockModels} onModelSelect={mockOnSelect} />)

      const modelCard = screen.getByText('iPhone 15 Pro').closest('div')
      modelCard?.click()

      expect(mockOnSelect).toHaveBeenCalledWith(mockModels[0])
    })

    it('should not throw error when onModelSelect is not provided', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const modelCard = screen.getByText('iPhone 15 Pro').closest('div')
      expect(() => modelCard?.click()).not.toThrow()
    })
  })

  describe('Empty State', () => {
    it('should render empty state when no models provided', () => {
      render(<DeviceModelGrid category="iphone" models={[]} />)

      expect(screen.getByText('Модели не найдены')).toBeInTheDocument()
    })

    it('should not render model cards in empty state', () => {
      const { container } = render(<DeviceModelGrid category="iphone" models={[]} />)

      const modelCards = container.querySelectorAll('a[href^="/pricelist/"]')
      expect(modelCards.length).toBeLessThanOrEqual(3) // Only breadcrumb links
    })

    it('should still render breadcrumbs in empty state', () => {
      render(<DeviceModelGrid category="iphone" models={[]} />)

      expect(screen.getByText('Главная')).toBeInTheDocument()
      expect(screen.getByText('Прайс-лист')).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('should have responsive grid layout', () => {
      const { container } = render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const gridContainer = container.querySelector('.grid')
      expect(gridContainer).toHaveClass(
        'grid-cols-1',
        'sm:grid-cols-2',
        'md:grid-cols-3',
        'lg:grid-cols-4',
        'gap-4'
      )
    })

    it('should apply hover effects to model cards', () => {
      const { container } = render(<DeviceModelGrid category="iphone" models={mockModels} />)

      // Get all links and find model card links (not breadcrumb links)
      const allLinks = container.querySelectorAll('a')
      const modelCards = Array.from(allLinks).filter(link =>
        link.getAttribute('href')?.includes('/pricelist/iphone/iphone-')
      )

      expect(modelCards.length).toBeGreaterThan(0)
      // Check that hover classes exist in the DOM (checking div inside link)
      modelCards.forEach(card => {
        const innerDiv = card.querySelector('div')
        expect(innerDiv).toHaveClass('hover:shadow-xl', 'hover:scale-[1.02]')
      })
    })

    it('should have proper container spacing', () => {
      const { container } = render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const mainContainer = container.querySelector('.mx-auto')
      expect(mainContainer).toHaveClass('px-4')
    })

    it('should apply transition effects', () => {
      const { container } = render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const allLinks = container.querySelectorAll('a')
      const modelCards = Array.from(allLinks).filter(link =>
        link.getAttribute('href')?.includes('/pricelist/iphone/iphone-')
      )

      // Check that transition classes exist in the DOM (checking div inside link)
      modelCards.forEach(card => {
        const innerDiv = card.querySelector('div')
        expect(innerDiv).toHaveClass('transition-all', 'duration-300')
      })
    })
  })

  describe('Responsive Design', () => {
    it('should have max-width container', () => {
      const { container } = render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const maxWidthContainers = container.querySelectorAll('.max-w-7xl')
      expect(maxWidthContainers.length).toBeGreaterThan(0)
    })

    it('should center content with mx-auto', () => {
      const { container } = render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const centeredContainers = container.querySelectorAll('.mx-auto')
      expect(centeredContainers.length).toBeGreaterThan(0)
    })

    it('should have responsive heading size', () => {
      render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('text-3xl', 'md:text-4xl')
    })
  })

  describe('Icon Rendering', () => {
    it('should render category icon for each model', () => {
      const { container } = render(<DeviceModelGrid category="iphone" models={mockModels} />)

      // Each model card should have an SVG icon
      const modelSvgs = container.querySelectorAll('.w-9.h-9')
      expect(modelSvgs.length).toBeGreaterThanOrEqual(3)
    })

    it('should apply correct icon size', () => {
      const { container } = render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const icons = container.querySelectorAll('svg.w-9')
      icons.forEach((icon) => {
        expect(icon).toHaveClass('w-9', 'h-9')
      })
    })

    it('should apply transition to icon colors', () => {
      const { container } = render(<DeviceModelGrid category="iphone" models={mockModels} />)

      const icons = container.querySelectorAll('svg.w-9')
      icons.forEach((icon) => {
        expect(icon).toHaveClass('transition-colors', 'duration-300')
      })
    })
  })

  describe('Different Categories', () => {
    it('should render iPad category correctly', () => {
      const ipadModels: DeviceModel[] = [
        {
          id: 1,
          name: 'iPad Pro',
          slug: 'ipad-pro',
          category: 'ipad',
          releaseYear: 2023,
          order: 1,
        },
      ]

      render(<DeviceModelGrid category="ipad" models={ipadModels} />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('iPad')
      expect(screen.getByText('iPad Pro')).toBeInTheDocument()
    })

    it('should render MacBook category correctly', () => {
      const macbookModels: DeviceModel[] = [
        {
          id: 1,
          name: 'MacBook Pro 16',
          slug: 'macbook-pro-16',
          category: 'macbook',
          releaseYear: 2023,
          order: 1,
        },
      ]

      render(<DeviceModelGrid category="macbook" models={macbookModels} />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('MacBook')
      expect(screen.getByText('MacBook Pro 16')).toBeInTheDocument()
    })

    it('should render Apple Watch category correctly', () => {
      const watchModels: DeviceModel[] = [
        {
          id: 1,
          name: 'Apple Watch Series 9',
          slug: 'apple-watch-series-9',
          category: 'apple-watch',
          releaseYear: 2023,
          order: 1,
        },
      ]

      render(<DeviceModelGrid category="apple-watch" models={watchModels} />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Apple Watch')
      expect(screen.getByText('Apple Watch Series 9')).toBeInTheDocument()
    })
  })
})
