import { Given, Then } from '../../support/fixtures.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { pages } from '../../content/routes.js'
import { ViewSpeciesDataPage } from '../../pages/view-species-data.page.js'

Given('the applicant is on the view species data page', async ({ page }) => {
  const pageObject = new ViewSpeciesDataPage(page)
  await pageObject.openPage()
  await expectPageLoaded(page, { heading: pages.viewSpeciesData.heading })
})

Then('the view species data page shows the species filters', async ({ page }) => {
  const pageObject = new ViewSpeciesDataPage(page)
  await pageObject.expectSpeciesFiltersVisible()
})
