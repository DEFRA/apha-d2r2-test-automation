import { resetA11y } from './a11y.js'
import { resetWcagReports } from './a11y-wcag-report.js'

export default async function globalSetup() {
  resetA11y()
  // Stale worker state and old *_latest reports would otherwise leak into this run.
  resetWcagReports()
}
