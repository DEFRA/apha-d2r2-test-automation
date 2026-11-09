import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/MaintainCrossCuttingIssueScores.aspx:1-20
/**
 * Maintain cross-cutting issue scores page.
 * @extends BasePage
 */
export class MaintainCrossCuttingIssueScoresPage extends BasePage {
  constructor(page) {
    super(page, routes.maintainCrossCuttingIssueScores)
  }

  get updateButton() {
    return this.page.locator('#ctl00_cphMain_btnUpdate')
  }

  get categorySelect() {
    return this.page.locator('#ctl00_cphMain_ddlSpeciesPrioritisationCategories')
  }

  async openPage() {
    await this.page.goto(routes.maintainCrossCuttingIssueScores)
  }

  async expectControlsVisible() {
    await expect(this.updateButton).toBeVisible()
    await expect(this.categorySelect).toBeVisible()
    await expect(this.categorySelect.locator('option').filter({ hasText: /animal identification/i })).toHaveCount(1)
  }
}
