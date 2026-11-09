import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/CompareProfileVersions.aspx:1-30
/**
 * Compare profile versions page.
 * @extends BasePage
 */
export class CompareProfileVersionsPage extends BasePage {
  constructor(page) {
    super(page, routes.compareProfileVersions)
  }

  get compareButton() {
    return this.page.locator('#ctl00_cphMain_btnCompare').first() // source: app/Profiles.Web/CompareProfileVersions.aspx:282-296
  }

  get profileVersionsTree() {
    return this.page.locator('#ctl00_cphMain_tvwProfileVersions').first() // source: app/Profiles.Web/CompareProfileVersions.aspx:120-200
  }

  async openPage() {
    await this.page.goto(routes.compareProfileVersions) // source: app/Profiles.Web/CompareProfileVersions.aspx:1-30
  }

  async expectControlsVisible() {
    await expect(this.profileVersionsTree).toBeVisible({ timeout: 20000 })
    await expect(this.compareButton).toBeVisible({ timeout: 20000 })
  }
}
