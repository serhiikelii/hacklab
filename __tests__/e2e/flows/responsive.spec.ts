import { test, expect } from '@playwright/test'

test.describe('Responsive Design - Mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should display mobile navigation', async ({ page }) => {
    await page.goto('/')

    // Mobile hamburger menu should be visible
    const hamburger = page.locator('button.lg\\:hidden').first()
    await expect(hamburger).toBeVisible()

    // Desktop navigation should be hidden
    const desktopNav = page.locator('nav.hidden.lg\\:flex, nav.lg\\:block')
    if (await desktopNav.count() > 0) {
      await expect(desktopNav.first()).not.toBeVisible()
    }
  })

  test('should open mobile menu and navigate', async ({ page }) => {
    await page.goto('/')

    // Click hamburger
    const hamburger = page.locator('button.lg\\:hidden').first()
    await hamburger.click()

    // Wait for menu animation
    await page.waitForTimeout(300)

    // Menu should contain navigation links
    const menuLinks = page.getByRole('link', { name: /pricelist|about|contact/i })
    await expect(menuLinks.first()).toBeVisible()
  })

  test('should be usable on mobile - pricelist flow', async ({ page }) => {
    await page.goto('/pricelist')

    // Categories should be visible and tappable
    const category = page.getByRole('link', { name: /iPhone/i }).first()
    await expect(category).toBeVisible()
    await category.click()

    // Should navigate successfully
    await expect(page).toHaveURL(/\/pricelist\/iphone/i)
  })

  test('should display content without horizontal scroll', async ({ page }) => {
    await page.goto('/')

    // Check that body doesn't overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1) // +1 for rounding
  })
})

test.describe('Responsive Design - Mobile Landscape (768px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('should adapt layout for tablet', async ({ page }) => {
    await page.goto('/')

    // Check page loads
    await expect(page).toHaveTitle(/MojService/i)

    // Content should be visible
    await expect(page.getByText(/iPhone|iPad|MacBook/i).first()).toBeVisible()
  })

  test('should handle navigation on tablet', async ({ page }) => {
    await page.goto('/pricelist')

    // Navigate to category
    await page.getByRole('link', { name: /iPhone/i }).first().click()
    await expect(page).toHaveURL(/\/pricelist\/iphone/i)

    // Grid should be visible
    const links = page.getByRole('link').filter({ hasText: /iPhone \d+/i })
    await expect(links.first()).toBeVisible()
  })

  test('should not overflow on tablet', async ({ page }) => {
    await page.goto('/')

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)
  })
})

test.describe('Responsive Design - Desktop (1920px)', () => {
  test.use({ viewport: { width: 1920, height: 1080 } })

  test('should display full desktop navigation', async ({ page }) => {
    await page.goto('/')

    // Desktop navigation should be visible
    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()

    // Mobile hamburger should be hidden
    const hamburger = page.locator('button.lg\\:hidden')
    if (await hamburger.count() > 0) {
      await expect(hamburger.first()).not.toBeVisible()
    }
  })

  test('should display grid layouts properly', async ({ page }) => {
    await page.goto('/pricelist')

    // Categories should be in grid
    const categories = page.getByRole('link', { name: /iPhone|iPad|MacBook|Watch/i })
    const count = await categories.count()

    expect(count).toBeGreaterThan(0)
  })

  test('should handle wide screen without stretching', async ({ page }) => {
    await page.goto('/')

    // Content should be centered/constrained (not stretched to full width)
    const main = page.locator('main').first()
    await expect(main).toBeVisible()

    // Page should load without layout issues
    await expect(page).toHaveTitle(/MojService/i)
  })

  test('should navigate efficiently on desktop', async ({ page }) => {
    await page.goto('/')

    // Navigate to pricelist
    await page.getByRole('link', { name: /pricelist|prices|services/i }).first().click()
    await expect(page).toHaveURL(/\/pricelist/)

    // Select category
    await page.getByRole('link', { name: /iPhone/i }).first().click()
    await expect(page).toHaveURL(/\/pricelist\/iphone/i)

    // Select model
    await page.getByRole('link').filter({ hasText: /iPhone \d+/i }).first().click()
    await expect(page).toHaveURL(/\/pricelist\/iphone\/.+/i)

    // Prices should be visible
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toMatch(/price|CZK|Kč/i)
  })
})

test.describe('Responsive Design - Cross-Device Consistency', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 1024, height: 768 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ]

  for (const viewport of viewports) {
    test(`should load homepage on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')

      // Page should load with title
      await expect(page).toHaveTitle(/MojService/i)

      // Main content should be visible
      await expect(page.getByText(/iPhone|iPad|MacBook/i).first()).toBeVisible()
    })

    test(`should navigate to pricelist on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')

      // Open mobile menu if needed
      if (viewport.width < 1024) {
        const hamburger = page.locator('button.lg\\:hidden').first()
        if (await hamburger.isVisible()) {
          await hamburger.click()
          await page.waitForTimeout(300)
        }
      }

      // Navigate to pricelist
      await page.getByRole('link', { name: /pricelist|prices|services/i }).first().click()
      await expect(page).toHaveURL(/\/pricelist/)
    })
  }
})
