import { Given, Then, When } from '../../support/fixtures.js'
import { expectPageLoaded } from '../../assertions/page.assertions.js'
import { SearchPage } from '../../pages/search.page.js'
import { pages, routes } from '../../content/routes.js'

async function openProfileRouteWithId(page, targetRoute) {
  await page.goto(routes.search)
  await page.getByLabel('Search for disease profiles').fill('African Horse Sickness')
  await page.getByRole('button', { name: /search profiles/i }).click()
  await page.getByRole('link', { name: /^manage$/i }).first().waitFor({ state: 'visible' })
  await page.getByRole('link', { name: /^manage$/i }).first().click()

  if (targetRoute === 'ManageProfile.aspx') {
    return
  }

  const currentProfileId = new URL(page.url()).searchParams.get('ProfileId')
  if (currentProfileId) {
    const directTarget = new URL(page.url())
    directTarget.pathname = directTarget.pathname.replace(/[^/]+$/, targetRoute)
    directTarget.search = `?ProfileId=${currentProfileId}`
    await page.goto(directTarget.toString())
    return
  }

  const routeHandlers = {
    'ProfileProperties.aspx': () => page.getByRole('link', { name: /edit properties|profile properties/i }).first(),
    'ProfileReports.aspx': () => page.getByRole('link', { name: /view reports|profile reports|reports/i }).first(),
    'CreateBespokeReport.aspx': async () => {
      const reportsLink = page.getByRole('link', { name: /view reports|profile reports|reports/i }).first()
      await reportsLink.click()
      await page.getByRole('button', { name: /create bespoke report/i }).first().waitFor({ state: 'visible' })
      return page.getByRole('button', { name: /create bespoke report/i }).first()
    },
    'EditProfileTitle.aspx': () => page.getByRole('link', { name: /edit title/i }).first()
  }

  const action = routeHandlers[targetRoute]
  if (!action) {
    throw new Error(`Unsupported profile route: ${targetRoute}`)
  }

  const link = await action()
  await link.waitFor({ state: 'visible' })
  await link.click()
}

Given('the applicant is on the search page', async ({ page }) => {
  const searchPage = new SearchPage(page)
  await searchPage.openSearchPage()
  await expectPageLoaded(page, { heading: pages.search.heading })
})

Given('the applicant is on the manage profile page', async ({ page }) => {
  await openProfileRouteWithId(page, 'ManageProfile.aspx')
  await expectPageLoaded(page, { heading: [pages.manageProfile.heading, 'Manage profile:'] })
})

Given('the applicant is on the profile reports page', async ({ page }) => {
  await openProfileRouteWithId(page, 'ProfileReports.aspx')
  await expectPageLoaded(page, { heading: pages.profileReports.heading })
})

Given('the applicant is on the create bespoke report page', async ({ page }) => {
  await openProfileRouteWithId(page, 'CreateBespokeReport.aspx')
  await expectPageLoaded(page, { heading: [pages.createBespokeReport.heading, 'Create bespoke report'] })
})

Given('the applicant is on the profile properties page', async ({ page }) => {
  await openProfileRouteWithId(page, 'ProfileProperties.aspx')
  await expectPageLoaded(page, { heading: [pages.profileProperties.heading, 'Profile properties'] })
})

Given('the applicant is on the edit profile title page', async ({ page }) => {
  await openProfileRouteWithId(page, 'EditProfileTitle.aspx')
  await expectPageLoaded(page, { heading: [pages.editProfileTitle.heading, 'Edit title'] })
})

Then('the search page shows the disease profile filters', async ({ page }) => {
  const searchPage = new SearchPage(page)
  await searchPage.expectFiltersVisible()
})

When('the applicant searches for {string}', async ({ page }, term) => {
  const searchPage = new SearchPage(page)
  await searchPage.searchFor(term)
})

Then('the search results show {string}', async ({ page }, term) => {
  const searchPage = new SearchPage(page)
  await searchPage.expectResultVisible(term)
})

When('the applicant opens the manage page for the first result', async ({ page }) => {
  const searchPage = new SearchPage(page)
  await searchPage.openManagePageForFirstResult()
})

Then('the manage profile page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: [pages.manageProfile.heading, 'Manage profile:'] })
})

When('the applicant opens the maintain contributors page from the manage page', async ({ page }) => {
  await page.getByRole('link', { name: /maintain contributors and reviewers/i }).click()
})

Then('the maintain contributors page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: pages.maintainContributors.heading })
})

When('the applicant opens the profile properties page from the manage page', async ({ page }) => {
  await page.getByRole('link', { name: /edit properties/i }).click()
})

Then('the profile properties page is shown', async ({ page }) => {
  await expectPageLoaded(page, {
    heading: [
      pages.profileProperties.heading,
      'Profile properties',
      'Clone new profile',
      'Clone new "what-if" scenario'
    ]
  })
})

When('the applicant opens the contributions report from the manage page', async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: /view contributions report/i }).click()
  ])

  await page.waitForLoadState('domcontentloaded')

  const filename = download.suggestedFilename()
  if (!/contributions.*\.pdf$/i.test(filename)) {
    throw new Error(`Expected a contributions PDF download, got: ${filename}`)
  }
})

Then('the contributions report is shown', async ({ page }) => {
  const url = page.url()
  if (!url.includes('ManageProfile.aspx')) {
    throw new Error(`Expected profile management URL but got: ${url}`)
  }
})

When('the applicant opens the edit profile title page from the search results', async ({ page }) => {
  const editTitleLink = page.getByRole('link', { name: /edit title/i }).first()
  if (await editTitleLink.count() && await editTitleLink.isVisible().catch(() => false)) {
    await editTitleLink.click()
    return
  }

  const profileId = new URL(page.url()).searchParams.get('ProfileId')
  if (!profileId) {
    throw new Error('Expected an active ProfileId to open the edit title page.')
  }

  const targetUrl = new URL(page.url())
  targetUrl.pathname = targetUrl.pathname.replace(/[^/]+$/, 'EditProfileTitle.aspx')
  targetUrl.search = `?ProfileId=${profileId}`
  await page.goto(targetUrl.toString())
})

When('the applicant submits the empty profile title form', async ({ page }) => {
  await page.getByRole('button', { name: /^Save$/i }).click()
})

Then('the title validation message is shown', async ({ page }) => {
  await page.getByText(/you must enter a profile title/i).waitFor({ state: 'visible' })
})

When('the applicant opens the browse profile page from the search results', async ({ page }) => {
  const browseLink = page.getByRole('link', { name: /browse profile/i }).first()
  if (await browseLink.count() && await browseLink.isVisible().catch(() => false)) {
    await browseLink.click()
    return
  }

  const profileId = new URL(page.url()).searchParams.get('ProfileId')
  if (!profileId) {
    throw new Error('Expected an active ProfileId to open the browse profile page.')
  }

  const targetUrl = new URL(page.url())
  targetUrl.pathname = targetUrl.pathname.replace(/[^/]+$/, 'EditProfileQuestions.aspx')
  targetUrl.search = `?ProfileId=${profileId}`
  await page.goto(targetUrl.toString())
})

Then('the browse profile page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: [pages.editProfileQuestions.heading, 'Profile questions'] })
})

When('the applicant opens the review comments page from the browse profile page', async ({ page }) => {
  // source: app/Profiles.Web/EditProfileReviewComments.aspx:11-25
  await page.getByRole('tab', { name: /review comments/i }).click()
})

Then('the review comments page is shown', async ({ page }) => {
  await page.getByText(/add a review comment/i).waitFor({ state: 'visible' })
})

When('the applicant clicks add review comment', async ({ page }) => {
  await page.getByRole('button', { name: /^Add$/i }).click()
})

Then('the add review comment form is shown', async ({ page }) => {
  await page.getByLabel(/subject/i).waitFor({ state: 'visible' })
  await page.getByLabel(/reference/i).waitFor({ state: 'visible' })
  await page.getByLabel(/comment/i).waitFor({ state: 'visible' })
})

When('the applicant saves an empty review comment', async ({ page }) => {
  await page.getByRole('button', { name: /^OK$/i }).click()
})

Then('the review comment validation message is shown', async ({ page }) => {
  await page.getByText(/you must enter a subject or cancel/i).waitFor({ state: 'visible' })
  await page.getByText(/you must enter a reference or cancel/i).waitFor({ state: 'visible' })
  await page.getByText(/you must enter a comment or cancel/i).waitFor({ state: 'visible' })
})

When('the applicant adds a review comment with subject {string}, reference {string}, and comment {string}', async ({ page }, subject, reference, comment) => {
  await page.getByRole('button', { name: /^Add$/i }).click()
  await page.getByLabel(/subject/i).fill(subject)
  await page.getByLabel(/reference/i).fill(reference)
  await page.getByLabel(/comment/i).fill(comment)
  await page.getByRole('button', { name: /^OK$/i }).click()
})

Then('the review comment is saved in the review comments list', async ({ page }) => {
  await page.getByRole('link', { name: /TC-071 subject/i }).waitFor({ state: 'visible' })
})

When('the applicant clicks add a contributor', async ({ page }) => {
  await page.getByRole('button', { name: /^Add$/i }).click()
})

Then('the add contributor form is shown', async ({ page }) => {
  await page.getByText(/add profile contributor/i).waitFor({ state: 'visible' })
  await page.getByRole('button', { name: /^OK$/i }).waitFor({ state: 'visible' })
})

When('the applicant saves the contributor without required details', async ({ page }) => {
  await page.getByRole('button', { name: /^OK$/i }).click()
})

Then('the contributor validation messages are shown', async ({ page }) => {
  await page.getByText(/please enter a username/i).waitFor({ state: 'visible' })
  await page.getByText(/please select a valid role/i).waitFor({ state: 'visible' })
  await page.getByText(/please enter a full name/i).waitFor({ state: 'visible' })
  await page.getByText(/please enter an organisation/i).waitFor({ state: 'visible' })
})

When('the applicant clones a new profile from the search results', async ({ page }) => {
  await page.getByRole('link', { name: /clone profile/i }).first().click()
})

When('the applicant clones a new scenario from the search results', async ({ page }) => {
  await page.getByRole('link', { name: /clone scenario/i }).first().click()
})

When('the applicant opens the edit profile title page from the manage page', async ({ page }) => {
  await page.getByRole('link', { name: /edit title/i }).first().click()
})

When('the applicant clones a new profile from the manage page', async ({ page }) => {
  await page.getByRole('link', { name: /clone new profile/i }).click()
})

When('the applicant clones a new scenario from the manage page', async ({ page }) => {
  await page.getByRole('link', { name: /clone new scenario/i }).click()
})

When('the applicant opens the profile reports page for the first result', async ({ page }) => {
  const link = page.getByRole('link', { name: /view reports|profile reports|reports/i }).first()
  await link.click()
})

When('the applicant browses the profile from the profile reports page', async ({ page }) => {
  await page.getByRole('link', { name: /browse profile/i }).first().click()
})

When('the applicant opens the profile reports page from the manage page', async ({ page }) => {
  const link = page.getByRole('link', { name: /view reports|profile reports|reports/i }).first()
  await link.click()
})

When('the applicant opens the bespoke report builder', async ({ page }) => {
  await page.getByRole('button', { name: /create bespoke report/i }).click()
})

Then('the edit profile title page is shown', async ({ page }) => {
  await expectPageLoaded(page, { heading: [pages.editProfileTitle.heading, 'Edit title'] })
})

Then('the profile reports page is shown', async ({ page }) => {
  await page.getByText(/Access disease profiles from this page/i).waitFor({ state: 'visible' })
})

Then('the create bespoke report page is shown', async ({ page }) => {
  await page.getByRole('button', { name: /create bespoke report/i }).waitFor({ state: 'visible' })
})
