import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/EditUserGuidance.aspx:1-20
/**
 * Questions and guidance reports page.
 * @extends BasePage
 */
export class QuestionsAndGuidanceReportsPage extends BasePage {
  constructor(page) {
    super(page, routes.questionsAndGuidanceReports)
  }

  get fullProfileGuidanceButton() {
    return this.page.locator('input[value="Full profile guidance report"]').first()
  }

  get summaryProfileGuidanceButton() {
    return this.page.locator('input[value="Summary profile guidance report"]').first()
  }

  get profileSectionSelect() {
    return this.page.locator('select').first()
  }

  async openPage() {
    await this.page.goto(routes.questionsAndGuidanceReports)
  }

  async expectReportControlsVisible() {
    await expect(this.fullProfileGuidanceButton).toBeVisible()
    await expect(this.summaryProfileGuidanceButton).toBeVisible()
    await expect(this.profileSectionSelect).toBeVisible()
  }
}
