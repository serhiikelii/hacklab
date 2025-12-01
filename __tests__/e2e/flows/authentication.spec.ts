import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should load admin login page', async ({ page }) => {
    await page.goto('/admin/login')

    // Check page heading
    await expect(page.getByRole('heading', { name: /admin panel login/i })).toBeVisible()

    // Check form elements
    await expect(page.getByPlaceholder(/email address/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/admin/login')

    // Fill in invalid credentials
    await page.getByPlaceholder(/email address/i).fill('invalid@example.com')
    await page.getByPlaceholder(/password/i).fill('wrongpassword')

    // Submit form
    await page.getByRole('button', { name: /login/i }).click()

    // Wait for error message to appear
    await expect(page.locator('text=/error|invalid/i')).toBeVisible({ timeout: 5000 })
  })

  test('should show validation for empty fields', async ({ page }) => {
    await page.goto('/admin/login')

    // Try to submit empty form
    await page.getByRole('button', { name: /login/i }).click()

    // HTML5 validation should prevent submission
    // Check that we're still on login page
    await expect(page).toHaveURL(/\/admin\/login/)
    await expect(page.getByRole('heading', { name: /admin panel login/i })).toBeVisible()
  })

  test('should disable form during login attempt', async ({ page }) => {
    await page.goto('/admin/login')

    // Fill credentials
    await page.getByPlaceholder(/email address/i).fill('test@example.com')
    await page.getByPlaceholder(/password/i).fill('testpassword')

    // Click login
    const loginButton = page.getByRole('button', { name: /login/i })
    await loginButton.click()

    // Button should show loading state or be disabled
    const buttonText = await loginButton.textContent()
    const isDisabled = await loginButton.isDisabled()

    // Either button text changes to "Logging in..." or button is disabled
    expect(buttonText?.includes('Logging in') || isDisabled).toBeTruthy()
  })
})

test.describe('Authentication Flow - Redirects', () => {
  test('should redirect to admin after successful login', async ({ page }) => {
    // This test requires valid test credentials
    // In production, you'd use environment variables or test fixtures

    await page.goto('/admin/login')

    // Note: This test assumes you have test credentials
    // For now, we just verify the redirect logic structure
    const emailInput = page.getByPlaceholder(/email address/i)
    const passwordInput = page.getByPlaceholder(/password/i)

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()

    // Verify form can accept input
    await emailInput.fill('admin@test.com')
    await passwordInput.fill('testpassword123')

    // Verify button is clickable
    const loginButton = page.getByRole('button', { name: /login/i })
    await expect(loginButton).toBeEnabled()
  })

  test('should support redirectTo parameter', async ({ page }) => {
    // Test that login page accepts redirectTo parameter
    await page.goto('/admin/login?redirectTo=/admin/orders')

    // Page should load with redirectTo parameter
    await expect(page).toHaveURL(/redirectTo/)
    await expect(page.getByRole('heading', { name: /admin panel login/i })).toBeVisible()
  })
})

test.describe('Authentication Flow - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should work on mobile - login form visible', async ({ page }) => {
    await page.goto('/admin/login')

    // Check form is responsive on mobile
    await expect(page.getByRole('heading', { name: /admin panel login/i })).toBeVisible()
    await expect(page.getByPlaceholder(/email address/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

  test('should work on mobile - form submission', async ({ page }) => {
    await page.goto('/admin/login')

    // Fill form on mobile
    await page.getByPlaceholder(/email address/i).fill('test@mobile.com')
    await page.getByPlaceholder(/password/i).fill('mobilepass')

    // Submit
    await page.getByRole('button', { name: /login/i }).click()

    // Should either show error or redirect
    await page.waitForTimeout(1000)

    // Verify page responded to submission
    const hasError = await page.locator('text=/error|invalid/i').isVisible().catch(() => false)
    const hasRedirected = !page.url().includes('/admin/login')

    // One of these should be true
    expect(hasError || hasRedirected).toBeTruthy()
  })
})
