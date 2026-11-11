import { When, Then } from '../../support/fixtures.js'
import { expectReportWindow } from '../../assertions/report.assertions.js'
import { expectDownloadNamed } from '../../assertions/page.assertions.js'

const downloads = new WeakMap()

async function downloadFrom(page, trigger) {
  const download = page.waitForEvent('download')
  downloads.set(page, download)
  await trigger()
  await download
}

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

// source: observed Reports/General: report title links return a file download
When('the applicant opens the first static report', async ({ page }) => {
  await downloadFrom(page, () => page.locator('main table a[href*="document"]').first().click())
})

// source: app/Profiles.Web/MaintainPrioritisationVariables.aspx.vb:77 (btnPrint opens PrintPrioritisationVariables.aspx)
When('the applicant prints the variables for the first prioritisation category', async ({ page }) => {
  const categories = page.locator('select[id*="ddlPrioritisationCategories"]')
  await categories.selectOption({ index: 1 })
  await page.waitForLoadState('load')
  await openInNewWindow(page, () => page.getByRole('button', { name: /print category variables/i }).click())
})

// source: observed ProfileReports page: each report link returns a PDF download
When('the applicant opens the first profile report', async ({ page }) => {
  await downloadFrom(page, () => page.locator('main').getByRole('link', { name: /summary prioritisation report/i }).click())
})

Then('the report file is downloaded', async ({ page }) => {
  await expectDownloadNamed(await downloads.get(page))
})

Then('the {string} report window is opened', async ({ page }, destination) => {
  await expectReportWindow(page.context().reportWindow, destination)
})
