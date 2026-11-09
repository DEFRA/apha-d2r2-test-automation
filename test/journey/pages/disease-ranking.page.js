import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/DiseaseRanking.aspx:1-30
/**
 * Disease ranking report page.
 * @extends BasePage
 */
export class DiseaseRankingPage extends BasePage {
  constructor(page) {
    super(page, routes.diseaseRanking)
  }

  get rankingReportSelect() {
    return this.page.locator('select').nth(0)
  }

  get rfiReportSelect() {
    return this.page.locator('select').nth(1)
  }

  get editFiltersButton() {
    return this.page.getByRole('button', { name: /edit filters/i }).first()
  }

  async openPage() {
    await this.page.goto(routes.diseaseRanking)
  }

  async selectTerrestrialReport() {
    await this.rankingReportSelect.selectOption({ label: 'Disease ranking report: Terrestrial diseases' })
  }

  async expectSelectorsVisible() {
    await expect(this.rankingReportSelect).toBeVisible()
    await expect(this.rfiReportSelect).toBeVisible()
    await expect(this.editFiltersButton).toBeVisible()
  }

  async expectSelectedReport(label) {
    const selected = await this.rankingReportSelect.locator('option:checked').textContent()
    await expect(this.rankingReportSelect).toContainText(label)
    await expect(selected).toMatch(new RegExp(label, 'i'))
  }
}
