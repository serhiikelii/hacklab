import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')

    // Check page title
    await expect(page).toHaveTitle(/MojService/i)
  })

  test('should display main navigation', async ({ page }) => {
    await page.goto('/')

    // Check for navigation elements
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should display service categories', async ({ page }) => {
    await page.goto('/')

    // Check for category links (iPhone, iPad, Apple Watch, MacBook)
    await expect(page.getByText(/iPhone/i).first()).toBeVisible()
  })

  test('should navigate to price list', async ({ page }) => {
    await page.goto('/')

    // Look for price list link
    const priceLink = page.getByRole('link', { name: /price/i }).first()

    if (await priceLink.isVisible()) {
      await priceLink.click()
      await expect(page).toHaveURL(/\/prices/)
    }
  })
})

test.describe('Homepage - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/')

    // Check that page loads and has content
    await expect(page).toHaveTitle(/MojService/i)

    // Check for mobile-friendly content
    await expect(page.getByText(/iPhone/i).first()).toBeVisible()

    // Check mobile menu (hamburger) is visible and clickable
    const hamburgerButton = page.locator('button.lg\\:hidden').first()
    await expect(hamburgerButton).toBeVisible()

    // Verify button is interactive (has Menu icon)
    await expect(hamburgerButton.locator('svg')).toBeVisible()
  })
})
