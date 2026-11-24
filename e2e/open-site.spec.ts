import { expect, test } from '@playwright/test'

/**
 * The acceptance page used to stop every signed-in reader, including older
 * accounts with no user_legal_consents row. These checks use an account that
 * has no consent row. E2E_EMAIL and E2E_PASSWORD identify that account.
 */
const paths = ['/', '/treatise/chapter-4', '/chat']
const gate = /I am 18 or over|accept them before you continue|Could not save your acceptance|Tick the box to agree/

test.describe('signed out', () => {
  for (const path of paths) {
    test(`${path} loads with no acceptance gate`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status(), path).toBeLessThan(400)
      expect(page.url()).not.toContain('/accept-terms')
      await expect(page.getByText(gate)).toHaveCount(0)
    })
  }
})

test.describe('signed-in account with no consent row', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.E2E_EMAIL
    const password = process.env.E2E_PASSWORD
    expect(email, 'E2E_EMAIL is an older account with no consent row').toBeTruthy()
    expect(password, 'E2E_PASSWORD').toBeTruthy()
    await page.context().clearCookies()
    await page.goto('/sign-in')
    await page.waitForLoadState('networkidle')
    await page.locator('input[name="email"]').fill(email || '')
    await page.locator('input[name="password"]').fill(password || '')
    await Promise.all([
      page.waitForResponse(response => response.url().includes('/auth/v1/token') && response.ok(), { timeout: 30_000 }),
      page.getByRole('button', { name: 'Sign In' }).click()
    ])
    await page.waitForFunction(() => document.cookie.includes('-auth-token'), null, { timeout: 15_000 })
    expect(page.url()).not.toContain('/accept-terms')
  })

  for (const path of paths) {
    test(`${path} loads with no acceptance gate`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status(), path).toBeLessThan(400)
      expect(page.url()).not.toContain('/accept-terms')
      await expect(page.getByText(gate)).toHaveCount(0)
      await expect(page.getByRole('heading', { name: 'Terms and privacy' })).toHaveCount(0)
      await expect(page.getByRole('link', { name: 'Sign in' })).toHaveCount(0)
      if (process.env.E2E_SHOTS && (path === '/' || path === '/treatise/chapter-4')) {
        await page.screenshot({
          path: path === '/' ? '/opt/cursor/artifacts/open-home.png' : '/opt/cursor/artifacts/open-treatise.png',
          fullPage: false
        })
      }
    })
  }
})
