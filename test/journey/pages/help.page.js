import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/StaticReports.aspx.vb:252-254, app/Profiles.Web/Home.aspx:88-90
/**
 * Help using D2R2 page.
 * @extends BasePage
 */
export class HelpPage extends BasePage {
  constructor(page) {
    super(page, routes.help)
  }

  get businessObjectsGuideLink() {
    return this.page.getByRole('link', { name: /business objects infoview user guide/i }).first()
  }

  get contributorsGuideLink() {
    return this.page.getByRole('link', { name: /contributors' guide/i }).first()
  }

  async openPage() {
    await this.page.goto(routes.help)
  }

  async expectManualsVisible() {
    await expect(this.businessObjectsGuideLink).toBeVisible()
    await expect(this.contributorsGuideLink).toBeVisible()
  }
}
