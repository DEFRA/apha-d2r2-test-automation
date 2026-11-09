import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/ViewSpeciesData.aspx:1-10
export class ViewSpeciesDataPage extends BasePage {
  constructor(page) {
    super(page, routes.viewSpeciesData)
  }

  get speciesFilters() {
    return this.page.locator('select, input, button').first()
  }

  async openPage() {
    await this.page.goto(routes.viewSpeciesData)
  }

  async expectSpeciesFiltersVisible() {
    const viewDataButton = this.page.getByRole('button', { name: /view data/i })
    await expect(viewDataButton).toBeVisible()
  }
}
