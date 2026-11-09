import { Given, Then, When } from '../../support/fixtures.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { expectFirstVisible, expectPopupDestination, expectTextVisible } from '../../assertions/report.assertions.js'
import { pages, routes } from '../../content/routes.js'

const treeCheckboxes = (page) => page.locator('#ctl00_cphMain_tvwProfileVersions input.rtChk')

// source: app/Profiles.Web/ReviewEmail.aspx:1-14
Given('the applicant is on the review email page', async ({ page }) => {
  await page.goto(routes.reviewEmail)
  await expectPageLoaded(page, { heading: pages.reviewEmail.heading })
})

Then('the review email page shows the test-only notice', async ({ page }) => {
  await expectTextVisible(page, /this page is for testing purposes only/i)
})

// source: app/Profiles.WebControls/CollapsiblePanel.vb:251-253,414-416 (help-button.png opens ProfileQuestionHelp.aspx)
When('the applicant opens the first question help', async ({ page }) => {
  const popupPromise = page.waitForEvent('popup')
  await page.locator('[onclick*="helpPopup"]').first().click()
  page.context().helpWindow = await popupPromise
})

Then('the question help window is opened', async ({ page }) => {
  await expectPopupDestination(page.context().helpWindow, 'ProfileQuestionHelp')
})

// source: app/Profiles.Web/ProfileQuestionHelp.aspx.vb:6-9 (ProfileQuestionId is required)
When('the applicant opens the question help page without a question', async ({ page }) => {
  await page.goto(routes.profileQuestionHelp)
})

// source: app/Profiles.Web/CompareProfileVersions.aspx.vb:107-118 (a version is a checked tree node)
When('the applicant selects {int} profile versions to compare', async ({ page }, count) => {
  await page.getByRole('button', { name: /open all/i }).click()
  const boxes = treeCheckboxes(page)
  await expectFirstVisible(boxes)
  for (let i = 0; i < count; i++) {
    await boxes.nth(i).check()
  }
})

// source: app/Profiles.Web/CompareProfileVersions.aspx:282-296
When('the applicant compares the selected versions', async ({ page }) => {
  const popupPromise = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null)
  await page.locator('#ctl00_cphMain_btnCompare').click()
  page.context().reportWindow = await popupPromise
})

// source: app/Profiles.Web/CompareProfileVersions.aspx.vb:107-118 (CustomValidator cvInput)
Then('the compare versions selection message is shown', async ({ page }) => {
  await expectTextVisible(page, 'Please select 2 disease profile versions to compare')
})


