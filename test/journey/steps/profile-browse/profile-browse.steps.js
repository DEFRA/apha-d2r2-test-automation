import { expect } from '@playwright/test'
import { Then, When, Given } from '../../support/fixtures.js'
import { SearchPage } from '../../pages/search.page.js'
import { routes } from '../../content/routes.js'
import { escapeRegExp } from '../../support/text.js'
import { scanPage } from '../../support/a11y.js'

// source: CDC.Web/Pages/SurveillanceProfiles/_SearchResults.cshtml:67-147, ProfileReports.cshtml, EditProfileQuestions.cshtml, EditSpecies.cshtml; observed live
const allVersions = 'DisplayPublished=true&DisplayDraft=true&DisplayScenarios=true&SelectedLetter=All'
const downloads = new WeakMap()
const startsWith = (text) => new RegExp(`^${escapeRegExp(text)}`)

const firstProfile = (page) => page.locator('.app-profile-card').filter({ has: page.getByRole('heading', { level: 3, name: /^African Horse Sickness \(AHS\)$/ }) }).first()
const pagination = (page) => page.getByRole('navigation', { name: /search results pages/i })
const sectionButton = (page, name) => page.getByRole('button', { name: startsWith(name) }).first()
const sectionButtons = (page) => page.locator('button[aria-expanded]').filter({ hasText: /^\d+\.\d+ / })
const tab = (page, name) => page.getByRole('button', { name, exact: true }).or(page.getByRole('link', { name, exact: true })).first()

Given('the applicant opens the search results for {string}', async ({ page }, text) => {
  await page.goto(`${routes.search}?${allVersions}&SearchText=${encodeURIComponent(text)}`)
  await new SearchPage(page).waitForResults()
})

Then('the first profile shows its current published version, its status and the View reports and Browse profile links', async ({ page }) => {
  const card = firstProfile(page)
  await expect(card).toContainText(/Published current version:/)
  await expect(card).toContainText(/Profile Status:/)
  await expect(card.getByRole('link', { name: 'View reports' }).first()).toBeVisible()
  await expect(card.getByRole('link', { name: 'Browse profile' }).first()).toBeVisible()
})

When('the applicant shows the previous versions of the first profile', async ({ page }) => {
  await firstProfile(page).getByRole('button', { name: 'Show previous versions' }).first().click()
})

Then('the previous versions are listed with their View reports and Browse profile links', async ({ page }) => {
  const card = firstProfile(page)
  await expect(card.getByRole('button', { name: 'Hide previous versions' }).first()).toBeVisible()
  await expect(card.getByText(/Version \d+\.\d+/).first()).toBeVisible()
  expect(await card.getByRole('link', { name: 'View reports' }).count()).toBeGreaterThan(1)
  expect(await card.getByRole('link', { name: 'Browse profile' }).count()).toBeGreaterThan(1)
})

When('the applicant hides the previous versions of the first profile', async ({ page }) => {
  await firstProfile(page).getByRole('button', { name: 'Hide previous versions' }).first().click()
})

Then('the previous versions are not listed', async ({ page }) => {
  const card = firstProfile(page)
  await expect(card.getByRole('button', { name: 'Show previous versions' }).first()).toBeVisible()
  await expect(card.getByText(/Version \d+\.\d+/).first()).toBeHidden()
})

When('the applicant opens View reports for the first profile', async ({ page }) => {
  await firstProfile(page).getByRole('link', { name: 'View reports' }).first().click()
})

When('the applicant opens Browse profile for the first profile', async ({ page }) => {
  await firstProfile(page).getByRole('link', { name: 'Browse profile' }).first().click()
})

Then('the profile reports page is shown for {string}', async ({ page }, name) => {
  await expect(page.locator('h1').first()).toContainText(`Profile reports for ${name}`)
})

Then('the browse page is shown for {string}', async ({ page }, name) => {
  await expect(page.locator('h1').first()).toHaveText(name)
})

When('the applicant chooses Next page of the results', async ({ page }) => {
  await pagination(page).getByRole('link', { name: /next page/i }).click()
})

When('the applicant chooses Previous page of the results', async ({ page }) => {
  await pagination(page).getByRole('link', { name: /previous page/i }).click()
})

Then('page {string} of the results is current', async ({ page }, number) => {
  await expect(pagination(page).locator('[aria-current="page"]')).toHaveText(number)
})

Then('the profile reports page lists {string}, {string} and {string}', async ({ page }, a, b, c) => {
  for (const name of [a, b, c]) await expect(page.getByRole('link', { name })).toBeVisible()
})

Then('the profile reports page explains how to request access with the email link {string}', async ({ page }, address) => {
  await expect(page.locator('main')).toContainText(/request permission to view disease scenarios/i)
  await expect(page.getByRole('link', { name: address })).toHaveAttribute('href', new RegExp(`^mailto:${escapeRegExp(address)}`, 'i'))
})

When('the applicant downloads the {string} report', async ({ page }, report) => {
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('link', { name: report }).click()])
  downloads.set(page, download)
})

Then('the downloaded file is named {string}', async ({ page }, file) => {
  expect(downloads.get(page).suggestedFilename()).toBe(file)
})

When('the applicant chooses Browse disease profile', async ({ page }) => {
  await page.getByRole('link', { name: /browse disease profile/i }).click()
})

Then('the browse page shows the version, the tabs {string}, {string} and {string} and Show all sections', async ({ page }, a, b, c) => {
  await expect(page.getByText(/Version \d+\.\d+ \((Published|Draft)\)/).first()).toBeVisible()
  for (const name of [a, b, c]) await expect(tab(page, name)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Show all sections' })).toBeVisible()
})

When('the applicant shows the section {string}', async ({ page }, name) => {
  await sectionButton(page, name).click()
})

When('the applicant hides the section {string}', async ({ page }, name) => {
  await sectionButton(page, name).click()
})

Then('the section {string} is open', async ({ page }, name) => {
  await expect(sectionButton(page, name)).toHaveAttribute('aria-expanded', 'true')
})

Then('the section {string} is closed', async ({ page }, name) => {
  await expect(sectionButton(page, name)).toHaveAttribute('aria-expanded', 'false')
})

When('the applicant chooses Show all sections', async ({ page }) => {
  await page.getByRole('button', { name: 'Show all sections' }).click()
})

Then('every section is open', async ({ page }) => {
  await expect.poll(async () => (await sectionButtons(page).evaluateAll((els) => els.map((e) => e.getAttribute('aria-expanded')))).every((v) => v === 'true')).toBe(true)
})

When('the applicant chooses the contents link {string}', async ({ page }, number) => {
  await page.getByRole('link', { name: new RegExp(`^Section validated: ${escapeRegExp(number)}`) }).click()
})

Then('the section {string} is listed', async ({ page }, number) => {
  await expect(sectionButton(page, number)).toBeVisible()
})

When('the applicant chooses the tab {string}', async ({ page }, name) => {
  await tab(page, name).click()
})

Then('the tab {string} is the current tab', async ({ page }, name) => {
  await expect(tab(page, name)).toHaveAttribute('aria-current', 'page')
  await scanPage(page, { variant: name === 'Further information' ? 'error' : 'default' })
})

When('the applicant chooses the Next page link of the profile', async ({ page }) => {
  await page.getByRole('link', { name: /^Next page/ }).click()
})

Then('the species data lists the chapters {string}, {string}, {string}, {string}, {string} and {string}', async ({ page }, a, b, c, d, e, f) => {
  for (const name of [a, b, c, d, e, f]) await expect(page.getByRole('link', { name, exact: true })).toBeVisible()
})

When('the applicant chooses the chapter {string}', async ({ page }, name) => {
  await page.getByRole('link', { name, exact: true }).click()
})

Then('the question {string} is listed', async ({ page }, number) => {
  await expect(sectionButton(page, number)).toBeVisible()
})

When('the applicant chooses the Next page link of the species data', async ({ page }) => {
  await page.getByRole('link', { name: /^Next page/ }).click()
})

const firstQuestion = (page) => page.getByRole('button', { name: /^\d+\.\d+ / }).first()

When('the applicant shows the first species data question', async ({ page }) => {
  await firstQuestion(page).click()
})

When('the applicant hides the first species data question', async ({ page }) => {
  await firstQuestion(page).click()
})

Then('the first species data question is open', async ({ page }) => {
  await expect(firstQuestion(page)).toHaveAttribute('aria-expanded', 'true')
})

Then('the first species data question is closed', async ({ page }) => {
  await expect(firstQuestion(page)).toHaveAttribute('aria-expanded', 'false')
})

const responses = new WeakMap()

When('the applicant requests the address {string}', async ({ page }, address) => {
  responses.set(page, await page.request.get(`${new URL(routes.home).origin}${address}`))
})

Then('the response status is {int}', async ({ page }, status) => {
  expect(responses.get(page).status()).toBe(status)
})
