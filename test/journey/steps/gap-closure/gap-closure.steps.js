import { expect } from '@playwright/test'
import { Given, Then, When } from '../../support/fixtures.js'
import { SearchPage } from '../../pages/search.page.js'
import { routes } from '../../content/routes.js'

// source: CDC.Web/Pages/SurveillanceProfiles/Search.cshtml:60-75 (letters), _SearchResults.cshtml:139-147 (pagination); Views/Shared/_Layout.cshtml:45-58 (menu); EditProfileReferences, EditProfileFurtherInformation
const pageSize = 10
const notes = new WeakMap()
const pagination = (page) => new SearchPage(page).pagination
const firstDate = async (page) => {
  const text = await page.locator('.app-profile-card').first().innerText()
  const match = text.match(/(\d{2})\/(\d{2})\/(\d{4})/)
  if (!match) throw new Error('First profile shows no date')
  return `${match[3]}-${match[2]}-${match[1]}`
}
const countFor = async (page, query) => {
  const html = await (await page.request.get(`${routes.search}?DisplayPublished=true&DisplayDraft=true&DisplayScenarios=true&SearchText=&${query}`)).text()
  const match = html.match(/<strong>(\d+)<\/strong>\s*disease profile/i)
  if (!match) throw new Error(`No result count for ${query}`)
  return Number(match[1])
}

Then('the profile counts for the letters A to Z add up to the count for all letters', async ({ page }) => {
  let sum = 0
  for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') sum += await countFor(page, `SelectedLetter=${letter}&PageSize=All`)
  expect(sum).toBe(await countFor(page, 'SelectedLetter=All&PageSize=All'))
})

When('the applicant chooses the last page of the results', async ({ page }) => {
  const searchPage = new SearchPage(page)
  await searchPage.waitForResults()
  const last = Math.ceil((await searchPage.resultCount()) / pageSize)
  notes.set(page, { last })
  await pagination(page).getByRole('link', { name: `Page ${last}` }).click()
  await expect(pagination(page).locator('[aria-current="page"]')).toHaveText(String(last))
})

Then('the last page lists only the remaining profiles', async ({ page }) => {
  const searchPage = new SearchPage(page)
  const total = await searchPage.resultCount()
  await expect(searchPage.resultCards).toHaveCount(total % pageSize || pageSize)
})

Then('there is no Next page link', async ({ page }) => {
  await expect(pagination(page).getByRole('link', { name: /next page/i })).toHaveCount(0)
  await expect(pagination(page).getByRole('link', { name: /previous page/i })).toBeVisible()
})

When('the applicant notes the date of the first profile', async ({ page }) => {
  notes.set(page, { date: await firstDate(page) })
})

Then('the date of the first profile is not earlier than the noted date', async ({ page }) => {
  expect(await firstDate(page) >= notes.get(page).date).toBe(true)
})

Then('the page lists the reference groups {string} and {string}', async ({ page }, a, b) => {
  await expect(page.getByText(a, { exact: true })).toBeVisible()
  await expect(page.getByText(b, { exact: true })).toBeVisible()
})

Then('no error message is shown on the page', async ({ page }) => {
  await expect(page.locator('.govuk-error-summary')).toHaveCount(0)
})

Given('the applicant uses a phone-sized screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
})

Then('the header menu is closed', async ({ page }) => {
  await expect(page.locator('#app-menu-panel')).toBeHidden()
  await expect(page.locator('#app-menu-toggle')).toHaveAttribute('aria-expanded', 'false')
})

When('the applicant presses Escape', async ({ page }) => {
  await page.keyboard.press('Escape')
})
