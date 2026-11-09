import { Given, Then } from '../../support/fixtures.js'
import { ErrorHandlingPage } from '../../pages/error-handling.page.js'
import { pages } from '../../content/routes.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'

Given('the applicant opens the session timeout page', async ({ page }) => {
  const errorHandlingPage = new ErrorHandlingPage(page)
  await errorHandlingPage.openSessionTimeoutPage()
  await expectPageLoaded(page, { heading: pages.sessionTimeout.heading })
})

Then('the session timeout page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.sessionTimeout.heading })
})

Given('the applicant opens the application error page', async ({ page }) => {
  const errorHandlingPage = new ErrorHandlingPage(page)
  await errorHandlingPage.openApplicationErrorPage()
  await expectPageLoaded(page, { heading: pages.applicationError.heading })
})

Then('the application error page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.applicationError.heading })
})

Then('the session timeout page remains in the dedicated error state', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.sessionTimeout.heading })
})

Then('the application error page remains in the dedicated error state', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.applicationError.heading })
})
