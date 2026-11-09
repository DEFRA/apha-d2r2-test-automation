import fs from 'node:fs'
import path from 'node:path'
import { test as setup, expect } from '@playwright/test'
import { credentials, roles, uiBaseUrl } from './env.js'
import { CookieBanner } from '../components/cookie-banner.js'
import { auth as authLabels, cookieBanner as cookieBannerLabels } from '../content/labels.js'

/**
 * Logs in once per role and saves the session to .auth/<role>.json.
 * The journey projects reuse that state, so scenarios never re-authenticate.
 * `@role:<name>` tags are documentation; the project supplies the state.
 */
const AUTH_DIR = '.auth'

for (const role of roles()) {
  if (role === 'anonymous') {
    continue
  }

  setup(`authenticate as ${role}`, async ({ page }) => {
    fs.mkdirSync(AUTH_DIR, { recursive: true })
    const { username, password } = credentials(role)

    await page.goto(`${uiBaseUrl()}/Home.aspx`)
    // The GOV.UK cookie banner appears on a first visit and would cover the sign-in form.
    await new CookieBanner(page, cookieBannerLabels).dismissIfPresent()

    // This service uses SSO, so the current Windows session authenticates automatically.
    if (role === 'sso' && !username && !password) {
      setup.info().annotations.push({ type: 'auth', description: `${role} used the current Windows session at ${uiBaseUrl()}` })
      await page.context().storageState({ path: path.join(AUTH_DIR, `${role}.json`) })
      return
    }

    // CHANGE-ME: replace with this service's real sign-in journey.
    await page.getByLabel(authLabels.username).fill(username)
    await page.getByLabel(authLabels.password).fill(password)
    await page.getByRole('button', { name: authLabels.submit }).click()

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    setup.info().annotations.push({ type: 'auth', description: `${role} signed in at ${uiBaseUrl()}` })

    await page.context().storageState({ path: path.join(AUTH_DIR, `${role}.json`) })
  })
}
