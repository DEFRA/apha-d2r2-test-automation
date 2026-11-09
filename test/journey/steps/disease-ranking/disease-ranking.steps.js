import { Given, Then, When } from '../../support/fixtures.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { pages } from '../../content/routes.js'
import { DiseaseRankingPage } from '../../pages/disease-ranking.page.js'

Given('the applicant is on the disease ranking page', async ({ page }) => {
  const diseaseRankingPage = new DiseaseRankingPage(page)
  await diseaseRankingPage.openPage()
  await expectPageLoaded(page, { heading: pages.diseaseRanking.heading })
})

Then('the disease ranking page shows the report selectors', async ({ page }) => {
  const diseaseRankingPage = new DiseaseRankingPage(page)
  await diseaseRankingPage.expectSelectorsVisible()
})

When('the applicant chooses the terrestrial disease ranking report', async ({ page }) => {
  const diseaseRankingPage = new DiseaseRankingPage(page)
  await diseaseRankingPage.selectTerrestrialReport()
})

Then('the disease ranking page keeps the selected report', async ({ page }) => {
  const diseaseRankingPage = new DiseaseRankingPage(page)
  await diseaseRankingPage.expectSelectedReport('Disease ranking report: Terrestrial diseases')
})
