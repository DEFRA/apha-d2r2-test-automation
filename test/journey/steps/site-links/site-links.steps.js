import { expect } from '@playwright/test'
import { Given, Then, When } from '../../support/fixtures.js'
import { pages, routes } from '../../content/routes.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { escapeRegExp } from '../../support/text.js'

// source: CDC.Web/Views/Shared/_Layout.cshtml (header, menu, footer); Landing/Views/Internal.cshtml; HelpSupport/StaticReports.cshtml
const start = {
  home: () => ({ url: routes.home, heading: pages.home.heading }),
  help: () => ({ url: routes.help, heading: pages.help.heading }),
  Search: () => ({ url: routes.search, heading: pages.search.heading }),
  'General reports': () => ({ url: routes.generalReports, heading: pages.generalReports.heading }),
  'View species data': () => ({ url: routes.viewSpeciesData, heading: pages.viewSpeciesData.heading })
}
const downloads = new WeakMap()
const link = (page, name) => page.getByRole('link', { name: new RegExp(`^${escapeRegExp(name)}$`, 'i') }).first()
const downloadWhile = async (page, action) => {
  const [download] = await Promise.all([page.waitForEvent('download'), action()])
  downloads.set(page, download)
}

Given('the applicant is on the {string} page', async ({ page }, name) => {
  const target = start[name]?.()
  if (!target) throw new Error(`Unknown page "${name}"`)
  await page.goto(target.url)
  await expectPageLoaded(page, { heading: target.heading })
})

When('the applicant chooses the shared link {string}', async ({ page }, name) => {
  const target = link(page, name)
  if (/^skip to main content$/i.test(name)) {
    await target.focus()
    await page.keyboard.press('Enter')
  } else await target.click()
})

Then('the {string} page is displayed', async ({ page }, name) => {
  await expectPageLoaded(page, { heading: start[name]().heading })
})

Then('the address ends with {string}', async ({ page }, suffix) => {
  await expect(page).toHaveURL(new RegExp(`${escapeRegExp(suffix)}$`))
})

Then('the applicant stays on the {string} page', async ({ page }, name) => {
  await expect(page.locator('h1').first()).toContainText(start[name]().heading)
})

When('the applicant chooses the quality statement link', async ({ page }) => {
  await downloadWhile(page, () => link(page, 'D2R2 Quality Statement').click())
})

Then('a document is downloaded', async ({ page }) => {
  expect(downloads.get(page).suggestedFilename().length).toBeGreaterThan(0)
})

Then('the APHA logo links to the APHA intranet', async ({ page }) => {
  await expect(page.locator('a[href*="APHAIntranet"]').first()).toHaveAttribute('href', /defra\.sharepoint\.com\/sites\/APHAIntranet/)
})

When('the applicant chooses the header help icon', async ({ page }) => {
  await page.getByRole('banner').getByRole('link', { name: /help using d2r2/i }).first().click()
})

When('the applicant opens the header menu', async ({ page }) => {
  const panel = page.locator('#app-menu-panel')
  if (!(await panel.isVisible())) await page.locator('#app-menu-toggle').click()
  await expect(panel).toBeVisible()
})

Then('the header menu offers {string}, {string}, {string} and {string}', async ({ page }, a, b, c, d) => {
  for (const name of [a, b, c, d]) await expect(page.locator('#app-menu-panel').getByRole('link', { name }).first()).toBeVisible()
})

When('the applicant chooses the menu link {string}', async ({ page }, name) => {
  await page.locator('#app-menu-panel').getByRole('link', { name }).first().click()
})

When('the applicant chooses the first manual', async ({ page }) => {
  await downloadWhile(page, () => page.locator('a[href*="/static-reports/versions/"]').first().click())
})

When('the applicant chooses the first report', async ({ page }) => {
  await downloadWhile(page, () => page.locator('a[href*="/static-reports/versions/"]').first().click())
})

When('the applicant chooses the first version in the history', async ({ page }) => {
  await downloadWhile(page, () => page.locator('a[href*="/static-reports/versions/"]').first().click())
})

Then('the help page offers the email link {string}', async ({ page }, address) => {
  await expect(page.getByRole('link', { name: address })).toHaveAttribute('href', new RegExp(`^mailto:${escapeRegExp(address)}`, 'i'))
})
