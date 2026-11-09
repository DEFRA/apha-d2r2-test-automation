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
const configuredRoles = (process.env.E2E_ROLES ?? 'sso')
  .split(',')
  .map((role) => role.trim())
  .filter(Boolean)
const defaultStorageState = configuredRoles.includes('sso')
  ? { storageState: '.auth/sso.json' }
  : configuredRoles.includes('applicant')
    ? { storageState: '.auth/applicant.json' }
    : configuredRoles.includes('admin')
      ? { storageState: '.auth/admin.json' }
      : {}

export default defineConfig({
  testDir,
  forbidOnly: ci,
  grepInvert: /@wip/, // work-in-progress scenarios are generated but never run
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
    // Logs in once per role and writes .auth/<role>.json. Add or remove roles here.
    {
      name: 'setup',
      testDir: './support',
      testMatch: /auth\.setup\.js/,
      metadata: { role: 'setup' }
    },
    ...(
      configuredRoles.includes('sso') || configuredRoles.includes('applicant') || configuredRoles.includes('admin')
        ? [{
            name: 'journey',
            dependencies: ['setup'],
            use: defaultStorageState,
            metadata: {
              role: configuredRoles.includes('sso')
                ? 'sso'
                : configuredRoles.includes('admin')
                  ? 'admin'
                  : 'applicant'
            }
          }]
        : []
    ),
    // Copy this block per additional role, then run with --project=<name>.
    ...(
      configuredRoles.includes('admin')
        ? [{
            name: 'admin',
            dependencies: ['setup'],
            use: { storageState: '.auth/admin.json' },
            metadata: { role: 'admin' }
          }]
        : []
    ),
    // No saved session: login and permission scenarios.
    ...(
      configuredRoles.length === 0 || configuredRoles.includes('anonymous')
        ? [{
            name: 'anonymous',
            metadata: { role: 'anonymous' }
          }]
        : []
    )
  ]
})
