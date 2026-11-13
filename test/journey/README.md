# Journey tests

Playwright + `playwright-bdd` + Page Object Model, for one service with two UI profiles
(`legacy` and `gds`). Steps are plain JavaScript (ES modules); there is no TypeScript.

## First run

```
npm ci
cp .env.example .env        # fill in the URLs and credentials; playwright.config.js loads it with dotenv
npx playwright install      # once per machine
npm run auth                # writes .auth/user.json
npm run bdd
```

## Commands

| Command | What it does |
|---|---|
| `npm run bdd` | generate tests from `features/` + `steps/`, then run them |
| `npm run smoke` | run only `@smoke` |
| `npm run regression` | run only `@regression` |
| `npm run feature -- @feature:applicant-details` | one feature |
| `npm run auth` | refresh saved sessions |
| `npm run lint` | ESLint, including the no-sleep / no-only / no-skip rules |
| `npm run trace` | test-case↔scenario traceability, CSV freshness |
| `npm run grounding` | every endpoint, page locator and content entry cites `// source:` |
| `npm run readiness` | profile-dependency and legacy-only marker report |
| `npm run a11y:report` | rebuild the accessibility HTML and JSON report |
| `npm run a11y:coverage` | every inventory route scanned, templated or waived |
| `npm run a11y:baseline` | diff (or `--update`) the legacy accessibility baseline |
| `npm run automation:map` | link ADO test cases to their JUnit results |

## Layout

```
features/{domain}/<f>.feature    one per docs/test-cases/<f>.json
steps/{domain}/*.steps.js        thin: call flows, pages and clients
pages/  components/  flows/       locators, GOV.UK widgets, business tasks
api/    data/    assertions/      REST clients, seeded builders, shared assertions
content/                          every label, message, route and page heading
support/                          env, fixtures, profiles, a11y (scan + navigation hook), text helpers
scripts/                          trace-check, grounding, readiness, a11y helpers, automation map
docs/                             discovery, plan, test cases, reports
```

`content/` is the migration surface. After the cutover, only `content/`, `components/` and
`flows/` should need to change; steps and feature files must not.

## Two profiles

`UI_PROFILE=legacy|gds` selects the UI. A value that is not one of those throws at import.
`byProfile` requires the active profile's key, so a forgotten `gds` variant fails at first use
rather than quietly running a legacy selector against the new UI.

## Accessibility scanning

Every page the tests visit is scanned automatically. `support/a11y-navigation.js` hooks the
Playwright navigation lifecycle (`page.goto`, `reload`, `goBack`, `goForward`, `waitForURL`,
`waitForNavigation`, and the `framenavigated` / `load` events) and runs the WCAG audit when a
navigation settles. Steps, flows and page objects must not call `scanPage()` or `analyse()`
after a navigation: the auto fixture in `support/fixtures.js` installs the hook for every test.

- One audit per navigation. The several signals one navigation produces (the awaited call,
  `framenavigated`, `load`) collapse into a single audit, a URL already analysed is skipped,
  and `support/a11y.js` still skips a route and template already scanned in the run, across
  workers. Set `A11Y_NAV_SETTLE_MS` only when a client-rendered page needs extra time after
  load (default 0).
- Multiple pages are covered: pages opened from the test's page (popups, new tabs) are watched
  too.
- `expectPageLoaded` waits for the landing page's automatic audit, so the next navigation
  cannot pre-empt it. No step calls `scanPage()` for a navigation.
- Scans are reported, not enforced, by default. Set `A11Y_ENFORCE=true` to fail a test on a
  violation (`failOn` in `support/a11y.js`).
- `A11Y_NAV_SCAN=false` disables automatic scanning; `A11Y_DIR` moves the output directory.
- Results go to `reports/a11y/` (JSON per page, skipped routes, `a11y-report.html` and
  `a11y-summary.json`); rebuild the report alone with `npm run a11y:report`.
- Lighthouse runs on every scanned page, beside the axe scan. Chromium is started with
  `--remote-debugging-port` (`playwright.config.js`) and Lighthouse attaches to that browser
  instead of launching a second Chrome; its tab has none of the Playwright cookies, so the
  session is forwarded as a `Cookie` header. Expect roughly 5 s per scanned page. Lighthouse is
  on by default: `A11Y_LIGHTHOUSE=false` (or `0`) skips it. `support/a11y-browser.js` gives each
  worker its own port, `A11Y_CDP_PORT` (default 9222) plus the worker index, so parallel
  workers never collide; raise parallelism with `PW_WORKERS` (default 1).
  `A11Y_LIGHTHOUSE_FORM_FACTOR=desktop` audits as desktop rather than mobile. A Lighthouse
  failure is logged and skipped, never failed as a test. Each audit loads the URL afresh, so a
  state-specific variant is measured on the route's default view; performance and axe results
  stay in separate reports.
- The library's own reports are written at the end of the run to `reports/`, the same layout
  and file names as the standalone wcag-test project:
  `accessibility_json_report_latest.json`, `accessibility_category_latest.html`,
  `accessibility_guideline_latest.html` and `performance_html_report_latest.html`. They are
  produced by the worker-scoped `a11yReports` fixture (worker teardown) because the scan
  results live in the worker processes, so workers persist them to `reports/.state` and the
  global teardown merges and writes the reports once, after all tests, whatever `PW_WORKERS`
  is. `A11Y_WCAG_REPORT=false` turns them off and `A11Y_WCAG_REPORT_DIR` moves them. The JSON
  report carries both tools and the performance report carries the Lighthouse scores for
  every scanned page.
- A state that keeps the same URL — an error summary, an empty or modal variant, or a page that
  differs by role — is scanned by passing `variant` / `role` to `expectPageLoaded` (or by
  calling `scanPage(page, { variant })` directly). Those keys are what keep the scan from
  being skipped as a duplicate.

The lifecycle is the library's own: `init()` runs once per worker before that worker's first
test (`a11yReports` fixture), `analyse(page, key)` runs for every navigation the hook audits and
records both Lighthouse and axe in the run state, and the four report getters run once in
`globalTeardown`, after every worker has finished. Each worker snapshots its state to
`reports/.state` at teardown; the global teardown merges those snapshots, hydrates the library
and writes one set of reports, so parallel runs still produce a single complete set. Nothing
writes `wcagResult` by hand: the per-page JSON in `reports/a11y` is read back from what
`analyse()` recorded. With `A11Y_LIGHTHOUSE=false`, `analyse()` is replaced by the library's
axe-only `collectAxeAccessibilityIssues()`, because `analyse()` always runs Lighthouse.

The audit itself comes from the packaged library in `libs/wcag-js-v2-2.0.0.tgz`, installed as
`wcag-js-v2` (plain ESM, no TypeScript). Refresh it by replacing the tarball and running
`npm install`. The library needs Node 22.19 or later, so the pack sets that as its engine and
the pipeline's Node version must match.

## Notes

- `.auth/`, `reports/` and `.features-gen/` are generated and git-ignored.
- The example feature in `features/_example/` is tagged `@wip` and is excluded from runs.
  Delete it once real features exist.
