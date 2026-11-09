import { Given, Then } from '../../support/fixtures.js'
import { AuditTrailsPage } from '../../pages/audit-trails.page.js'
import { pages } from '../../content/routes.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'

Given('the applicant opens the species data audit trail page', async ({ page }) => {
  const auditTrailsPage = new AuditTrailsPage(page)
  await auditTrailsPage.openSpeciesDataAuditTrailPage()
  await expectPageLoaded(page, { heading: pages.speciesDataAuditTrail.heading })
})

Then('the species data audit trail page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.speciesDataAuditTrail.heading })
})

Given('the applicant opens the reference table audit trail page', async ({ page }) => {
  const auditTrailsPage = new AuditTrailsPage(page)
  await auditTrailsPage.openReferenceTableAuditTrailPage()
  await expectPageLoaded(page, { heading: pages.referenceTableAuditTrail.heading })
})

Then('the reference table audit trail page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.referenceTableAuditTrail.heading })
})
