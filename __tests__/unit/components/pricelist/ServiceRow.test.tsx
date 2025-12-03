import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test-utils'
import { ServiceRow } from '@/components/pricelist/ServiceRow'
import { Service, ServicePrice } from '@/types/pricelist'

describe('ServiceRow Component', () => {
  const mockService: Service = {
    id: 'test-service-1',
    slug: 'test-service',
    name_ru: 'Замена батареи',
    name_en: 'Battery Replacement',
    name_cz: 'Výměna baterie',
    description_ru: 'Профессиональная замена батареи',
    description_en: 'Professional battery replacement',
    description_cz: 'Profesionální výměna baterie',
    price_type: 'fixed',
    enabled: true,
    order: 1,
    category: 'repair',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const mockPrice: ServicePrice = {
    id: 'test-price-1',
    service_id: 'test-service-1',
    device_model_id: 'test-model-1',
    price: 1500,
    currency: 'CZK',
    duration: 30,
    warranty_months: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render service name', () => {
      renderWithProviders(<ServiceRow service={mockService} price={mockPrice} />)

      // Default locale is 'ru'
      expect(screen.getByText('Замена батареи')).toBeInTheDocument()
    })

    it('should render service description when available', () => {
      renderWithProviders(<ServiceRow service={mockService} price={mockPrice} />)

      expect(screen.getByText('Профессиональная замена батареи')).toBeInTheDocument()
    })

    it('should not render description when not available', () => {
      const serviceWithoutDesc = { ...mockService, description_ru: undefined }
      renderWithProviders(<ServiceRow service={serviceWithoutDesc} price={mockPrice} />)

      expect(screen.queryByText('Профессиональная замена батареи')).not.toBeInTheDocument()
    })
  })

  describe('Price Display', () => {
    it('should display fixed price correctly', () => {
      renderWithProviders(<ServiceRow service={mockService} price={mockPrice} />)

      expect(screen.getByText(/1\s?500/)).toBeInTheDocument()
      expect(screen.getByText(/CZK/)).toBeInTheDocument()
    })

    it('should display "from" price type', () => {
      const fromService = { ...mockService, price_type: 'from' as const }
      renderWithProviders(<ServiceRow service={fromService} price={mockPrice} />)

      expect(screen.getByText(/от/i)).toBeInTheDocument()
      expect(screen.getByText(/1\s?500/)).toBeInTheDocument()
    })

    it('should display "free" price type', () => {
      const freeService = { ...mockService, price_type: 'free' as const }
      renderWithProviders(<ServiceRow service={freeService} price={mockPrice} />)

      expect(screen.getByText(/бесплатно/i)).toBeInTheDocument()
    })

    it('should display "on request" price type', () => {
      const onRequestService = { ...mockService, price_type: 'on_request' as const }
      renderWithProviders(<ServiceRow service={onRequestService} price={mockPrice} />)

      expect(screen.getByText(/по запросу/i)).toBeInTheDocument()
    })

    it('should display "clarify" when no price is provided', () => {
      renderWithProviders(<ServiceRow service={mockService} />)

      expect(screen.getByText(/уточняйте/i)).toBeInTheDocument()
    })
  })

  describe('Duration Display', () => {
    it('should display duration in minutes when less than 60', () => {
      const priceWith30Min = { ...mockPrice, duration: 30 }
      renderWithProviders(<ServiceRow service={mockService} price={priceWith30Min} />)

      expect(screen.getByText(/30.*мин/i)).toBeInTheDocument()
    })

    it('should display duration in hours when exactly 60 minutes', () => {
      const priceWith60Min = { ...mockPrice, duration: 60 }
      renderWithProviders(<ServiceRow service={mockService} price={priceWith60Min} />)

      expect(screen.getByText(/1.*ч/i)).toBeInTheDocument()
    })

    it('should display duration in hours and minutes when mixed', () => {
      const priceWith90Min = { ...mockPrice, duration: 90 }
      renderWithProviders(<ServiceRow service={mockService} price={priceWith90Min} />)

      expect(screen.getByText(/1.*ч.*30.*мин/i)).toBeInTheDocument()
    })

    it('should not display duration when not provided', () => {
      const priceNoDuration = { ...mockPrice, duration: undefined }
      renderWithProviders(<ServiceRow service={mockService} price={priceNoDuration} />)

      expect(screen.queryByText(/мин|ч/i)).not.toBeInTheDocument()
    })

    it('should render duration icon', () => {
      const { container } = renderWithProviders(<ServiceRow service={mockService} price={mockPrice} />)

      const durationSvg = container.querySelector('svg')
      expect(durationSvg).toBeInTheDocument()
    })
  })

  describe('Warranty Display', () => {
    it('should display warranty information when available', () => {
      renderWithProviders(<ServiceRow service={mockService} price={mockPrice} />)

      expect(screen.getByText(/6.*мес.*гарантия/i)).toBeInTheDocument()
    })

    it('should not display warranty when not provided', () => {
      const priceNoWarranty = { ...mockPrice, warranty_months: undefined }
      renderWithProviders(<ServiceRow service={mockService} price={priceNoWarranty} />)

      expect(screen.queryByText(/гарантия/i)).not.toBeInTheDocument()
    })

    it('should render warranty icon', () => {
      const { container } = renderWithProviders(<ServiceRow service={mockService} price={mockPrice} />)

      const svgElements = container.querySelectorAll('svg')
      expect(svgElements.length).toBeGreaterThanOrEqual(2) // Duration + Warranty icons
    })
  })

  describe('Notes Display', () => {
    it('should display Russian note when available', () => {
      const priceWithNote = { ...mockPrice, note_ru: 'Специальное предложение' }
      renderWithProviders(<ServiceRow service={mockService} price={priceWithNote} />)

      expect(screen.getByText('Специальное предложение')).toBeInTheDocument()
    })

    it('should display English note when Russian is not available', () => {
      const priceWithEnNote = { ...mockPrice, note_en: 'Special offer' }
      renderWithProviders(<ServiceRow service={mockService} price={priceWithEnNote} />)

      expect(screen.getByText('Special offer')).toBeInTheDocument()
    })

    it('should not display note section when no notes are available', () => {
      renderWithProviders(<ServiceRow service={mockService} price={mockPrice} />)

      // Check that there's no italic text (notes are styled with italic)
      const italicElements = screen.queryAllByText(/.*/, { selector: '.italic' })
      expect(italicElements.length).toBe(0)
    })
  })

  describe('Styling and Layout', () => {
    it('should apply hover effect styling', () => {
      const { container } = renderWithProviders(<ServiceRow service={mockService} price={mockPrice} />)

      const rowContainer = container.firstChild as HTMLElement
      expect(rowContainer).toHaveClass('hover:bg-gray-50', 'transition-colors')
    })

    it('should have responsive layout classes', () => {
      const { container } = renderWithProviders(<ServiceRow service={mockService} price={mockPrice} />)

      const rowContainer = container.firstChild as HTMLElement
      expect(rowContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row')
    })

    it('should have proper padding', () => {
      const { container } = renderWithProviders(<ServiceRow service={mockService} price={mockPrice} />)

      const rowContainer = container.firstChild as HTMLElement
      expect(rowContainer).toHaveClass('p-4', 'sm:p-6')
    })
  })

  describe('Edge Cases', () => {
    it('should handle service without any price data', () => {
      renderWithProviders(<ServiceRow service={mockService} />)

      expect(screen.getByText('Замена батареи')).toBeInTheDocument()
      expect(screen.getByText(/уточняйте/i)).toBeInTheDocument()
    })

    it('should handle price with zero value', () => {
      const zeroPrice = { ...mockPrice, price: 0 }
      renderWithProviders(<ServiceRow service={mockService} price={zeroPrice} />)

      expect(screen.getByText('0 CZK')).toBeInTheDocument()
    })

    it('should handle price with null value', () => {
      const nullPrice = { ...mockPrice, price: null }
      renderWithProviders(<ServiceRow service={mockService} price={nullPrice} />)

      expect(screen.getByText(/уточняйте/i)).toBeInTheDocument()
    })

    it('should handle very large price values', () => {
      const largePrice = { ...mockPrice, price: 999999 }
      renderWithProviders(<ServiceRow service={mockService} price={largePrice} />)

      // Should format with thousand separators
      expect(screen.getByText(/999.*999/)).toBeInTheDocument()
    })

    it('should handle very long duration', () => {
      const longDuration = { ...mockPrice, duration: 300 } // 5 hours
      renderWithProviders(<ServiceRow service={mockService} price={longDuration} />)

      expect(screen.getByText(/5.*ч/i)).toBeInTheDocument()
    })
  })
})
