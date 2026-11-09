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
    return this.page.getByRole('button', { name: /search profiles/i })
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
    await this.searchButton.click()
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
}
