import { Given, Then } from '../../support/fixtures.js'
import { HelpPage } from '../../pages/help.page.js'
import { pages } from '../../content/routes.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'

Given('the applicant is on the help using D2R2 page', async ({ page }) => {
  const helpPage = new HelpPage(page)
  await helpPage.openPage()
  await expectPageLoaded(page, { heading: pages.help.heading })
})

Then('the help using D2R2 page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.help.heading })
})

Then('the help using D2R2 page shows the manuals', async ({ page }) => {
  const helpPage = new HelpPage(page)
  await helpPage.expectManualsVisible()
})

Then('the help using D2R2 page shows the manuals after direct access', async ({ page }) => {
  const helpPage = new HelpPage(page)
  await helpPage.expectManualsVisible()
})
