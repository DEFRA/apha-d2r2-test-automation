import { Given, Then, When } from '../../support/fixtures.js'
import { QuestionsAndGuidanceReportsPage } from '../../pages/questions-and-guidance-reports.page.js'
import { pages } from '../../content/routes.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'

Given('the applicant is on the questions and guidance reports page', async ({ page }) => {
  const questionsAndGuidanceReportsPage = new QuestionsAndGuidanceReportsPage(page)
  await questionsAndGuidanceReportsPage.openPage()
  await expectPageLoaded(page, { heading: pages.questionsAndGuidanceReports.heading })
})

When('the applicant opens the questions and guidance reports page directly', async ({ page }) => {
  const questionsAndGuidanceReportsPage = new QuestionsAndGuidanceReportsPage(page)
  await questionsAndGuidanceReportsPage.openPage()
  await expectPageLoaded(page, { heading: pages.questionsAndGuidanceReports.heading })
})

Then('the questions and guidance reports page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.questionsAndGuidanceReports.heading })
})

Then('the questions and guidance reports page shows the report buttons', async ({ page }) => {
  const questionsAndGuidanceReportsPage = new QuestionsAndGuidanceReportsPage(page)
  await questionsAndGuidanceReportsPage.expectReportControlsVisible()
})

Then('the questions and guidance reports page shows the report buttons after direct access', async ({ page }) => {
  const questionsAndGuidanceReportsPage = new QuestionsAndGuidanceReportsPage(page)
  await questionsAndGuidanceReportsPage.expectReportControlsVisible()
})
