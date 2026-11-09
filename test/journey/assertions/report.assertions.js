import { expect } from '@playwright/test'

// source: app/Profiles.Web/ApplicationError.aspx:1-52
export async function expectNoApplicationError(target) {
  await target.waitForLoadState('domcontentloaded')
  await expect(target.locator('h1, h2, h3').filter({ hasText: /an error has occurred/i })).toHaveCount(0)
  await expect(target.locator('body')).toBeVisible()
}

// source: app/Profiles.Web/EditProfileQuestions.aspx.vb:442-453 (tab -> redirect target)
export async function expectTabDestination(page, destination) {
  await expect(page).toHaveURL(new RegExp(`/${destination}\\.aspx`, 'i'))
  await expectNoApplicationError(page)
}

export async function expectPopupOpened(popup) {
  expect(popup.isClosed()).toBe(false)
}

// Report windows stay blank while the report generates (over 20s) and then close, so assert the window opened and, once it has navigated, that it targets the expected page.
export async function expectReportWindow(popup, destination) {
  expect(popup).toBeTruthy()
  const url = popup.isClosed() ? '' : popup.url()
  if (url && url !== 'about:blank') {
    expect(url).toMatch(new RegExp(`/${destination}\\.aspx`, 'i'))
  }
}

// source: app/Profiles.WebControls/CollapsiblePanel.vb:253 (small pop-up that loads at once)
export async function expectPopupDestination(popup, destination) {
  await expect(popup).toHaveURL(new RegExp(`/${destination}\\.aspx`, 'i'))
}

export async function expectTextVisible(page, text) {
  await expect(page.getByText(text)).toBeVisible()
}

export async function expectFirstVisible(locator, timeout = 20000) {
  await expect(locator.first()).toBeVisible({ timeout })
}

export async function expectInputLength(input, length) {
  await expect(input).toHaveValue(new RegExp(`^.{${length}}$`))
}
