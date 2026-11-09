import { Given, Then, When } from '../../support/fixtures.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { pages } from '../../content/routes.js'
import { MaintainReferenceDataPage } from '../../pages/maintain-reference-data.page.js'

Given('the applicant is on the maintain reference data page', async ({ page }) => {
  const maintainReferenceDataPage = new MaintainReferenceDataPage(page)
  await maintainReferenceDataPage.openPage()
  await expectPageLoaded(page, { heading: pages.maintainReferenceData.heading })
})

Then('the maintain reference data page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.maintainReferenceData.heading })
})

Then('the maintain reference data page shows the reference table controls', async ({ page }) => {
  const maintainReferenceDataPage = new MaintainReferenceDataPage(page)
  await maintainReferenceDataPage.expectControlsVisible()
})

When('the applicant selects the Surveillance outcome reference table', async ({ page }) => {
  const maintainReferenceDataPage = new MaintainReferenceDataPage(page)
  await maintainReferenceDataPage.selectReferenceTable('Surveillance outcome')
})

Then('the maintain reference data page shows the selected reference table', async ({ page }) => {
  const maintainReferenceDataPage = new MaintainReferenceDataPage(page)
  await maintainReferenceDataPage.expectSelectedReferenceTable('Surveillance outcome')
})
