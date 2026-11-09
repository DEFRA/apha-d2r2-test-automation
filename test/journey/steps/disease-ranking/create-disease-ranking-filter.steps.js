import { Given, Then } from '../../support/fixtures.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { pages } from '../../content/routes.js'
import { CreateDiseaseRankingFilterPage } from '../../pages/create-disease-ranking-filter.page.js'

Given('the applicant is on the create disease ranking filter page', async ({ page }) => {
  const createDiseaseRankingFilterPage = new CreateDiseaseRankingFilterPage(page)
  await createDiseaseRankingFilterPage.openPage()
  await expectPageLoaded(page, { heading: pages.createDiseaseRankingFilter.heading })
})

Then('the create disease ranking filter page shows the filter controls', async ({ page }) => {
  const createDiseaseRankingFilterPage = new CreateDiseaseRankingFilterPage(page)
  await createDiseaseRankingFilterPage.expectControlsVisible()
})

Then('the create disease ranking filter page shows the filter controls after direct access', async ({ page }) => {
  const createDiseaseRankingFilterPage = new CreateDiseaseRankingFilterPage(page)
  await createDiseaseRankingFilterPage.expectControlsVisible()
})
