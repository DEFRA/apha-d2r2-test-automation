import { When, Then } from '../../support/fixtures.js'
import { expectReportWindow } from '../../assertions/report.assertions.js'

async function openInNewWindow(page, trigger) {
  const popupPromise = page.waitForEvent('popup')
  await trigger()
  page.context().reportWindow = await popupPromise
}

// source: app/Profiles.Web/DiseaseRanking.aspx.vb:19-62 (selecting a report opens ShowDiseaseRanking[RFI]Report.aspx)
When('the applicant opens the {string} report from the {string} report selector', async ({ page }, kind, selector) => {
  const select = page.locator('select').nth(selector === 'RFI' ? 1 : 0)
  await openInNewWindow(page, () => select.selectOption({ label: `Disease ranking report: ${kind} diseases` }))
})

// source: app/Profiles.Web/EditUserGuidance.aspx.vb:140-165
When('the applicant generates the {string} guidance report', async ({ page }, buttonName) => {
  await openInNewWindow(page, () => page.getByRole('button', { name: buttonName, exact: true }).click())
})

// source: app/Profiles.Web/StaticReports.aspx.vb:213 (lnkViewStaticReportVersion opens ShowStaticReport.aspx)
When('the applicant opens the first static report', async ({ page }) => {
  await openInNewWindow(page, () => page.locator('a[id*="lnkViewStaticReportVersion"]').first().click())
})

// source: app/Profiles.Web/MaintainPrioritisationVariables.aspx.vb:77 (btnPrint opens PrintPrioritisationVariables.aspx)
When('the applicant prints the variables for the first prioritisation category', async ({ page }) => {
  const categories = page.locator('select[id*="ddlPrioritisationCategories"]')
  await categories.selectOption({ index: 1 })
  await page.waitForLoadState('load')
  await openInNewWindow(page, () => page.getByRole('button', { name: /print category variables/i }).click())
})

// source: app/Profiles.Web/ProfileReports.aspx.vb:131 (lnkEditProfileVersion opens ShowPublishedProfile.aspx)
When('the applicant opens the first profile report', async ({ page }) => {
  await openInNewWindow(page, () => page.locator('a[id*="lnkEditProfileVersion"]').first().click())
})

Then('the {string} report window is opened', async ({ page }, destination) => {
  await expectReportWindow(page.context().reportWindow, destination)
})
