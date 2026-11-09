import { Given, Then } from '../../support/fixtures.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { pages } from '../../content/routes.js'
import { MaintainPrioritisationVariablesPage } from '../../pages/maintain-prioritisation-variables.page.js'

Given('the applicant is on the maintain profile prioritisation variables page', async ({ page }) => {
  const pageObject = new MaintainPrioritisationVariablesPage(page)
  await pageObject.openPage()
  await expectPageLoaded(page, { heading: pages.maintainPrioritisationVariables.heading })
})

Then('the maintain profile prioritisation variables page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.maintainPrioritisationVariables.heading })
})

Then('the maintain profile prioritisation variables page shows the controls', async ({ page }) => {
  const pageObject = new MaintainPrioritisationVariablesPage(page)
  await pageObject.expectControlsVisible()
})

Then('the maintain profile prioritisation variables page shows the controls after direct access', async ({ page }) => {
  const pageObject = new MaintainPrioritisationVariablesPage(page)
  await pageObject.expectControlsVisible()
})

Then('the maintain profile prioritisation variables page shows the controls after home navigation', async ({ page }) => {
  const pageObject = new MaintainPrioritisationVariablesPage(page)
  await pageObject.expectControlsVisible()
})
