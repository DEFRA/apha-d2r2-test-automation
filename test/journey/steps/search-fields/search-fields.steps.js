import { expect } from '@playwright/test'
import { Given, Then, When } from '../../support/fixtures.js'
import { SearchPage } from '../../pages/search.page.js'
import { pages, routes } from '../../content/routes.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'

// source: CDC.Web/Pages/SurveillanceProfiles/Search.cshtml.cs:66-140 (field defaults and option lists), Search.cshtml:32-200
const allVersions = 'DisplayPublished=true&DisplayDraft=true&DisplayScenarios=true&SelectedLetter=All'
const statusLabels = {
  published: /display published versions/i,
  draft: /display draft versions/i,
  scenarios: /display scenarios/i
}
const notes = new WeakMap()
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true, ignorePunctuation: true })
const keyOf = (page) => notes.get(page) ?? notes.set(page, {}).get(page)
const afterNavigation = (page, action) => Promise.all([page.waitForEvent('framenavigated', (frame) => frame === page.mainFrame()), action()])

async function blankCount(page) {
  const response = await page.request.get(`${routes.search}?${allVersions}&SearchText=`)
  const match = (await response.text()).match(/<strong>(\d+)<\/strong>\s*disease profile/i)
  if (!match) throw new Error('Blank search did not return a result count')
  return Number(match[1])
}

async function setStatuses(page, wanted) {
  const searchPage = new SearchPage(page)
  for (const [name, label] of Object.entries(statusLabels)) {
    const box = searchPage.statusCheckbox(label)
    if ((await box.isChecked()) !== wanted[name]) {
      await afterNavigation(page, () => box.setChecked(wanted[name]))
    }
  }
}

async function selectOption(page, locator, label) {
  const current = (await locator.locator('option:checked').innerText()).trim()
  if (current === label) return
  await afterNavigation(page, () => locator.selectOption({ label }))
}

Given('the applicant opens the search page with all version types displayed', async ({ page }) => {
  await page.goto(`${routes.search}?${allVersions}&SearchText=`)
  await expectPageLoaded(page, { heading: pages.search.heading })
})

When('the applicant submits the search form', async ({ page }) => {
  const searchPage = new SearchPage(page)
  await searchPage.submit()
  await searchPage.waitForResults()
})

When('the applicant types {int} characters in the search box', async ({ page }, count) => {
  const searchPage = new SearchPage(page)
  await searchPage.searchInput.pressSequentially('a'.repeat(count))
})

Then('the search box holds {int} characters', async ({ page }, count) => {
  const searchPage = new SearchPage(page)
  await expect(searchPage.searchInput).toHaveValue(new RegExp(`^.{${count}}$`))
})

When('the applicant searches for {int} repeated characters', async ({ page }, count) => {
  const searchPage = new SearchPage(page)
  await searchPage.searchFor('b'.repeat(count))
})

Then('profiles are listed with a result count', async ({ page }) => {
  const searchPage = new SearchPage(page)
  await searchPage.waitForResults()
  expect(await searchPage.resultCount()).toBeGreaterThan(0)
  expect(await searchPage.resultCards.count()).toBeGreaterThan(0)
})

Then('every listed profile title contains {string} ignoring case', async ({ page }, text) => {
  const searchPage = new SearchPage(page)
  await searchPage.waitForResults()
  const titles = await searchPage.resultTitles.allInnerTexts()
  expect(titles.length).toBeGreaterThan(0)
  for (const title of titles) expect(title.toLowerCase()).toContain(text.toLowerCase())
})

Then('no disease profiles match the search', async ({ page }) => {
  const searchPage = new SearchPage(page)
  await expect(searchPage.noResultsMessage).toBeVisible()
  expect(await searchPage.resultCount()).toBe(0)
})

Then('the request is refused with a forbidden page', async ({ page }) => {
  await expect(page).toHaveTitle(/403 forbidden/i)
})

Then('the result count equals that of a blank search', async ({ page }) => {
  const searchPage = new SearchPage(page)
  await searchPage.waitForResults()
  expect(await searchPage.resultCount()).toBe(await blankCount(page))
})

Then('the result count is not greater than that of a blank search', async ({ page }) => {
  const searchPage = new SearchPage(page)
  await searchPage.waitForResults()
  expect(await searchPage.resultCount()).toBeLessThanOrEqual(await blankCount(page))
})

Given('the applicant shows the more filters', async ({ page }) => {
  const searchPage = new SearchPage(page)
  const exact = page.getByRole('checkbox', { name: /this exact word or phrase/i })
  if (!(await exact.isVisible())) await searchPage.moreFiltersToggle.click()
  await expect(exact).toBeVisible()
})

When('the applicant searches for {string} using the {string} option', async ({ page }, text, option) => {
  const searchPage = new SearchPage(page)
  await page.getByRole('checkbox', { name: option }).check()
  await searchPage.searchFor(text)
  await searchPage.waitForResults()
})

When('the applicant searches for {string} appearing in {string}', async ({ page }, text, area) => {
  const searchPage = new SearchPage(page)
  await searchPage.appearsIn.selectOption({ label: area })
  await searchPage.searchFor(text)
  await searchPage.waitForResults()
})

Then('the {string} list shows {string} selected', async ({ page }, list, label) => {
  const select = page.getByLabel(list)
  await expect(select.locator('option:checked')).toHaveText(label)
})

When('the applicant displays only {string} versions', async ({ page }, status) => {
  await setStatuses(page, { published: status === 'published', draft: status === 'draft', scenarios: status === 'scenarios' })
})

When('the applicant displays all version types', async ({ page }) => {
  await setStatuses(page, { published: true, draft: true, scenarios: true })
})

When('the applicant displays no version types', async ({ page }) => {
  await setStatuses(page, { published: false, draft: false, scenarios: false })
})

Then('the status checkboxes show only {string} ticked', async ({ page }, status) => {
  const searchPage = new SearchPage(page)
  for (const [name, label] of Object.entries(statusLabels)) {
    if (name === status) await expect(searchPage.statusCheckbox(label)).toBeChecked()
    else await expect(searchPage.statusCheckbox(label)).not.toBeChecked()
  }
})

When('the applicant notes the result count', async ({ page }) => {
  keyOf(page).count = await new SearchPage(page).resultCount()
})

Then('the result count is not greater than the noted count', async ({ page }) => {
  const searchPage = new SearchPage(page)
  await searchPage.waitForResults()
  expect(await searchPage.resultCount()).toBeLessThanOrEqual(keyOf(page).count)
})

When('the applicant sorts the results by {string}', async ({ page }, label) => {
  await selectOption(page, new SearchPage(page).sortBy, label)
})

Then('the listed titles are in ascending order', async ({ page }) => {
  const titles = await new SearchPage(page).resultTitles.allInnerTexts()
  for (let i = 1; i < titles.length; i++) expect(collator.compare(titles[i - 1], titles[i])).toBeLessThanOrEqual(0)
})

Then('the listed titles are in descending order', async ({ page }) => {
  const titles = await new SearchPage(page).resultTitles.allInnerTexts()
  for (let i = 1; i < titles.length; i++) expect(collator.compare(titles[i - 1], titles[i])).toBeGreaterThanOrEqual(0)
})

When('the applicant shows {string} profiles per page', async ({ page }, size) => {
  await selectOption(page, new SearchPage(page).pageSize, size)
})

Then('at most {string} profiles are listed', async ({ page }, size) => {
  const searchPage = new SearchPage(page)
  await searchPage.waitForResults()
  const shown = await searchPage.resultCards.count()
  if (size === 'All') await expect(searchPage.resultCards).toHaveCount(await searchPage.resultCount())
  else expect(shown).toBeLessThanOrEqual(Number(size))
})

When('the applicant notes the first listed profile', async ({ page }) => {
  keyOf(page).first = await new SearchPage(page).resultTitles.first().innerText()
})

When('the applicant opens the next page of results', async ({ page }) => {
  const searchPage = new SearchPage(page)
  await afterNavigation(page, () => searchPage.pagination.getByRole('link', { name: /next/i }).click())
})

Then('the first listed profile is different from the noted one', async ({ page }) => {
  await expect(new SearchPage(page).resultTitles.first()).not.toHaveText(keyOf(page).first)
})

When('the applicant chooses the letter {string}', async ({ page }, letter) => {
  await afterNavigation(page, () => new SearchPage(page).letterLink(letter).click())
})

Then('every listed profile title begins with {string}', async ({ page }, letter) => {
  const searchPage = new SearchPage(page)
  await searchPage.waitForResults()
  const titles = await searchPage.resultTitles.allInnerTexts()
  expect(titles.length).toBeGreaterThan(0)
  for (const title of titles) expect(title.trim().toLowerCase().startsWith(letter.toLowerCase())).toBe(true)
})

Then('the result is either no profiles or only titles beginning with {string}', async ({ page }, letter) => {
  const searchPage = new SearchPage(page)
  await searchPage.waitForResults()
  const titles = await searchPage.resultTitles.allInnerTexts()
  for (const title of titles) expect(title.trim().toLowerCase().startsWith(letter.toLowerCase())).toBe(true)
})

When('the applicant shows the affected species filter', async ({ page }) => {
  await new SearchPage(page).affectedSpeciesFilterButton.click()
  await expect(page.locator('#species-filter-content')).toBeVisible()
})

When('the applicant selects the first affected species', async ({ page }) => {
  const first = page.locator('#species-filter-content input[name="SelectedSpecies"]').first()
  keyOf(page).species = await page.locator('#species-filter-content label').first().innerText()
  await first.check({ force: true })
})

Then('the selected species is reported as currently selected', async ({ page }) => {
  await expect(page.locator('#species-tree-status')).toContainText(keyOf(page).species.trim())
})

When('the applicant searches with text {string}, only {string} versions, sorted by {string}, {string} per page', async ({ page }, text, status, sort, size) => {
  const searchPage = new SearchPage(page)
  await searchPage.searchFor(text)
  await searchPage.waitForResults()
  await setStatuses(page, { published: status === 'published', draft: status === 'draft', scenarios: status === 'scenarios' })
  await selectOption(page, searchPage.sortBy, sort)
  await selectOption(page, searchPage.pageSize, size)
})
