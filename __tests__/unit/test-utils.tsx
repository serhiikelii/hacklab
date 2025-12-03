import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'
import { LocaleProvider } from '@/contexts/LocaleContext'

// Mock LocaleContext for testing
export const mockLocaleContext = {
  locale: 'en' as const,
  setLocale: vi.fn(),
}

// Custom render function that wraps with providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <LocaleProvider>{children}</LocaleProvider>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react'
