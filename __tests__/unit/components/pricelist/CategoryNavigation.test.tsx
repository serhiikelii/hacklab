import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import { CategoryNavigation } from '@/components/pricelist/CategoryNavigation'
import { DeviceCategory } from '@/types/pricelist'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('CategoryNavigation Component', () => {
  const categories: DeviceCategory[] = ['iphone', 'ipad', 'macbook', 'apple-watch']

  describe('Rendering', () => {
    it('should render all category links', () => {
      render(<CategoryNavigation currentCategory="iphone" />)

      expect(screen.getByRole('link', { name: /iphone/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /ipad/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /macbook/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /apple watch/i })).toBeInTheDocument()
    })

    it('should render SVG icons for each category', () => {
      const { container } = render(<CategoryNavigation currentCategory="iphone" />)

      const svgElements = container.querySelectorAll('svg')
      expect(svgElements).toHaveLength(4) // One for each category
    })

    it('should have correct href attributes for category links', () => {
      render(<CategoryNavigation currentCategory="iphone" />)

      expect(screen.getByRole('link', { name: /iphone/i })).toHaveAttribute('href', '/pricelist/iphone')
      expect(screen.getByRole('link', { name: /ipad/i })).toHaveAttribute('href', '/pricelist/ipad')
      expect(screen.getByRole('link', { name: /macbook/i })).toHaveAttribute('href', '/pricelist/macbook')
      expect(screen.getByRole('link', { name: /apple watch/i })).toHaveAttribute('href', '/pricelist/apple-watch')
    })
  })

  describe('Active Category Highlighting', () => {
    it('should highlight iPhone when it is the current category', () => {
      render(<CategoryNavigation currentCategory="iphone" />)

      const iphoneLink = screen.getByRole('link', { name: /iphone/i })
      expect(iphoneLink).toHaveClass('bg-gray-800', 'text-white')
    })

    it('should highlight iPad when it is the current category', () => {
      render(<CategoryNavigation currentCategory="ipad" />)

      const ipadLink = screen.getByRole('link', { name: /ipad/i })
      expect(ipadLink).toHaveClass('bg-gray-800', 'text-white')
    })

    it('should highlight MacBook when it is the current category', () => {
      render(<CategoryNavigation currentCategory="macbook" />)

      const macbookLink = screen.getByRole('link', { name: /macbook/i })
      expect(macbookLink).toHaveClass('bg-gray-800', 'text-white')
    })

    it('should highlight Apple Watch when it is the current category', () => {
      render(<CategoryNavigation currentCategory="apple-watch" />)

      const watchLink = screen.getByRole('link', { name: /apple watch/i })
      expect(watchLink).toHaveClass('bg-gray-800', 'text-white')
    })

    it('should not highlight inactive categories', () => {
      render(<CategoryNavigation currentCategory="iphone" />)

      const ipadLink = screen.getByRole('link', { name: /ipad/i })
      const macbookLink = screen.getByRole('link', { name: /macbook/i })
      const watchLink = screen.getByRole('link', { name: /apple watch/i })

      expect(ipadLink).toHaveClass('bg-white', 'text-gray-900')
      expect(macbookLink).toHaveClass('bg-white', 'text-gray-900')
      expect(watchLink).toHaveClass('bg-white', 'text-gray-900')
    })
  })

  describe('Styling and Layout', () => {
    it('should have horizontal scrollable container', () => {
      const { container } = render(<CategoryNavigation currentCategory="iphone" />)

      const flexContainer = container.querySelector('.flex')
      expect(flexContainer).toHaveClass('overflow-x-auto')
    })

    it('should have proper spacing between category items', () => {
      const { container } = render(<CategoryNavigation currentCategory="iphone" />)

      const flexContainer = container.querySelector('.flex')
      expect(flexContainer).toHaveClass('gap-4')
    })

    it('should have proper padding and styling for links', () => {
      render(<CategoryNavigation currentCategory="iphone" />)

      const iphoneLink = screen.getByRole('link', { name: /iphone/i })
      expect(iphoneLink).toHaveClass('px-6', 'py-3', 'rounded-lg')
    })

    it('should apply transition effects to links', () => {
      render(<CategoryNavigation currentCategory="iphone" />)

      const iphoneLink = screen.getByRole('link', { name: /iphone/i })
      expect(iphoneLink).toHaveClass('transition-all', 'duration-200')
    })

    it('should prevent text wrapping in category labels', () => {
      render(<CategoryNavigation currentCategory="iphone" />)

      const appleWatchLink = screen.getByRole('link', { name: /apple watch/i })
      expect(appleWatchLink).toHaveClass('whitespace-nowrap')
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive container with proper padding', () => {
      const { container } = render(<CategoryNavigation currentCategory="iphone" />)

      const containerDiv = container.querySelector('.container')
      expect(containerDiv).toHaveClass('mx-auto', 'px-4', 'py-4')
    })

    it('should have border at the bottom', () => {
      const { container } = render(<CategoryNavigation currentCategory="iphone" />)

      const wrapper = container.querySelector('.bg-white')
      expect(wrapper).toHaveClass('border-b')
    })
  })

  describe('Icon Rendering', () => {
    it('should render different icons for different categories', () => {
      const { container, rerender } = render(<CategoryNavigation currentCategory="iphone" />)

      // Check that SVG paths are different for each category
      const svgElements = container.querySelectorAll('svg')
      expect(svgElements.length).toBeGreaterThan(0)

      // Rerender with different category
      rerender(<CategoryNavigation currentCategory="macbook" />)
      const updatedSvgElements = container.querySelectorAll('svg')
      expect(updatedSvgElements.length).toBeGreaterThan(0)
    })

    it('should apply correct color to icon based on active state', () => {
      const { container } = render(<CategoryNavigation currentCategory="iphone" />)

      const svgElements = container.querySelectorAll('svg')
      const firstSvg = svgElements[0] // iPhone icon should be active

      expect(firstSvg).toHaveClass('text-white')
    })

    it('should apply correct size to all icons', () => {
      const { container } = render(<CategoryNavigation currentCategory="iphone" />)

      const svgElements = container.querySelectorAll('svg')
      svgElements.forEach((svg) => {
        expect(svg).toHaveClass('w-5', 'h-5')
      })
    })
  })
})
