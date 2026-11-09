import { Then, When } from '../../support/fixtures.js'
import { expectTextVisible, expectInputLength } from '../../assertions/report.assertions.js'

// source: app/Profiles.Web/ProfileProperties.aspx:48 (valTitleRequired); the button reads Create profile in create mode (observed)
When('the applicant saves the new profile without a title', async ({ page }) => {
  await page.getByRole('button', { name: /^Create profile$/ }).click()
})

// source: app/Profiles.Web/MaintainGlobalUsers.aspx:49,60-76 (Add reveals the form; Look up validates the username)
When('the applicant looks up the global user {string}', async ({ page }, username) => {
  await page.getByRole('button', { name: /^Add$/ }).click()
  await page.locator('[id$="txtUserName"]').fill(username)
  await page.getByRole('button', { name: /look up/i }).click()
})

// source: app/Profiles.Web/MaintainGlobalUsers.aspx:60 (MaxLength="50")
When('the applicant enters {int} characters in the global user username', async ({ page }, length) => {
  await page.getByRole('button', { name: /^Add$/ }).click()
  await page.locator('[id$="txtUserName"]').fill('a'.repeat(length))
})

Then('the field rule message {string} is shown', async ({ page }, message) => {
  await expectTextVisible(page, message)
})

Then('the global user username holds {int} characters', async ({ page }, length) => {
  await expectInputLength(page.locator('[id$="txtUserName"]'), length)
})

