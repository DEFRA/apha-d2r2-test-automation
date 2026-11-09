import { Given, Then } from '../../support/fixtures.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { pages } from '../../content/routes.js'
import { GeneralReportsPage } from '../../pages/general-reports.page.js'

Given('the applicant is on the general reports page', async ({ page }) => {
  const pageObject = new GeneralReportsPage(page)
  await pageObject.openPage()
  await expectPageLoaded(page, { heading: pages.generalReports.heading })
})

Then('the general reports page shows the report links', async ({ page }) => {
  const pageObject = new GeneralReportsPage(page)
  await pageObject.expectReportLinksVisible()
})
