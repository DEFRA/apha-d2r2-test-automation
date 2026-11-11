import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/StaticReports.aspx:1-10
export class GeneralReportsPage extends BasePage {
  constructor(page) {
    super(page, routes.generalReports)
  }

  get reportLinks() {
    return this.page.locator('a[href]').filter({ has: this.page.locator('a[href]') }).first()
  }

  async openPage() {
    await this.page.goto(routes.generalReports)
  }

  async expectReportLinksVisible() {
    const links = this.root.locator('table a[href]')
    await expect(links.first()).toBeVisible()
    await expect(links).not.toHaveCount(0)
  }
}
