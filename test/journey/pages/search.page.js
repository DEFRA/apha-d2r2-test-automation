import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/Search.aspx:1-30
/**
 * Search disease profiles page.
 * @extends BasePage
 */
export class SearchPage extends BasePage {
  constructor(page) {
    super(page, routes.search)
  }

  get searchInput() {
    return this.page.getByLabel('Search for disease profiles')
  }

  get searchButton() {
    return this.page.locator('button.govuk-button').filter({ hasText: /search profiles/i })
  }

  get affectedSpeciesFilterButton() {
    return this.page.getByRole('button', { name: /show filter by affected species/i })
  }

  get resultHeading() {
    return this.page.getByRole('heading', { level: 3 })
  }

  get manageLink() {
    return this.page.locator('a:visible').filter({ hasText: /^manage$/i }).first()
  }

  async openSearchPage() {
    await this.page.goto(routes.search)
  }

  async searchFor(term) {
    await this.searchInput.fill(term)
    await this.searchButton.first().click()
    await this.page.waitForLoadState('load')
  }

  async expectFiltersVisible() {
    await expect(this.searchInput).toBeVisible()
    await expect(this.searchButton).toBeVisible()
    await expect(this.affectedSpeciesFilterButton).toBeVisible()
    await expect(this.page.getByText(/view profiles beginning with/i)).toBeVisible()
  }

  async expectResultVisible(term) {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const result = this.page.locator('h3').filter({ hasText: new RegExp(escapedTerm, 'i') }).first()
    await expect(result).toBeVisible()
  }

  async openManagePageForFirstResult() {
    await this.manageLink.click()
  }

  // source: CDC.Web/Pages/SurveillanceProfiles/Search.cshtml:32-200 and _SearchResults.cshtml:30-147
  get form() {
    return this.page.locator('#search-form')
  }

  get resultCards() {
    return this.page.locator('.app-profile-card')
  }

  get resultTitles() {
    return this.page.locator('.app-profile-card h3')
  }

  get resultCountText() {
    return this.page.getByText(/disease profile\(s\) found containing the search words/i)
  }

  get noResultsMessage() {
    return this.page.getByText(/no disease profiles match your search criteria/i)
  }

  statusCheckbox(label) {
    return this.page.getByRole('checkbox', { name: label })
  }

  get appearsIn() {
    return this.page.getByLabel('Appears in')
  }

  get sortBy() {
    return this.page.getByLabel('Sort by:')
  }

  get pageSize() {
    return this.page.getByLabel('Items per page:')
  }

  get moreFiltersToggle() {
    return this.page.getByRole('button', { name: /more filters|hide more filters|fewer filters/i })
  }

  letterLink(letter) {
    return this.page.locator(`a[data-app-search-letter="${letter}"]`)
  }

  get speciesTree() {
    return this.page.locator('#species-filter-content')
  }

  speciesBox(label) {
    return this.speciesTree.getByLabel(label, { exact: true })
  }

  get speciesStatus() {
    return this.page.locator('#species-tree-status')
  }

  get speciesToggleAll() {
    return this.page.locator('.app-tree__toggle-all')
  }

  get pagination() {
    return this.page.getByRole('navigation', { name: /search results pages/i })
  }

  async resultCount() {
    const text = await this.page.locator('strong').filter({ hasText: /^\d+$/ }).first().innerText()
    return Number(text)
  }

  async waitForResults() {
    await Promise.race([
      this.resultCountText.waitFor({ state: 'visible' }),
      this.noResultsMessage.waitFor({ state: 'visible' })
    ])
  }

  async submit() {
    await this.searchButton.first().click()
  }
}
