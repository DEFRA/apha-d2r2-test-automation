import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/DiseaseReviews.aspx:1-40
/**
 * Review timings page.
 * @extends BasePage
 */
export class ReviewTimingsPage extends BasePage {
  constructor(page) {
    super(page, routes.reviewTimings)
  }

  get fromDateInput() {
    return this.page.locator('#ctl00_cphMain_txtFromDate')
  }

  get toDateInput() {
    return this.page.locator('#ctl00_cphMain_txtToDate')
  }

  get authorSelect() {
    return this.page.locator('#ctl00_cphMain_dropDownListAuthors')
  }

  get generateReportButton() {
    return this.page.locator('#ctl00_cphMain_btnSubmit')
  }

  async openPage() {
    await this.page.goto(routes.reviewTimings)
  }

  async expectPageLoaded() {
    await expect(this.page.locator('body')).toContainText(/Review Timings/i)
  }

  async expectControlsVisible() {
    await expect(this.fromDateInput).toBeVisible()
    await expect(this.toDateInput).toBeVisible()
    await expect(this.authorSelect).toBeVisible()
    await expect(this.generateReportButton).toBeVisible()
  }
}
