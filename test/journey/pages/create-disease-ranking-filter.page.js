import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/EditDiseaseRankingFilters.aspx:1-30
/**
 * Create disease ranking filter page.
 * @extends BasePage
 */
export class CreateDiseaseRankingFilterPage extends BasePage {
  constructor(page) {
    super(page, routes.createDiseaseRankingFilter)
  }

  get createNewFilterButton() {
    return this.page.locator('input[value="Create new filter"]').first()
  }

  get diseaseFilterSelect() {
    return this.page.locator('select#ctl00_cphMain_drpDiseaseRanking').first()
  }

  async openPage() {
    await this.page.goto(routes.createDiseaseRankingFilter)
  }

  async expectControlsVisible() {
    await expect(this.createNewFilterButton).toBeVisible()
    await expect(this.diseaseFilterSelect).toBeVisible()
  }
}
