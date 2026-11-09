import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/SpeciesDataAuditTrail.aspx:1-120, app/Profiles.Web/ReferenceTableAuditTrail.aspx:1-120
/**
 * Route-backed audit-trail pages used to review historical changes in species and reference data.
 * @extends BasePage
 */
export class AuditTrailsPage extends BasePage {
  constructor(page) {
    super(page, routes.speciesDataAuditTrail)
  }

  get speciesDataAuditTrailLink() {
    return this.page.getByRole('link', { name: /maintain species data/i }).first()
  }

  get referenceTableAuditTrailLink() {
    return this.page.getByRole('link', { name: /maintain reference data/i }).first()
  }

  async openSpeciesDataAuditTrailPage() {
    await this.page.goto(routes.speciesDataAuditTrail)
  }

  async openReferenceTableAuditTrailPage() {
    await this.page.goto(routes.maintainReferenceData)

    const select = this.page.locator('select[id*="ddlReferenceTable"]')
    await expect(select).toBeVisible({ timeout: 15000 })

    const options = await select.locator('option').evaluateAll((opts) =>
      opts
        .map((opt) => ({ value: opt.value, text: opt.textContent.trim() }))
        .filter((opt) => opt.value && opt.value !== '00000000-0000-0000-0000-000000000000')
    )

    const firstRealOption = options.find((option) => option.text && option.text !== 'Please select...') ?? options[0]

    if (!firstRealOption) {
      throw new Error('No reference-table options were available to open the audit trail.')
    }

    await select.selectOption(firstRealOption.value, { timeout: 15000 })
    const viewAuditTrail = this.page.locator('input[value="View audit trail"]').first()
    await expect(viewAuditTrail).toBeVisible({ timeout: 15000 })
    await viewAuditTrail.click()
    await this.page.waitForURL(/ReferenceTableId=.+/, { timeout: 15000 })
    await this.page.waitForLoadState('domcontentloaded')
  }

  async expectSpeciesDataAuditTrailVisible() {
    await expect(this.page.getByText(/species data audit trail/i)).toBeVisible()
    await expect(this.speciesDataAuditTrailLink).toBeVisible()
  }

  async expectReferenceTableAuditTrailVisible() {
    await expect(this.page.getByText(/audit trail for reference table/i)).toBeVisible()
    await expect(this.referenceTableAuditTrailLink).toBeVisible()
  }
}
