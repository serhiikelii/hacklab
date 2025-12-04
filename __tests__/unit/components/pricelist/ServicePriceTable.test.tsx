import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ServicePriceTable } from '@/components/pricelist/ServicePriceTable'
import { DeviceModel, Service, ServicePrice } from '@/types/pricelist'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, onError, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      onError={onError}
      {...props}
    />
  ),
}))

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
    service: 'Услуга',
    price: 'Цена',
    servicePriceTableTitle: 'Выберите услугу для ремонта',
    pricesSoonTitle: 'Скоро здесь появятся цены',
    pricesSoonDescription: 'Мы работаем над добавлением цен для {model}',
    servicesUnavailableTitle: 'Услуги временно недоступны',
    servicesUnavailableDescription: 'Попробуйте обновить страницу',
    repairLiveTitle: 'Смотрите ремонт LIVE',
    repairLiveDescription: 'Наблюдайте за процессом ремонта в режиме реального времени',
    bookLiveStream: 'Забронировать трансляцию',
    liveStreamFormTitle: 'Доступ к трансляции',
    liveStreamFormDescription: 'Введите данные для доступа к live-трансляции',
    loginPlaceholder: 'Логин',
    passwordPlaceholder: 'Пароль',
    cancel: 'Отмена',
    submitAccess: 'Получить доступ',
  }),
  getServiceName: (service: Service) => service.name_ru || service.name_en,
  getCategoryName: () => 'iPhone',
  formatMessage: (template: string, data: any) => {
    return template.replace('{model}', data.model)
  },
}))

// Mock utils
vi.mock('@/lib/utils', () => ({
  parseModelName: (name: string) => ({
    mainName: name.split('(')[0].trim(),
    modelCodes: 'A1234, A5678',
  }),
  formatDuration: (duration: string) => duration,
}))

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Home: () => <svg data-testid="home-icon" />,
  ChevronRight: () => <svg data-testid="chevron-icon" />,
}))

// Mock UI components
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: any) => <div data-testid="dialog-title">{children}</div>,
  DialogDescription: ({ children }: any) => <div data-testid="dialog-description">{children}</div>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}))

describe('ServicePriceTable Component', () => {
  const mockModel: DeviceModel = {
    id: 1,
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    category: 'iphone',
    releaseYear: 2023,
    order: 1,
    image_url: '/images/iphone-15-pro.webp',
  }

  const mockServices: Service[] = [
    {
      id: 1,
      name_en: 'Screen Replacement',
      name_ru: 'Замена экрана',
      name_cz: 'Výměna displeje',
      slug: 'screen-replacement',
      description: 'Replace broken screen',
      icon: 'screen',
      order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name_en: 'Battery Replacement',
      name_ru: 'Замена батареи',
      name_cz: 'Výměna baterie',
      slug: 'battery-replacement',
      description: 'Replace old battery',
      icon: 'battery',
      order: 2,
      created_at: new Date().toISOString(),
    },
  ]

  const mockPrices: ServicePrice[] = [
    {
      id: 1,
      deviceModelId: 1,
      serviceId: 1,
      price: 5000,
      currency: 'CZK',
      duration: '1-2 hours',
      warranty: '90 days',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      deviceModelId: 1,
      serviceId: 2,
      price: 2500,
      currency: 'CZK',
      duration: '30 minutes',
      warranty: '90 days',
      created_at: new Date().toISOString(),
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render model name as heading', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('iPhone 15 Pro')
    })

    it('should render model codes', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      expect(screen.getByText('A1234, A5678')).toBeInTheDocument()
    })

    it('should render subtitle text', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      expect(screen.getByText('Выберите услугу для ремонта')).toBeInTheDocument()
    })

    it('should render service table headers', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      expect(screen.getByText('Услуга')).toBeInTheDocument()
      expect(screen.getByText('Цена')).toBeInTheDocument()
    })

    it('should render all services with prices', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      expect(screen.getByText('Замена экрана')).toBeInTheDocument()
      expect(screen.getByText('Замена батареи')).toBeInTheDocument()
    })

    it('should render prices in correct format', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      expect(screen.getByText('5000 Kč')).toBeInTheDocument()
      expect(screen.getByText('2500 Kč')).toBeInTheDocument()
    })

    it('should render service duration', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      expect(screen.getByText('1-2 hours')).toBeInTheDocument()
      expect(screen.getByText('30 minutes')).toBeInTheDocument()
    })
  })

  describe('Breadcrumbs Navigation', () => {
    it('should render breadcrumb navigation', () => {
      const { container } = render(
        <ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />
      )

      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('should render Home breadcrumb link', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const homeLink = screen.getByText('Главная').closest('a')
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('should render Pricelist breadcrumb link', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const pricelistLink = screen.getByText('Прайс-лист').closest('a')
      expect(pricelistLink).toHaveAttribute('href', '/pricelist')
    })

    it('should render category breadcrumb link', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const categoryLink = screen.getByText('Ремонт iPhone').closest('a')
      expect(categoryLink).toHaveAttribute('href', '/pricelist/iphone')
    })

    it('should render model name as active breadcrumb', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const modelBreadcrumb = screen.getAllByText('iPhone 15 Pro')[1] // Second occurrence in breadcrumbs
      expect(modelBreadcrumb).toBeInTheDocument()
    })
  })

  describe('Model Image', () => {
    it('should render model image when image_url is provided', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const image = screen.getByAltText('iPhone 15 Pro')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/images/iphone-15-pro.webp')
    })

    it('should render placeholder image on error', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const image = screen.getByAltText('iPhone 15 Pro')
      fireEvent.error(image)

      waitFor(() => {
        const placeholder = screen.getByAltText('Device placeholder')
        expect(placeholder).toBeInTheDocument()
      })
    })

    it('should render placeholder when no image_url provided', () => {
      const modelWithoutImage = { ...mockModel, image_url: undefined }
      render(
        <ServicePriceTable model={modelWithoutImage} services={mockServices} prices={mockPrices} />
      )

      const placeholder = screen.getByAltText('Device placeholder')
      expect(placeholder).toBeInTheDocument()
    })
  })

  describe('Live Stream Section', () => {
    it('should render live stream title', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      expect(screen.getByText('Смотрите ремонт LIVE')).toBeInTheDocument()
    })

    it('should render live stream description', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      expect(
        screen.getByText('Наблюдайте за процессом ремонта в режиме реального времени')
      ).toBeInTheDocument()
    })

    it('should render book live stream button', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      expect(screen.getByText('Забронировать трансляцию')).toBeInTheDocument()
    })

    it('should open dialog when book button is clicked', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const bookButton = screen.getByText('Забронировать трансляцию')
      fireEvent.click(bookButton)

      expect(screen.getByTestId('dialog')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Доступ к трансляции')
    })
  })

  describe('Live Stream Dialog', () => {
    it('should render dialog form with login and password inputs', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const bookButton = screen.getByText('Забронировать трансляцию')
      fireEvent.click(bookButton)

      expect(screen.getByPlaceholderText('Логин')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument()
    })

    it('should update login input value', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const bookButton = screen.getByText('Забронировать трансляцию')
      fireEvent.click(bookButton)

      const loginInput = screen.getByPlaceholderText('Логин') as HTMLInputElement
      fireEvent.change(loginInput, { target: { value: 'testuser' } })

      expect(loginInput.value).toBe('testuser')
    })

    it('should update password input value', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const bookButton = screen.getByText('Забронировать трансляцию')
      fireEvent.click(bookButton)

      const passwordInput = screen.getByPlaceholderText('Пароль') as HTMLInputElement
      fireEvent.change(passwordInput, { target: { value: 'password123' } })

      expect(passwordInput.value).toBe('password123')
    })

    it('should close dialog and clear inputs on cancel', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const bookButton = screen.getByText('Забронировать трансляцию')
      fireEvent.click(bookButton)

      const loginInput = screen.getByPlaceholderText('Логин') as HTMLInputElement
      fireEvent.change(loginInput, { target: { value: 'testuser' } })

      const cancelButton = screen.getByText('Отмена')
      fireEvent.click(cancelButton)

      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
    })

    it('should close dialog and clear inputs on submit', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const bookButton = screen.getByText('Забронировать трансляцию')
      fireEvent.click(bookButton)

      const loginInput = screen.getByPlaceholderText('Логин') as HTMLInputElement
      fireEvent.change(loginInput, { target: { value: 'testuser' } })

      const submitButton = screen.getByText('Получить доступ')
      fireEvent.click(submitButton)

      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('should render empty prices state when no prices provided', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={[]} />)

      expect(screen.getByText('Скоро здесь появятся цены')).toBeInTheDocument()
      expect(
        screen.getByText('Мы работаем над добавлением цен для iPhone 15 Pro')
      ).toBeInTheDocument()
    })

    it('should render empty services state when no services provided', () => {
      render(<ServicePriceTable model={mockModel} services={[]} prices={mockPrices} />)

      expect(screen.getByText('Услуги временно недоступны')).toBeInTheDocument()
      expect(screen.getByText('Попробуйте обновить страницу')).toBeInTheDocument()
    })

    it('should not render service table in empty services state', () => {
      render(<ServicePriceTable model={mockModel} services={[]} prices={mockPrices} />)

      expect(screen.queryByText('Услуга')).not.toBeInTheDocument()
      expect(screen.queryByText('Цена')).not.toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('should have two-column layout on large screens', () => {
      const { container } = render(
        <ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />
      )

      const gridContainer = container.querySelector('.grid.lg\\:grid-cols-3')
      expect(gridContainer).toBeInTheDocument()
    })

    it('should apply hover shadow to service table', () => {
      const { container } = render(
        <ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />
      )

      const table = container.querySelector('table')?.parentElement
      expect(table).toHaveClass('hover:shadow-lg', 'transition-shadow', 'duration-300')
    })

    it('should have sticky positioning for image section', () => {
      const { container } = render(
        <ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />
      )

      const stickyContainer = container.querySelector('.sticky')
      expect(stickyContainer).toHaveClass('sticky', 'top-8')
    })

    it('should apply hover effects to service rows', () => {
      const { container } = render(
        <ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />
      )

      const tableRows = container.querySelectorAll('tbody tr')
      tableRows.forEach((row) => {
        expect(row).toHaveClass('hover:bg-gray-50', 'transition-colors', 'duration-200')
      })
    })
  })

  describe('Responsive Design', () => {
    it('should have max-width container', () => {
      const { container } = render(
        <ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />
      )

      const maxWidthContainer = container.querySelector('.max-w-7xl')
      expect(maxWidthContainer).toBeInTheDocument()
    })

    it('should have responsive heading size', () => {
      render(<ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('text-xl', 'md:text-3xl', 'lg:text-4xl')
    })

    it('should have responsive padding on table cells', () => {
      const { container } = render(
        <ServicePriceTable model={mockModel} services={mockServices} prices={mockPrices} />
      )

      const tableCells = container.querySelectorAll('th, td')
      tableCells.forEach((cell) => {
        expect(cell.className).toMatch(/px-\d+/)
      })
    })
  })
})
