import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/MaintainSpeciesData.aspx:1-20
/**
 * Maintain species data page.
 * @extends BasePage
 */
export class MaintainSpeciesDataPage extends BasePage {
  constructor(page) {
    super(page, routes.maintainSpeciesData)
  }

  get viewAuditTrailButton() {
    return this.page.getByRole('button', { name: /view audit trail/i })
  }

  get addButton() {
    return this.page.getByRole('button', { name: /^add$/i })
  }

  get editNameParentButton() {
    return this.page.getByRole('button', { name: /edit name\/parent/i })
  }

  async openPage() {
    await this.page.goto(routes.maintainSpeciesData)
  }

  async expectActionsVisible() {
    await expect(this.viewAuditTrailButton).toBeVisible()
    await expect(this.addButton).toBeVisible()
    await expect(this.editNameParentButton).toBeVisible()
  }
}
