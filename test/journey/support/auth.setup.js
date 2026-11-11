import fs from 'node:fs'
import path from 'node:path'
import { test as setup, expect } from '@playwright/test'
import { credentials, uiBaseUrl } from './env.js'
import { CookieBanner } from '../components/cookie-banner.js'
import { auth as authLabels, cookieBanner as cookieBannerLabels } from '../content/labels.js'

/**
 * Logs in once and saves the session to .auth/user.json.
 * The journey project reuses that state, so scenarios never re-authenticate.
 */
const AUTH_DIR = '.auth'
const STATE_FILE = 'user.json'

{
  setup('authenticate', async ({ page }) => {
    fs.mkdirSync(AUTH_DIR, { recursive: true })
    const { username, password } = credentials()

    await page.goto(`${uiBaseUrl()}/Home.aspx`)
    // The GOV.UK cookie banner appears on a first visit and would cover the sign-in form.
    await new CookieBanner(page, cookieBannerLabels).dismissIfPresent()

    // This service uses SSO, so the current Windows session authenticates automatically.
    if (!username && !password) {
      setup.info().annotations.push({ type: 'auth', description: `used the current Windows session at ${uiBaseUrl()}` })
      await page.context().storageState({ path: path.join(AUTH_DIR, STATE_FILE) })
      return
    }

    // Microsoft Entra sign-in: email, Next, password, Sign in, then "Stay signed in?".
    await page.getByPlaceholder(authLabels.username).fill(username)
    await page.getByRole('button', { name: authLabels.next }).click()
    await page.getByPlaceholder(authLabels.password).fill(password)
    await page.getByRole('button', { name: authLabels.submit }).click()
    const staySignedIn = page.getByRole('button', { name: authLabels.staySignedInNo })
    await staySignedIn.click({ timeout: 10_000 }).catch(() => {})

    await page.waitForURL((url) => url.origin === new URL(uiBaseUrl()).origin, { timeout: 60_000 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    setup.info().annotations.push({ type: 'auth', description: `signed in at ${uiBaseUrl()}` })

    await page.context().storageState({ path: path.join(AUTH_DIR, STATE_FILE) })
  })
}
