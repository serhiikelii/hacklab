import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import { SocialLinks } from '@/components/layout/SocialLinks'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('SocialLinks Component', () => {
  describe('Rendering', () => {
    it('should render all social media links', () => {
      render(<SocialLinks />)

      const telegramLink = screen.getByLabelText(/visit our telegram channel/i)
      const instagramLink = screen.getByLabelText(/follow us on instagram/i)
      const facebookLink = screen.getByLabelText(/like us on facebook/i)

      expect(telegramLink).toBeInTheDocument()
      expect(instagramLink).toBeInTheDocument()
      expect(facebookLink).toBeInTheDocument()
    })

    it('should have correct href attributes for social links', () => {
      render(<SocialLinks />)

      const telegramLink = screen.getByLabelText(/visit our telegram channel/i)
      const instagramLink = screen.getByLabelText(/follow us on instagram/i)
      const facebookLink = screen.getByLabelText(/like us on facebook/i)

      expect(telegramLink).toHaveAttribute('href', 'https://t.me/placeholder')
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/placeholder')
      expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/placeholder')
    })

    it('should render social media icons as SVG elements', () => {
      const { container } = render(<SocialLinks />)

      const svgElements = container.querySelectorAll('svg')
      expect(svgElements).toHaveLength(3) // Telegram, Instagram, Facebook
    })
  })

  describe('Variants', () => {
    it('should apply footer variant styles by default', () => {
      render(<SocialLinks />)

      const telegramLink = screen.getByLabelText(/visit our telegram channel/i)
      expect(telegramLink).toHaveClass('text-gray-400', 'hover:text-white')
    })

    it('should apply header variant styles when specified', () => {
      render(<SocialLinks variant="header" />)

      const telegramLink = screen.getByLabelText(/visit our telegram channel/i)
      expect(telegramLink).toHaveClass('text-gray-700', 'hover:text-teal-600')
    })

    it('should apply custom className when provided', () => {
      const { container } = render(<SocialLinks className="custom-class" />)

      const linksContainer = container.firstChild as HTMLElement
      expect(linksContainer).toHaveClass('custom-class')
    })
  })

  describe('Link Attributes', () => {
    it('should open links in new tab', () => {
      render(<SocialLinks />)

      const telegramLink = screen.getByLabelText(/visit our telegram channel/i)
      const instagramLink = screen.getByLabelText(/follow us on instagram/i)
      const facebookLink = screen.getByLabelText(/like us on facebook/i)

      expect(telegramLink).toHaveAttribute('target', '_blank')
      expect(instagramLink).toHaveAttribute('target', '_blank')
      expect(facebookLink).toHaveAttribute('target', '_blank')
    })

    it('should have security attributes for external links', () => {
      render(<SocialLinks />)

      const telegramLink = screen.getByLabelText(/visit our telegram channel/i)
      const instagramLink = screen.getByLabelText(/follow us on instagram/i)
      const facebookLink = screen.getByLabelText(/like us on facebook/i)

      expect(telegramLink).toHaveAttribute('rel', 'noopener noreferrer')
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer')
      expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for each social link', () => {
      render(<SocialLinks />)

      expect(screen.getByLabelText('Visit our Telegram channel')).toBeInTheDocument()
      expect(screen.getByLabelText('Follow us on Instagram')).toBeInTheDocument()
      expect(screen.getByLabelText('Like us on Facebook')).toBeInTheDocument()
    })

    it('should have accessible SVG icons', () => {
      const { container } = render(<SocialLinks />)

      const svgElements = container.querySelectorAll('svg')
      svgElements.forEach((svg) => {
        expect(svg).toHaveClass('w-7', 'h-7')
      })
    })
  })

  describe('Styling', () => {
    it('should apply base styles for container', () => {
      const { container } = render(<SocialLinks />)

      const linksContainer = container.firstChild as HTMLElement
      expect(linksContainer).toHaveClass('flex', 'items-center', 'gap-4')
    })

    it('should apply transition effects to links', () => {
      render(<SocialLinks />)

      const telegramLink = screen.getByLabelText(/visit our telegram channel/i)
      expect(telegramLink).toHaveClass('transition-colors', 'duration-200')
    })
  })

  describe('Edge Cases', () => {
    it('should handle both variant and className props together', () => {
      const { container } = render(<SocialLinks variant="header" className="justify-center" />)

      const linksContainer = container.firstChild as HTMLElement
      expect(linksContainer).toHaveClass('justify-center')

      const telegramLink = screen.getByLabelText(/visit our telegram channel/i)
      expect(telegramLink).toHaveClass('text-gray-700', 'hover:text-teal-600')
    })

    it('should render without crashing when no props are provided', () => {
      const { container } = render(<SocialLinks />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
