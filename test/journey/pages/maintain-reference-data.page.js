import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/MaintainReferenceData.aspx:1-20
/**
 * Maintain reference data page.
 * @extends BasePage
 */
export class MaintainReferenceDataPage extends BasePage {
  constructor(page) {
    super(page, routes.maintainReferenceData)
  }

  get referenceTableSelect() {
    return this.page.locator('select').first()
  }

  async openPage() {
    await this.page.goto(routes.maintainReferenceData)
  }

  async selectReferenceTable(label) {
    await this.referenceTableSelect.selectOption({ label })
  }

  async expectSelectedReferenceTable(label) {
    await expect(this.referenceTableSelect).toHaveValue(/.+/)
    const selectedLabel = await this.referenceTableSelect.evaluate((select) => {
      const index = select.selectedIndex
      return select.options[index]?.text || ''
    })
    expect(selectedLabel).toBe(label)
  }

  async expectControlsVisible() {
    await expect(this.referenceTableSelect).toBeVisible()
    await expect(this.referenceTableSelect.locator('option').filter({ hasText: /surveillance outcome/i })).toHaveCount(1)
  }
}
