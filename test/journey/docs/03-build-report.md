# Build report

Run date: 2026-11-09. UI profile: legacy. Role: sso. Base URL: http://apha-008.cvlnt.vla.gov.uk/SurveillanceProfiles/Home.aspx

## Results

| Gate | Result |
|---|---|
| `npx bddgen` | passed |
| `node scripts/trace-check.js` | passed: 162 test cases, 162 scenarios, 0 problems |
| `npx playwright test --reporter=line` (full suite, one pass, 13.6m) | **146 passed, 17 failed** (163 tests, 23.9m; latest run)  |
| a11y (collected during the run) | 14 pages scanned, 183 duplicates skipped, 13 with violations; `reports/a11y/a11y-report.html` |
| `npm run lint`, `npm run a11y:report`, coverage gates | NOT VERIFIED in this run |

## Failed tests (14)

Only TC-072 has a confirmed cause: `Test timeout of 30000ms exceeded`. The other 13 causes are NOT VERIFIED; see `test-results/*/error-context.md`.

| Feature | TCs |
|---|---|
| maintain-species-data | TC-061 |
| profile-management | TC-059, TC-060, TC-062, TC-063, TC-068, TC-141, TC-142 |
| search-disease-profiles | TC-067, TC-069, TC-070, TC-071, TC-072, TC-073 |

Failures cluster in browse profile, review comments, profile reports and report builder routes. Whether they are test or app defects is undetermined. Do not weaken assertions; log confirmed mismatches in `docs/04-potential-defects.md`.

## Coverage notes

- Reconciliation counts (routes, controls, rules, endpoints, roles) are not yet recorded; full scenario coverage is not proven.
- Only the `sso` role is exercised; there is no route-by-role matrix.
- The worklog states 138 tests at the last tranche, while this run lists 134 tests and 133 scenarios; not yet reconciled.
- Legacy-only markers are tracked in `docs/05-migration-register.md`.

## Update: profile-editing and report-windows tranches (2026-11-09)

- Added profile-editing (TC-144, 146-152: editing tabs, profile references, summary reports, print window) and report-windows (TC-153 to TC-163: disease ranking and RFI reports, four guidance reports, static report, prioritisation print, published profile report). All 19 pass; the full run above passed 139 of 153.
- The same 14 tests still fail (TC-059, 060, 061, 062, 063, 067, 068, 069, 070, 071, 072, 073, 141, 142). Likely cause, not yet fixed: the existing steps open the first browse result, a published read-only version that lacks the Review comments, All Revision dates and Contributions tabs. The profile-editing step "opens the browse profile page for an editable draft version" shows the working approach.
- Report-window scenarios only prove the window opens (and targets the expected page if it has navigated): the reports stay blank for over 20s and then close, so content is not asserted.
- Not automated: ShowProfileVersionComparisonReport (needs two ticked tree nodes in a RadTreeView; the validator message is a placeholder in source), ReviewEmail and ProfileQuestionHelp (no entry point in source), additional roles and unauthenticated access (no credentials or projects configured), create/update/delete flows and field-rule negatives (need decisions on writable test data).
- lint: `npx eslint .` clean. a11y: 13 pages scanned, 12 with violations (see `reports/a11y/a11y-report.html`). `npm run a11y:report` and coverage gates NOT VERIFIED.

## Update: additional-pages and field-rules tranches (2026-11-09)

- Added additional-pages (TC-164 to TC-169: review email notice without sending, question help window, question help without an id, compare versions with none/one/two selected) and field-rules (TC-170 to TC-173: create profile without title, global user lookup empty and wrong format, username 50-character limit). Nothing is saved by any of these.
- Full run: 146 passed, 17 failed. 14 are the known failures above. TC-165, TC-168 and TC-169 passed when their feature was run alone but failed in the full run: TC-165 waited 30s for the help popup, TC-168 found the tree checkboxes hidden after "Open all" (about 3,000 nodes), TC-169 saw no comparison window within 5s. Treat as timing flakiness, not yet fixed or re-run.
- Roles and unauthenticated access cannot be tested: authentication is Windows SSO for a single identity. A fresh browser context with no saved session still reached Home, MaintainGlobalUsers and ReviewEmail (observed), so no scenario can prove a permission boundary. Needs extra test accounts or a second role; the `admin` and `anonymous` projects exist in the config but are not usable here.
- Defect candidates for `docs/04-potential-defects.md`: ProfileQuestionHelp.aspx without ProfileQuestionId shows the generic application error (`new Guid(Nothing)` in ProfileQuestionHelp.aspx.vb:7); ReviewEmail.aspx is reachable on UAT (setting ShowReviewEmailPage is on).
- Still not automated: create/update/delete flows that persist data, and the remaining form rules (external users, reference data, contributors beyond existing cases). These need a decision on writable test data.

## ADO test cases

- docs/test-cases/<feature>.json hold full manual cases (login step, one action per step, concrete expected results, at least 5 steps) for all 162 scenarios; <feature>.csv are the ADO import files (24 files, 0 converter warnings). Regenerate with `node scripts/gen-ado-cases.js` then the skill converter (`py` here, Python 3.7). Area path is the placeholder 'Path x' until ADO_AREA_PATH is set; steps are derived from the automated scenarios and should be reviewed by a tester.

- Manual-only ADO cases (MT-001 to MT-045, layer manual, not automated) cover unauthenticated access, role-restricted pages, and data-changing flows and form rules: docs/test-cases/manual-roles-and-access.csv (25) and manual-data-changes.csv (20). trace-check ignores the missing scenario for layer manual only. Placeholders in angle brackets need real accounts and data; run them by hand on UAT.
