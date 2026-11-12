import { expect } from '@playwright/test'
import { Given, Then, When } from '../../support/fixtures.js'
import { pages, routes } from '../../content/routes.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { escapeRegExp } from '../../support/text.js'

// source: CDC.Web/Pages/Reports/General.cshtml:10-97 (SortableHeader, PageSize select, History link); same table on HelpSupport/StaticReports
const tables = {
  'General reports': { route: () => routes.generalReports, heading: () => pages.generalReports.heading },
  'Help Using D2R2': { route: () => routes.help, heading: () => pages.help.heading }
}
const lastItemsPerPage = new WeakMap()

Given('the applicant opens the {string} report table', async ({ page }, name) => {
  const table = tables[name]
  if (!table) throw new Error(`Unknown report table "${name}"`)
  await page.goto(table.route())
  await expectPageLoaded(page, { heading: table.heading() })
})

When('the applicant sorts the report table by {string}', async ({ page }, column) => {
  const header = page.getByRole('columnheader', { name: new RegExp(`^${escapeRegExp(column)}`) })
  await header.getByRole('link').click()
})

Then('the {string} column is marked as sorted', async ({ page }, column) => {
  const header = page.getByRole('columnheader', { name: new RegExp(`^${escapeRegExp(column)}`) })
  await expect(header).toHaveAttribute('aria-sort', /ascending|descending/)
})

When('the applicant opens the history of the first report', async ({ page }) => {
  await page.getByRole('link', { name: /^history/i }).first().click()
})

Then('the report history page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: 'History for' })
})

When('the applicant chooses the last items per page option', async ({ page }) => {
  const select = page.getByLabel(/items per page/i)
  const value = await select.locator('option').last().getAttribute('value')
  lastItemsPerPage.set(page, value)
  await select.selectOption(value)
})

Then('the items per page option stays selected', async ({ page }) => {
  await expect(page.getByLabel(/items per page/i)).toHaveValue(lastItemsPerPage.get(page))
})
