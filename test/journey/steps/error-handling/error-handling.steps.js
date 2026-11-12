import { expect } from '@playwright/test'
import { Given, Then, When } from '../../support/fixtures.js'
import { ErrorHandlingPage } from '../../pages/error-handling.page.js'
import { pages, sessionDialogs, sessionRoutes } from '../../content/routes.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'

const responses = new WeakMap()

When('the applicant asks the application for the session status', async ({ page }) => {
  responses.set(page, await page.request.get(sessionRoutes.status))
})

Then('the session is reported as active with time remaining', async ({ page }) => {
  const response = responses.get(page)
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.authenticated).toBe(true)
  expect(body.remainingSeconds).toBeGreaterThan(0)
})

Then('the session warning dialog is not shown', async ({ page }) => {
  const dialog = page.getByRole('alertdialog', { name: sessionDialogs.warningTitle, includeHidden: true })
  await expect(dialog).toHaveCount(1)
  await expect(dialog).toBeHidden()
})

Then('the session expired dialog is not shown', async ({ page }) => {
  const dialog = page.getByRole('alertdialog', { name: sessionDialogs.expiredTitle, includeHidden: true })
  await expect(dialog).toHaveCount(1)
  await expect(dialog).toBeHidden()
})

When('the applicant asks to extend the session without a token', async ({ page }) => {
  responses.set(page, await page.request.post(sessionRoutes.extend))
})

Then('the application rejects the request as invalid', async ({ page }) => {
  expect(responses.get(page).status()).toBe(400)
})

Given('the applicant opens the application error page', async ({ page }) => {
  const errorHandlingPage = new ErrorHandlingPage(page)
  await errorHandlingPage.openApplicationErrorPage()
  await expectPageLoaded(page, { heading: pages.applicationError.heading })
})

Then('the application error page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.applicationError.heading })
})

Then('the application error page remains in the dedicated error state', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.applicationError.heading })
})
