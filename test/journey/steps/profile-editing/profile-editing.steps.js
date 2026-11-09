import { Then, When } from '../../support/fixtures.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { expectNoApplicationError, expectPopupOpened, expectTabDestination } from '../../assertions/report.assertions.js'

// source: app/Profiles.Web/Search.aspx:63-70 (draft filter), EditProfileQuestions.aspx.vb:320-323 (tabs shown only when permitted)
When('the applicant opens the browse profile page for an editable draft version', async ({ page }) => {
  // The checkbox auto-posts back; wait for it before searching again.
  const postback = page.waitForResponse((r) => r.request().method() === 'POST')
  await page.getByLabel(/Display draft versions/i).check()
  await postback
  await page.waitForLoadState('load')
  await page.getByRole('button', { name: /search profiles/i }).click()
  await page.getByRole('link', { name: /browse profile/i }).first().waitFor({ state: 'visible' })
  const hrefs = await page.getByRole('link', { name: /browse profile/i }).evaluateAll((links) => links.map((l) => l.href))
  for (const href of hrefs) {
    await page.goto(href)
    if (await page.getByRole('tab', { name: 'Contributions', exact: true }).count()) return
  }
  throw new Error('No draft version exposing the Contributions tab was found for the search term.')
})

// source: app/Profiles.Web/EditProfileQuestions.aspx.vb:436-455
When('the applicant opens the {string} tab of the browse profile page', async ({ page }, tabName) => {
  await page.getByRole('tab', { name: tabName, exact: true }).click()
})

const tabDestinations = {
  References: 'EditProfileReferences',
  'Further information': 'EditProfileFurtherInformation',
  'All Revision dates': 'EditProfileAllRevisionDates',
  Contributions: 'EditProfileContributions'
}

// source: app/Profiles.Web/EditProfileQuestions.aspx.vb:442-453
Then('the edit page for the {string} tab is shown', async ({ page }, tabName) => {
  await expectTabDestination(page, tabDestinations[tabName])
})

// source: app/Profiles.Web/ProfileSectionLinks.ascx.vb:55-70
When('the applicant opens the {string} section link', async ({ page }, linkName) => {
  await page.getByRole('link', { name: linkName, exact: true }).first().click()
})

// source: app/Profiles.Web/Notes.aspx:1 (Title="Profile references")
Then('the profile references page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: 'Profile references' })
})

Then('the report page loads without an application error', async ({ page }) => {
  await expectNoApplicationError(page)
})

// source: app/Profiles.Web/ProfileSectionLinks.ascx.vb:49-51 (opens ShowProfilePrintVersion.aspx in a new window)
When('the applicant opens the full profile print version', async ({ page }) => {
  const popupPromise = page.waitForEvent('popup')
  await page.getByRole('link', { name: 'Print full profile', exact: true }).first().click()
  page.context().popup = await popupPromise
})

Then('the print version opens in a new window', async ({ page }) => {
  await expectPopupOpened(page.context().popup)
})

