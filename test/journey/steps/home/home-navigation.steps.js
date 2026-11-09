import { Given, Then, When } from '../../support/fixtures.js'
import { expectHomePageLinksVisible, expectPageLoaded } from '../../assertions/page.assertions.js'
import { pages, routes } from '../../content/routes.js'
import { HomePage } from '../../pages/home.page.js'

Given('the applicant is on the home page', async ({ page }) => {
  await page.goto(routes.home)
})

Given('the applicant is on the global users page', async ({ page }) => {
  await page.goto(routes.globalUsers)
  await expectPageLoaded(page, { heading: pages.globalUsers.heading })
})

Given('the applicant is on the external users page', async ({ page }) => {
  await page.goto(routes.externalUsers)
  await expectPageLoaded(page, { heading: pages.externalUsers.heading })
})

Given('the applicant is on the create profile page', async ({ page }) => {
  await page.goto(routes.createProfile)
  await expectPageLoaded(page, { heading: pages.createProfile.heading })
})

Then('the home page shows the popular links', async ({ page }) => {
  await expectHomePageLinksVisible(page)
})

When('the applicant chooses Search Disease Profiles', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openSearchPage()
})

Then('the search page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.search.heading })
})

When('the applicant chooses Disease Ranking Report', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openDiseaseRankingPage()
})

Then('the disease ranking page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.diseaseRanking.heading })
})

When('the applicant chooses General Reports', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openGeneralReportsPage()
})

Then('the general reports page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.generalReports.heading })
})

When('the applicant chooses View Species Data', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openViewSpeciesDataPage()
})

Then('the view species data page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.viewSpeciesData.heading })
})

When('the applicant chooses Help Using D2R2', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openHelpPage()
})

Then('the help page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.help.heading })
})

When('the applicant chooses Create Profile', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openCreateProfilePage()
})

Then('the create profile page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.createProfile.heading })
})

When('the applicant submits the empty new profile form', async ({ page }) => {
  await page.getByRole('button', { name: /^Save$/i }).click()
})

Then('the profile title validation message is shown', async ({ page }) => {
  await page.getByText(/you must enter a title/i).waitFor({ state: 'visible' })
})

When('the applicant chooses Global Users', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openGlobalUsersPage()
})

Then('the global users page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.globalUsers.heading })
})

When('the applicant chooses External Users', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openExternalUsersPage()
})

Then('the external users page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.externalUsers.heading })
})

When('the applicant chooses Maintain Reference Data', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openMaintainReferenceDataPage()
})

Then('the home navigation maintain reference data page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.maintainReferenceData.heading })
})

Then('the home page does not show the maintain species data link', async ({ page }) => {
  const link = page.locator('a:visible').filter({ hasText: /maintain species data/i }).first()
  if (await link.count()) {
    throw new Error('Expected the home page not to show a Maintain Species Data link.')
  }
})

When('the applicant chooses Maintain Prioritisation Variables', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openMaintainPrioritisationVariablesPage()
})

Then('the maintain prioritisation variables page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.maintainPrioritisationVariables.heading })
})

Then('the home page does not show the questions and guidance reports link', async ({ page }) => {
  const link = page.locator('a:visible').filter({ hasText: /questions and guidance reports/i }).first()
  if (await link.count()) {
    throw new Error('Expected the home page not to show a Questions and Guidance Reports link.')
  }
})

When('the applicant chooses Review Timings', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openReviewTimingsPage()
})

Then('the review timings page is shown from home navigation', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.reviewTimings.heading })
})

When('the applicant chooses Questions and Guidance Reports', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openQuestionsAndGuidanceReportsPage()
})

Then('the questions and guidance reports page is shown from home navigation', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.questionsAndGuidanceReports.heading })
})

When('the applicant chooses Compare Profile Versions', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openCompareProfileVersionsPage()
})

Then('the compare profile versions page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.compareProfileVersions.heading })
})

When('the applicant chooses Maintain Cross-Cutting Issue Scores', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openMaintainCrossCuttingIssueScoresPage()
})

Then('the maintain cross-cutting issue scores page is shown from home navigation', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.maintainCrossCuttingIssueScores.heading })
})

When('the applicant chooses Create Disease Ranking Filter', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.openCreateDiseaseRankingFilterPage()
})

Then('the create disease ranking filter page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.createDiseaseRankingFilter.heading })
})
