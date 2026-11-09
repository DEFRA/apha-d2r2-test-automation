import { Given, Then } from '../../support/fixtures.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { pages } from '../../content/routes.js'
import { CompareProfileVersionsPage } from '../../pages/compare-profile-versions.page.js'

Given('the applicant is on the compare profile versions page', async ({ page }) => {
  const compareProfileVersionsPage = new CompareProfileVersionsPage(page)
  await compareProfileVersionsPage.openPage()
  await expectPageLoaded(page, { heading: pages.compareProfileVersions.heading })
})

Then('the compare profile versions page shows the comparison controls', async ({ page }) => {
  const compareProfileVersionsPage = new CompareProfileVersionsPage(page)
  await compareProfileVersionsPage.expectControlsVisible()
})

Then('the compare profile versions page shows the comparison controls after direct access', async ({ page }) => {
  const compareProfileVersionsPage = new CompareProfileVersionsPage(page)
  await compareProfileVersionsPage.expectControlsVisible()
})
