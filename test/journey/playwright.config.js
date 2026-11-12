import 'dotenv/config' // .env is read here and inherited by the test workers
import { defineConfig } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

/**
 * playwright-bdd generates Playwright tests from features/ + steps/. Without this call the
 * suite silently finds zero tests, which is the most common way a BDD scaffold is wasted.
 */
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  // The fixtures file must be listed here: playwright-bdd reads `test` from it to bind steps
  // to the custom test instance. Omitting it fails with "Can't guess test instance".
  steps: ['support/fixtures.js', 'steps/**/*.js']
})

const ci = !!process.env.CI
const appBaseUrl = (process.env.UI_BASE_URL ?? '').replace(/\/$/, '').replace(/\/(?:Home|Search)\.aspx$/, '')

export default defineConfig({
  testDir,
  forbidOnly: ci,
  grepInvert: [/@obsolete/, process.env.RUN_KNOWN_DEFECTS ? null : /@known-defect/, process.env.RUN_WIP ? null : /@wip/, process.env.EDITOR_ACCOUNT ? null : /@needs:editor/].filter(Boolean), // @obsolete: page no longer exists in CDC.Web; @known-defect: fails until the logged defect is fixed (RUN_KNOWN_DEFECTS=1); @wip: unfinished; @needs:editor: requires the ProfileEditor role (EDITOR_ACCOUNT=1)
  retries: ci ? 1 : 0,
  workers: 1,
  fullyParallel: false,
  globalSetup: './support/a11y-setup.js', // clears old scan results
  globalTeardown: './support/a11y-report.js', // builds reports/a11y/a11y-report.html
  outputDir: 'test-results',
  reporter: ci
    ? [['github'], ['line'], ['junit', { outputFile: process.env.PLAYWRIGHT_JUNIT_OUTPUT_FILE ?? 'reports/junit/results.xml' }]]
    : [['list'], ['html', { outputFolder: 'reports/playwright', open: 'never' }]],
  use: {
    baseURL: appBaseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-testid',
    // This app is session/auth sensitive and works only in the normal browser profile.
    // Do not add --incognito/--inPrivate here; regular browser context is required.
    launchOptions: {
      args: []
    }
  },
  projects: [
    // Logs in once and writes .auth/user.json.
    {
      name: 'setup',
      testDir: './support',
      testMatch: /auth\.setup\.js/,
      metadata: { role: 'setup' }
    },
    {
      name: 'journey',
      dependencies: ['setup'],
      use: { storageState: '.auth/user.json' },
      metadata: { role: 'sso' }
    }
  ]
})
