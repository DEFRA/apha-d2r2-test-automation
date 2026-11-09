import { Given, Then } from '../../support/fixtures.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { pages } from '../../content/routes.js'
import { MaintainCrossCuttingIssueScoresPage } from '../../pages/maintain-cross-cutting-issue-scores.page.js'

Given('the applicant is on the maintain cross-cutting issue scores page', async ({ page }) => {
  const pageObject = new MaintainCrossCuttingIssueScoresPage(page)
  await pageObject.openPage()
  await expectPageLoaded(page, { heading: pages.maintainCrossCuttingIssueScores.heading })
})

Then('the maintain cross-cutting issue scores page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.maintainCrossCuttingIssueScores.heading })
})

Then('the maintain cross-cutting issue scores page shows the controls', async ({ page }) => {
  const pageObject = new MaintainCrossCuttingIssueScoresPage(page)
  await pageObject.expectControlsVisible()
})

Then('the maintain cross-cutting issue scores page shows the controls after direct access', async ({ page }) => {
  const pageObject = new MaintainCrossCuttingIssueScoresPage(page)
  await pageObject.expectControlsVisible()
})

Then('the maintain cross-cutting issue scores page shows the controls after home navigation', async ({ page }) => {
  const pageObject = new MaintainCrossCuttingIssueScoresPage(page)
  await pageObject.expectControlsVisible()
})
