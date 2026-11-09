import { expect } from '@playwright/test'
import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/SessionTimeout.aspx:1-12, app/Profiles.Web/ApplicationError.aspx:1-52
/**
 * Static system pages that are shown when a session expires or an unhandled system error occurs.
 * @extends BasePage
 */
export class ErrorHandlingPage extends BasePage {
  constructor(page) {
    super(page, routes.sessionTimeout)
  }

  get sessionTimeoutMessage() {
    return this.page.getByText(/your application session has expired/i).first()
  }

  get applicationErrorMessage() {
    return this.page.getByText(/an error has occurred/i).first()
  }

  async openSessionTimeoutPage() {
    await this.page.goto(routes.sessionTimeout)
  }

  async openApplicationErrorPage() {
    await this.page.goto(routes.applicationError)
  }

  async expectSessionTimeoutVisible() {
    await expect(this.sessionTimeoutMessage).toBeVisible()
  }

  async expectApplicationErrorVisible() {
    await expect(this.applicationErrorMessage).toBeVisible()
  }
}
