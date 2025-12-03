import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test-utils'
import { Footer } from '@/components/layout/Footer'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock SocialLinks component
vi.mock('@/components/layout/SocialLinks', () => ({
  SocialLinks: () => <div data-testid="social-links">Social Links</div>,
}))

describe('Footer Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the footer component', () => {
      renderWithProviders(<Footer />)

      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
    })

    it('should render the logo with correct text', () => {
      renderWithProviders(<Footer />)

      expect(screen.getByText('HACK')).toBeInTheDocument()
      expect(screen.getByText('LAB')).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('should render all footer navigation links', () => {
      renderWithProviders(<Footer />)

      // Check for navigation links (default locale is 'ru')
      const articlesLink = screen.getByRole('link', { name: /статьи/i })
      const pricelistLink = screen.getByRole('link', { name: /прайс-лист/i })
      const contactsLink = screen.getByRole('link', { name: /контакты/i })

      expect(articlesLink).toBeInTheDocument()
      expect(pricelistLink).toBeInTheDocument()
      expect(contactsLink).toBeInTheDocument()
    })

    it('should have correct href attributes for navigation links', () => {
      renderWithProviders(<Footer />)

      const articlesLink = screen.getByRole('link', { name: /статьи/i })
      const pricelistLink = screen.getByRole('link', { name: /прайс-лист/i })
      const contactsLink = screen.getByRole('link', { name: /контакты/i })

      expect(articlesLink).toHaveAttribute('href', '/articles')
      expect(pricelistLink).toHaveAttribute('href', '/pricelist')
      expect(contactsLink).toHaveAttribute('href', '/kontakt')
    })
  })

  describe('Contact Information', () => {
    it('should render business address', () => {
      renderWithProviders(<Footer />)

      expect(screen.getByText(/seifertova 83/i)).toBeInTheDocument()
      expect(screen.getByText(/praha 3 - žižkov/i)).toBeInTheDocument()
      expect(screen.getByText(/130 00/i)).toBeInTheDocument()
    })

    it('should render phone number link', () => {
      renderWithProviders(<Footer />)

      const phoneLink = screen.getByRole('link', { name: /721 042 342/i })
      expect(phoneLink).toHaveAttribute('href', 'tel:+420721042342')
    })

    it('should render email link', () => {
      renderWithProviders(<Footer />)

      const emailLink = screen.getByRole('link', { name: /info@mojservice\.cz/i })
      expect(emailLink).toHaveAttribute('href', 'mailto:info@mojservice.cz')
    })
  })

  describe('Working Hours', () => {
    it('should render working hours section', () => {
      renderWithProviders(<Footer />)

      // Check if working hours title is present (default locale is 'ru')
      expect(screen.getByText(/часы работы/i)).toBeInTheDocument()
    })

    it('should render all days of the week', () => {
      renderWithProviders(<Footer />)

      // Check if all days are rendered (checking for Russian text)
      expect(screen.getByText(/понедельник/i)).toBeInTheDocument()
      expect(screen.getByText(/вторник/i)).toBeInTheDocument()
      expect(screen.getByText(/среда/i)).toBeInTheDocument()
      expect(screen.getByText(/четверг/i)).toBeInTheDocument()
      expect(screen.getByText(/пятница/i)).toBeInTheDocument()
      expect(screen.getByText(/суббота/i)).toBeInTheDocument()
      expect(screen.getByText(/воскресенье/i)).toBeInTheDocument()
    })
  })

  describe('Social Links', () => {
    it('should render social media links component', () => {
      renderWithProviders(<Footer />)

      const socialLinks = screen.getByTestId('social-links')
      expect(socialLinks).toBeInTheDocument()
    })
  })

  describe('Copyright Section', () => {
    it('should render copyright text', () => {
      renderWithProviders(<Footer />)

      // Check if copyright text is present
      expect(screen.getByText(/©/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /hacklab/i })).toBeInTheDocument()
    })

    it('should have homepage link in copyright', () => {
      renderWithProviders(<Footer />)

      const hackLabLink = screen.getByRole('link', { name: /hacklab/i })
      expect(hackLabLink).toHaveAttribute('href', '/')
    })
  })

  describe('Layout Structure', () => {
    it('should have a 4-column grid on desktop', () => {
      renderWithProviders(<Footer />)

      const footer = screen.getByRole('contentinfo')
      const gridContainer = footer.querySelector('.grid')

      expect(gridContainer).toHaveClass('md:grid-cols-4')
    })

    it('should have proper spacing and styling', () => {
      renderWithProviders(<Footer />)

      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('bg-secondary', 'text-white')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA role for footer', () => {
      renderWithProviders(<Footer />)

      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('should have accessible phone and email links', () => {
      renderWithProviders(<Footer />)

      const phoneLink = screen.getByRole('link', { name: /721 042 342/i })
      const emailLink = screen.getByRole('link', { name: /info@mojservice\.cz/i })

      expect(phoneLink).toHaveAttribute('href', 'tel:+420721042342')
      expect(emailLink).toHaveAttribute('href', 'mailto:info@mojservice.cz')
    })
  })
})
