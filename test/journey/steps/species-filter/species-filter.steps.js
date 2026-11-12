import { expect } from '@playwright/test'
import { Then, When } from '../../support/fixtures.js'
import { SearchPage } from '../../pages/search.page.js'
import { routes } from '../../content/routes.js'
import { escapeRegExp } from '../../support/text.js'
import { scanPage } from '../../support/a11y.js'

// source: CDC.Web/Pages/SurveillanceProfiles/Search.cshtml:111-152 (species tree: multiple, no cascade, hierarchy exclusive); Pages/ViewSpeciesData.cshtml
const allVersions = 'DisplayPublished=true&DisplayDraft=true&DisplayScenarios=true&SelectedLetter=All&SearchText='

const resultCount = async (page, speciesIds = []) => {
  const query = [allVersions, ...speciesIds.map((id) => `SelectedSpecies=${id}`)].join('&')
  const html = await (await page.request.get(`${routes.search}?${query}`)).text()
  const match = html.match(/<strong>(\d+)<\/strong>\s*disease profile/i)
  if (!match) throw new Error('Search did not return a result count')
  return Number(match[1])
}

const ticked = (page) => page.locator('#species-filter-content input[name="SelectedSpecies"]:checked')
const speciesSelected = (page) => page.getByText(/^Selected:/)
const radio = (page, name) => page.getByRole('radio', { name, exact: true })

When('the applicant ticks the species {string}', async ({ page }, name) => {
  await new SearchPage(page).speciesBox(name).check({ force: true })
})

When('the applicant unticks the species {string}', async ({ page }, name) => {
  await new SearchPage(page).speciesBox(name).uncheck({ force: true })
})

Then('the species {string} is ticked', async ({ page }, name) => {
  await expect(new SearchPage(page).speciesBox(name)).toBeChecked()
})

Then('the species {string} is not ticked', async ({ page }, name) => {
  await expect(new SearchPage(page).speciesBox(name)).not.toBeChecked()
})

Then('the species status reads {string}', async ({ page }, text) => {
  await expect(new SearchPage(page).speciesStatus).toHaveText(text)
})

Then('exactly {int} species is ticked', async ({ page }, count) => {
  await expect(ticked(page)).toHaveCount(count)
})

Then('exactly {int} species are ticked', async ({ page }, count) => {
  await expect(ticked(page)).toHaveCount(count)
})

Then('the result count is the union of the three single species results', async ({ page }) => {
  const searchPage = new SearchPage(page)
  await searchPage.waitForResults()
  const ids = await ticked(page).evaluateAll((els) => els.map((e) => e.value))
  expect(ids).toHaveLength(3)
  const singles = []
  for (const id of ids) singles.push(await resultCount(page, [id]))
  const combined = await searchPage.resultCount()
  expect(combined).toBeGreaterThanOrEqual(Math.max(...singles))
  expect(combined).toBeLessThanOrEqual(singles.reduce((a, b) => a + b, 0))
  expect(combined).toBe(await resultCount(page, ids))
})

When('the applicant chooses the tree toggle named {string}', async ({ page }, name) => {
  const toggle = new SearchPage(page).speciesToggleAll
  await expect(toggle).toContainText(name)
  await toggle.click()
})

Then('the tree toggle is named {string}', async ({ page }, name) => {
  await expect(new SearchPage(page).speciesToggleAll).toContainText(name)
})

When('the applicant hides the affected species filter', async ({ page }) => {
  await page.getByRole('button', { name: /hide filter by affected species/i }).click()
})

Then('the affected species tree is not shown', async ({ page }) => {
  await expect(new SearchPage(page).speciesTree).toBeHidden()
})

When('the applicant chooses the species {string} on the view species data page', async ({ page }, name) => {
  await radio(page, name).check({ force: true })
})

Then('the view species data page reports {string}', async ({ page }, text) => {
  await expect(speciesSelected(page)).toHaveText(text)
})

Then('the view species data page does not report {string}', async ({ page }, text) => {
  await expect(page.getByText(new RegExp(`^Selected:.*${escapeRegExp(text)}`))).toHaveCount(0)
})

When('the applicant opens the data for the chosen species', async ({ page }) => {
  await Promise.all([page.waitForEvent('framenavigated', (frame) => frame === page.mainFrame()), page.getByRole('button', { name: /^view data$/i }).click()])
})

Then('the species data page for {string} is shown', async ({ page }, name) => {
  await expect(page.locator('h1').first()).toHaveText(new RegExp(`^View species data - ${escapeRegExp(name)}$`, 'i'))
  await scanPage(page, {})
})

When('the applicant removes the species selection', async ({ page }) => {
  await page.getByRole('button', { name: /remove selection/i }).click()
})
