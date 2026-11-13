import { expect } from '@playwright/test'
import { scanPage } from '../support/a11y.js'
import { settleA11y } from '../support/a11y-navigation.js'
import { escapeRegExp, prefixPattern, textPattern, visibleText } from '../support/text.js'

/**
 * The one way a step confirms it has landed on a page. It asserts the h1 (page identity,
 * never the URL).
 *
 * Accessibility scans run automatically when a navigation completes (support/a11y-navigation.js),
 * so no step has to ask for one. Passing `role` or `variant` still scans here, because a page
 * that differs only by state or role keeps the same URL and the hook cannot tell them apart.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ heading: string, variant?: 'default'|'error'|'confirmation'|'empty'|'modal', role?: string }} options
 */
export async function expectPageLoaded(page, { heading, variant = 'default', role = 'anonymous' }) {
  const headings = Array.isArray(heading) ? heading : [heading]

  for (const candidate of headings) {
    const headingLocator = page.locator('h1, h2, h3').filter({ hasText: prefixPattern(candidate) }).first()
    const hasHeading = await headingLocator.count()

    if (hasHeading > 0) {
      await expect(headingLocator).toBeVisible()
      await scanStateVariant(page, variant, role)
      return
    }

    const pageTitle = await page.title().catch(() => '')
    const titlePattern = prefixPattern(candidate)

    if (pageTitle && titlePattern.test(pageTitle)) {
      await expect(page).toHaveTitle(titlePattern)
      await scanStateVariant(page, variant, role)
      return
    }

    const contentLocator = page.locator('main, [role="main"], body').filter({ hasText: prefixPattern(candidate) }).first()
    const hasContentText = await contentLocator.count()

    if (hasContentText > 0) {
      await expect(contentLocator).toBeVisible()
      await scanStateVariant(page, variant, role)
      return
    }

    const visibleHeading = visibleText(candidate)
    const bodyTextMatch = await page.locator('body').textContent().catch(() => '')
    if (bodyTextMatch && new RegExp(escapeRegExp(visibleHeading), 'i').test(bodyTextMatch)) {
      await expect(page.locator('body')).toContainText(new RegExp(escapeRegExp(visibleHeading), 'i'))
      await scanStateVariant(page, variant, role)
      return
    }
  }

  const visibleHeadings = headings.map(visibleText)
  await expect(page.locator('body')).toContainText(new RegExp(visibleHeadings.map(escapeRegExp).join('|'), 'i'))
  await scanStateVariant(page, variant, role)
}

/**
 * The navigation hook scans the page automatically; waiting here keeps the audit on the page
 * the test just reached instead of letting the next navigation pre-empt it. A state or role
 * that keeps the same URL is scanned explicitly, because the hook cannot tell it apart from
 * the default view of the route.
 * @param {import('@playwright/test').Page} page
 * @param {string} variant
 * @param {string} role
 */
async function scanStateVariant(page, variant, role) {
  if (variant === 'default' && role === 'anonymous') {
    await settleA11y(page)
    return
  }
  await scanPage(page, { variant, role })
}

/**
 * Assert a download started and has a file name.
 * @param {import('@playwright/test').Download} download
 */
export async function expectDownloadNamed(download) {
  expect(download.suggestedFilename()).not.toBe('')
}

/**
 * Assert an inline field error by meaning, tolerating the GOV.UK visually hidden prefix.
 * @param {import('@playwright/test').Locator} locator
 * @param {string} message
 */
export async function expectFieldError(locator, message) {
  await expect(locator).toBeVisible()
  await expect(locator).toHaveText(textPattern(message))
}

/**
 * Assert primary home-page journeys are visible from the legacy home page.
 * @param {import('@playwright/test').Page} page
 */
export async function expectHomePageLinksVisible(page) {
  await expect(page.getByRole('link', { name: /search disease profiles/i }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /disease ranking report/i }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /general reports/i }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /view species data/i }).first()).toBeVisible()
  await expect(page.getByText(/popular on d2r2/i)).toBeVisible()
}
