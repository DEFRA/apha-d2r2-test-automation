import { expect } from '@playwright/test'
import { Then, When } from '../../support/fixtures.js'
import { editorOnlyRoutes, permissionDenied } from '../../content/routes.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { escapeRegExp } from '../../support/text.js'

// source: CDC.Web/Authorization/Policies/AuthorizationPolicyRegistration.cs (editor-only policies); observed header menu for a non-editor
const editorLinks = [
  'Compare profile versions',
  'Create disease ranking filter',
  'Create profile',
  'Review timings',
  'Maintain species data',
  'Maintain reference data',
  'Maintain global users',
  'Maintain external users',
  'Maintain prioritisation variables',
  'Maintain cross-cutting issue scores',
  'Edit questions and guidance'
]

When('the applicant opens the {string} page by address', async ({ page }, name) => {
  const url = editorOnlyRoutes[name]
  if (!url) throw new Error(`No editor-only route named "${name}" in content/routes.js`)
  await page.goto(url)
})

Then('the permission denied page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: permissionDenied.heading, variant: 'error', role: 'non-editor' })
})

When('the applicant chooses to go to the D2R2 home page', async ({ page }) => {
  await page.getByRole('link', { name: permissionDenied.homeLink }).click()
})

Then('the home page does not offer the editor links', async ({ page }) => {
  for (const name of editorLinks) {
    await expect(page.getByRole('link', { name: new RegExp(`^${escapeRegExp(name)}$`, 'i') })).toHaveCount(0)
  }
})
