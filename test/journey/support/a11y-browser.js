import { lighthouseEnabled } from './a11y-lighthouse.js'
import { cdpBasePort, setActiveCdpPort } from './a11y-cdp.js'

/**
 * Chromium with a debugging port unique to this worker: `A11Y_CDP_PORT` (default 9222) plus
 * the worker index. Lighthouse attaches to that port, so the port has to differ per worker or
 * parallel workers would audit each other's browser.
 *
 * Playwright's built-in `browser` fixture is overridden because `launchOptions` is resolved
 * once in the main process; the worker index only exists in the worker. Everything from
 * `use.launchOptions` and `use.headless` is preserved, minus any debugging port already
 * configured.
 *
 * @type {import('@playwright/test').Fixture<import('@playwright/test').Browser, { playwright: import('@playwright/test').Playwright }, { scope: 'worker' }>}
 */
export const browserWithDebuggingPort = async ({ playwright, browserName }, use, workerInfo) => {
  const configured = workerInfo.project.use.launchOptions ?? {}
  const headless = workerInfo.project.use.headless ?? true
  const args = (configured.args ?? []).filter((arg) => !String(arg).startsWith('--remote-debugging-port'))

  const port = lighthouseEnabled() ? cdpBasePort() + workerInfo.workerIndex : 0
  if (port > 0) args.push(`--remote-debugging-port=${port}`)
  setActiveCdpPort(port)

  const browser = await playwright[browserName].launch({ ...configured, headless, args })
  try {
    await use(browser)
  } finally {
    await browser.close()
  }
}
