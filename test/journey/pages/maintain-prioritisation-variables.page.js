import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/MaintainPrioritisationVariables.aspx:1-20
/**
 * Maintain profile prioritisation variables page.
 * @extends BasePage
 */
export class MaintainPrioritisationVariablesPage extends BasePage {
  constructor(page) {
    super(page, routes.maintainPrioritisationVariables)
  }

  get calculateDraftPrioritisationButton() {
    return this.page.locator('#ctl00_cphMain_btnCalculateDraftPrioritisation')
  }

  get updateButton() {
    return this.page.locator('#ctl00_cphMain_btnUpdate')
  }

  get categorySelect() {
    return this.page.locator('#ctl00_cphMain_ddlPrioritisationCategories')
  }

  get lowerBoundInput() {
    return this.page.locator('#ctl00_cphMain_txtLowerBound')
  }

  get upperBoundInput() {
    return this.page.locator('#ctl00_cphMain_txtUpperBound')
  }

  async openPage() {
    await this.page.goto(routes.maintainPrioritisationVariables)
  }

  async expectControlsVisible() {
    await expect(this.calculateDraftPrioritisationButton).toBeVisible()
    await expect(this.updateButton).toBeVisible()
    await expect(this.categorySelect).toBeVisible()
    await expect(this.lowerBoundInput).toBeVisible()
    await expect(this.upperBoundInput).toBeVisible()
  }
}
