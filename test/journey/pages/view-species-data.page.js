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
    await expect(this.page.getByRole('button', { name: /close all/i })).toBeVisible()
    await expect(this.page.locator('input[name="species"]').first()).toBeAttached()
  }
}
