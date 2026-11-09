import { Given, Then, When } from '../../support/fixtures.js'
import { routes } from '../../content/routes.js'
import { MaintainSpeciesDataPage } from '../../pages/maintain-species-data.page.js'

Given('the applicant is on the maintain species data page', async ({ page }) => {
  const maintainSpeciesDataPage = new MaintainSpeciesDataPage(page)
  await maintainSpeciesDataPage.openPage()
  await page.getByRole('button', { name: /view audit trail/i }).waitFor({ state: 'visible' })
})

Then('the maintain species data page shows the maintenance actions', async ({ page }) => {
  const maintainSpeciesDataPage = new MaintainSpeciesDataPage(page)
  await maintainSpeciesDataPage.expectActionsVisible()
})

When('the applicant clicks View Audit Trail', async ({ page }) => {
  await page.getByRole('button', { name: /view audit trail/i }).click()
})

When('the applicant opens the edit species page', async ({ page }) => {
  await page.goto(routes.editSpecies)
})

Then('the edit species data page is shown', async ({ page }) => {
  const saveButton = page.locator('button:has-text("Save"), input[type="submit"][value="Save"], input[value="Save"]').first()
  await saveButton.waitFor({ state: 'visible' })
})
