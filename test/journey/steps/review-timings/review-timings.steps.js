import { Given, Then } from '../../support/fixtures.js'
import { ReviewTimingsPage } from '../../pages/review-timings.page.js'

Given('the applicant is on the review timings page', async ({ page }) => {
  const reviewTimingsPage = new ReviewTimingsPage(page)
  await reviewTimingsPage.openPage()
  await reviewTimingsPage.expectPageLoaded()
})

Then('the review timings page is shown', async ({ page }) => {
  const reviewTimingsPage = new ReviewTimingsPage(page)
  await reviewTimingsPage.expectPageLoaded()
})

Then('the review timings page shows the filters', async ({ page }) => {
  const reviewTimingsPage = new ReviewTimingsPage(page)
  await reviewTimingsPage.expectControlsVisible()
})

Then('the review timings page shows the filters after home navigation', async ({ page }) => {
  const reviewTimingsPage = new ReviewTimingsPage(page)
  await reviewTimingsPage.expectControlsVisible()
})
