import { activeCdpPort, cdpBasePort } from './a11y-cdp.js'

/**
 * Lighthouse for every page the tests audit.
 *
 * Lighthouse runs next to axe on the same settled page, but against its own tab in the
 * Playwright browser: `playwright.config.js` starts Chromium with
 * `--remote-debugging-port`, and Lighthouse attaches to that port instead of launching a
 * second Chrome. That second launch is what fails on locked-down machines and CI images.
 *
 * Lighthouse's tab has none of the Playwright context's cookies, so the session is passed
 * as a `Cookie` header. Without it every authenticated page would be audited as the sign-in
 * or error page.
 *
 * Environment:
 *   A11Y_LIGHTHOUSE                     on by default; set false (or 0) to skip Lighthouse
 *   A11Y_CDP_PORT=9222                  first port of the per-worker range
 *   A11Y_LIGHTHOUSE_FORM_FACTOR=desktop | mobile (default mobile, as the library does)
 */

export const lighthouseEnabled = () => {
  const value = (process.env.A11Y_LIGHTHOUSE ?? 'true').trim().toLowerCase()
  return value !== 'false' && value !== '0'
}

/**
 * Port of this worker's browser: the base plus the worker index set at launch. Falls back to
 * the base when nothing was recorded, e.g. a browser launched outside the shared fixture.
 */
export const cdpPort = () => activeCdpPort() || cdpBasePort()

/**
 * Cookie header for the page's origin, so Lighthouse audits the signed-in view.
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @returns {Promise<Record<string, string> | undefined>}
 */
export async function sessionHeaders (page, url) {
  const cookies = await page.context().cookies(url).catch(() => [])
  if (cookies.length === 0) return undefined
  return { Cookie: cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ') }
}

/**
 * Options `analyse()` hands to its Lighthouse run: this worker's browser port, the session
 * cookies, and the form factor.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 */
export async function lighthouseOptions (page, url) {
  return {
    port: cdpPort(),
    extraHeaders: await sessionHeaders(page, url),
    formFactor: process.env.A11Y_LIGHTHOUSE_FORM_FACTOR === 'desktop' ? 'desktop' : 'mobile'
  }
}
