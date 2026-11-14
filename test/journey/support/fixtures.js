// playwright-bdd 9 requires `test` to be extended from its own base test, so `createBdd`
// accepts it. `expect` still comes from @playwright/test (playwright-bdd does not export it).
import { test as bddTest } from 'playwright-bdd'
import { expect } from '@playwright/test'
import { init, resetWcagResult } from 'wcag-js-v2'
import { createBdd } from 'playwright-bdd'
import { randomUUID } from 'node:crypto'
import { apiBaseUrl } from './env.js'
import { installNavigationScanner } from './a11y-navigation.js'
import { persistWcagState } from './a11y-wcag-report.js'
import { browserWithDebuggingPort } from './a11y-browser.js'

/**
 * The single test object every step uses. It adds:
 *   runId    unique per test, used to seed builders and prefix created data
 *   api      an APIRequestContext pointed at API_BASE_URL
 *   cleanup  register teardown; runs in reverse order even when the test fails
 *   role     the role this test runs as, checked against the @role: tag
 *
 * It also installs the navigation-driven accessibility scanner as an auto fixture, so every
 * page a test visits is analysed without a step calling `scanPage()` after a navigation.
 */
export const test = bddTest.extend({
  // Each worker launches Chromium on its own debugging port so Lighthouse can attach to the
  // browser that ran the page, even when workers run in parallel.
  browser: [browserWithDebuggingPort, { scope: 'worker' }],

  /**
   * Automatic WCAG scanning on navigation (support/a11y-navigation.js). Scans are queued in
   * the background and awaited here, so a failure is reported against the test that caused it.
   */
  a11yNavigation: [async ({ page }, use) => {
    const scanner = installNavigationScanner(page)
    await use(scanner)
    await scanner.flush()
    scanner.stop()
  }, { auto: true }],

  /**
   * Starts the wcag-js-v2 run before this worker's first test. The worker only snapshots its
   * scans on teardown; the four reports are written once by the global teardown
   * (support/a11y-report.js), after every test has finished.
   */
  a11yReports: [async ({}, use, workerInfo) => {
    const enabled = process.env.A11Y_SCAN !== 'false'
    if (!enabled) {
      await use()
      return
    }

    resetWcagResult()
    await init()
    await use()

    persistWcagState(workerInfo.workerIndex)
  }, { scope: 'worker', auto: true }],
  /**
   * Fails fast when a scenario's @role: tag disagrees with the project it is running in,
   * instead of quietly testing with the wrong saved session.
   */
  role: async ({}, use, testInfo) => {
    const projectRole = testInfo.project.metadata?.role ?? 'anonymous'
    const tag = testInfo.tags.find((t) => t.startsWith('@role:'))
    if (tag && projectRole !== 'setup' && tag.slice('@role:'.length) !== projectRole) {
      throw new Error(
        `Scenario is tagged ${tag} but project "${testInfo.project.name}" runs as "${projectRole}". ` +
          `Run it with --project=${tag.slice('@role:'.length)}, or fix the tag.`
      )
    }
    await use(projectRole)
  },

  runId: async ({}, use) => {
    await use(`${Date.now().toString(36)}-${randomUUID().slice(0, 6)}`)
  },

  api: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: apiBaseUrl(),
      extraHTTPHeaders: { Accept: 'application/json' }
    })
    await use(context)
    await context.dispose()
  },

  cleanup: async ({}, use) => {
    /** @type {Array<() => Promise<void> | void>} */
    const tasks = []
    await use(async (task) => {
      tasks.unshift(task)
    })
    for (const task of tasks) {
      try {
        await task()
      } catch (error) {
        console.warn(`teardown failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }
})

export { expect }

/** Step definitions use these, never `test` from @playwright/test directly. */
export const { Given, When, Then, Before, After, BeforeAll, AfterAll } = createBdd(test)
