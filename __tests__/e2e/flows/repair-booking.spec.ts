import { test, expect } from '@playwright/test'

test.describe('Repair Booking Flow', () => {
  test('should navigate from homepage to device category', async ({ page }) => {
    await page.goto('/')

    // Click on pricelist/services navigation
    const pricelistLink = page.getByRole('link', { name: /pricelist|prices|services/i }).first()
    await pricelistLink.click()

    // Should navigate to pricelist page
    await expect(page).toHaveURL(/\/pricelist/)

    // Check that device categories are displayed
    await expect(page.getByText(/iPhone|iPad|MacBook|Apple Watch/i).first()).toBeVisible()
  })

  test('should select device category and see models', async ({ page }) => {
    await page.goto('/pricelist')

    // Click on iPhone category
    const iphoneCategory = page.getByRole('link', { name: /iPhone/i }).first()
    await iphoneCategory.click()

    // Should navigate to iPhone models page
    await expect(page).toHaveURL(/\/pricelist\/iphone/i)

    // Check that iPhone models are displayed
    await expect(page.locator('body')).toContainText(/iPhone/i)
  })

  test('should select device model and see repair services', async ({ page }) => {
    await page.goto('/pricelist')

    // Navigate to iPhone category
    await page.getByRole('link', { name: /iPhone/i }).first().click()
    await expect(page).toHaveURL(/\/pricelist\/iphone/i)

    // Click on first available iPhone model
    const firstModel = page.getByRole('link').filter({ hasText: /iPhone \d+/i }).first()
    await firstModel.click()

    // Should navigate to model-specific page with services
    await expect(page).toHaveURL(/\/pricelist\/iphone\/.+/i)

    // Check that repair services/prices are displayed
    await expect(page.locator('body')).toContainText(/price|repair|service/i)
  })

  test('should display service prices for selected model', async ({ page }) => {
    await page.goto('/pricelist')

    // Navigate through: Pricelist -> iPhone -> Model
    await page.getByRole('link', { name: /iPhone/i }).first().click()
    const modelLink = page.getByRole('link').filter({ hasText: /iPhone \d+/i }).first()
    await modelLink.click()

    // Wait for service table to load
    await page.waitForSelector('table, [role="table"], .price', { timeout: 5000 }).catch(() => {
      // If no table, check for any price display
      return page.waitForSelector('text=/\\d+.*CZK|Kč/i', { timeout: 5000 })
    })

    // Verify prices are shown (either in table or text format)
    const hasPrices = await page.locator('body').textContent()
    expect(hasPrices).toMatch(/\d+.*(?:CZK|Kč|€)/i)
  })

  test('should show repair booking form or contact info', async ({ page }) => {
    await page.goto('/pricelist')

    // Navigate to a specific model page
    await page.getByRole('link', { name: /iPhone/i }).first().click()
    await page.getByRole('link').filter({ hasText: /iPhone \d+/i }).first().click()

    // Look for booking/contact elements
    const hasBookingButton = await page.getByRole('button', { name: /book|order|contact|repair/i }).count()
    const hasContactInfo = await page.locator('text=/email|phone|contact/i').count()

    // At least one of these should be present
    expect(hasBookingButton + hasContactInfo).toBeGreaterThan(0)
  })
})

test.describe('Repair Booking Flow - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should work on mobile - navigate to category', async ({ page }) => {
    await page.goto('/')

    // Open mobile menu if needed
    const hamburger = page.locator('button.lg\\:hidden').first()
    if (await hamburger.isVisible()) {
      await hamburger.click()
      await page.waitForTimeout(300) // Wait for menu animation
    }

    // Navigate to pricelist
    await page.getByRole('link', { name: /pricelist|prices|services/i }).first().click()
    await expect(page).toHaveURL(/\/pricelist/)
  })

  test('should work on mobile - select device and model', async ({ page }) => {
    await page.goto('/pricelist')

    // Select category
    await page.getByRole('link', { name: /iPhone/i }).first().click()
    await expect(page).toHaveURL(/\/pricelist\/iphone/i)

    // Select model
    await page.getByRole('link').filter({ hasText: /iPhone \d+/i }).first().click()
    await expect(page).toHaveURL(/\/pricelist\/iphone\/.+/i)

    // Verify content is displayed on mobile
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toMatch(/price|repair|service/i)
  })
})
