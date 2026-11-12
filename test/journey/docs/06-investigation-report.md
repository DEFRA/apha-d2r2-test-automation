# Investigation report (2026-11-11)

Source `apha-cdc-apps` 0576aaa (.NET Razor, `CDC.Web` + `CDC.Api`). Profile `gds`. Run: full suite with `RUN_WIP=1`, 163 tests, 35.6 min: **35 passed, 128 failed**. Evidence: `run-gds-wip.log`, `test-results/*/error-context.md`, `scripts/summarise-run.js`, `scripts/classify-failures.js`.

## 1. Blocker B-1: test account has no ProfileEditor role

The signed-in account sees only Disease Profiles > Search, Reports > General reports and Disease ranking report, Species Data > View species data. Editor pages render "You do not have permission to view this page" (`test-results/features-global-users-main-6330b--global-users-page-directly-journey/error-context.md`). This matches policy in `CDC.Web/Authorization/Policies/AuthorizationPolicyRegistration.cs` (editor-only: create/edit profile, compare, review timings, species maintenance, user guidance, global/external users, reference data, prioritisation variables, cross-cutting scores, ranking filters, publish, clone, contributors).

| Failure class | Count | Cause |
|---|---|---|
| Access denied page on editor route | 56 | Role missing (expected behaviour, not an app defect) |
| Timeout or missing link/ProfileId (Manage, Clone, menu entries for editor pages) | 72 | Same cause: actions hidden for this role; 12 of these are in `search`, 9 `profile-lifecycle`, 12 `profile-management`, 8 `profile-editing`, 7 `home` |

Action needed outside this pack: set `USER_NAME`/`USER_PASSWORD` to an account with `ProfileEditor`, as local or pipeline variables. I did not read or change credentials.

## 2. Coverage position (source pages vs pack)

45 pages catalogued in `docs/discovery/cdc-web-inventory.md`. Every area has at least one feature. Gaps found against source (no scenario exists):

| Gap | Evidence |
|---|---|
| Spellcheck endpoints (3 POST) | `Features/SpellCheck/SpellCheckController.cs:32,56,76` |
| `SpeciesData/Maintain` handlers: reorder, move up/down, inactivate and confirm, delete and confirm | 19 handlers in `Pages/SpeciesData/Maintain.cshtml.cs` |
| General reports upload, delete, make public | `Reports/General` handlers |
| Help static report upload/delete and document download | `HelpSupport/StaticReports`, `Program.cs:354` |
| Ranking filters create/select/save/delete | `DiseaseRanking/EditFilters` |
| Profile `ProfileReports` regenerate and download | `ProfileReports.cshtml.cs` |
| `EditProfileFurtherInformation` tick-all/untick-all/delete; `EditProfileAllRevisionDates`; `EditProfileReferences`; `Notes` | page handlers |
| `AllowPublicAccess`, `PublishPublic`, `PublishDefranetOnly`, `CloneNewProfile`, `DeleteCurrentVersion` | `SurveillanceProfiles/*` |
| `ViewDraftSummaryReport`, `ViewProfilePrintVersion`, `ViewProfileGuidanceReport` | `SurveillanceProfiles/*` |
| Permission scenarios for non-editor role on every editor route (can run now) | 56 denied pages observed |
| Ten pages without `[Authorize]` rely on the API per profile | inventory table |
| Session endpoints (extend, expire) | `SessionController.cs:26,43,63` |

Existing scenarios were written against the legacy ASP.NET app and its route names. Headings and routes were realigned in `content/routes.js`; step and page-object locators for editor pages remain NOT VERIFIED because they cannot be reached with the current role.

## 3. Test amendments

| Test case | Reason | Change |
|---|---|---|
| All TCs navigating via `routes` (gds) | UI update: routes guessed, not real | `content/routes.js` gds routes replaced from `Pages/**/*.cshtml`; 7 headings corrected |

Impact: all `gds` navigation scenarios; no steps or features changed.

## 4. Defects

None confirmed. Observed behaviour that needs a product decision is in `docs/04-potential-defects.md`.

## 5. Risks

- 128 of 163 scenarios cannot be validated with the current account; the pack claim of coverage for editor features is NOT VERIFIED.
- Search, species view, general reports and ranking report are the only areas verifiable now; their 31 default scenarios pass (35 including setup).
- Previous status (14 failing, legacy app) is superseded; the legacy base URL is no longer in use.

## 6. Next steps

1. Provide an editor-role account (B-1), then re-run `RUN_WIP=1` and triage the 72 non-denied failures.
2. Add the permission and the gap scenarios in section 2.
3. Live crawl per role once two roles exist.

## 7. Update after crawl (2026-11-11, second pass)

Live crawl (`scripts/crawl.js`, read-only, 20 route templates, `docs/discovery/crawl.json`) confirms the account sees only: Landing, Search, Species view, General reports, Disease ranking (stored PDF download), Help (reports table), Quality statement, profile browse/reports. No editor link is rendered anywhere. The "permission" conclusion is therefore a source-and-crawl fact, not a test fault.

Amendment report

| Test case | Reason for change | Previous behaviour | Updated behaviour | Changes made | Impact |
|---|---|---|---|---|---|
| 122 TCs (TC-009..TC-173 editor set) | Incorrect expectation: run as non-editor | Ran by default (or hidden by blanket `@wip`) and failed on the permission page or on missing links | Tagged `@needs:editor`; run only with `EDITOR_ACCOUNT=1` | Tags in features; `playwright.config.js` grepInvert | Default run no longer reports false failures; nothing weakened |
| TC-164, 165, 166 | Page removed: review email is a background job (`ReviewNotificationsJob`), question help page absent in CDC.Web | Opened ReviewEmail and ProfileQuestionHelp pages | Tagged `@obsolete`, excluded | Tags in feature | Needs a product decision to retire the ADO cases |
| TC-050, 099, 133 | UI update: session timeout is a dialog plus `/Session/Status` and `/Session/Extend`, not a page | Opened a session timeout page | Status JSON active with time left; dialogs present but hidden; Extend without token returns 400 | Feature, steps, content, cases | Passing |
| All gds navigation TCs | UI update: guessed routes | kebab-case routes | Routes from Razor pages | `content/routes.js` | Passing for reachable pages |

New scenarios (all passing in the default run): TC-174 (13 editor routes show the permission page), TC-175 (return home from it), TC-176 (home offers no editor links), TC-177 (sort 7 report table columns on General reports and Help), TC-178 (version history), TC-179 (items per page).

Default run: 64 passed, 0 failed (includes setup). Command: `npx playwright test --reporter=line,json --timeout=30000` from `test/journey`. `trace-check`: 213 cases, 168 scenarios, 0 problems (includes 45 manual cases).

Not done: search combinations, filters and species view depth for this role (crawl lists 142 search inputs: text up to 255 chars, three status checkboxes, exact-phrase and all-words, appears-in, sort, page size, A-Z letters, species tree), profile report generation, editor-role coverage (122 scenarios unverified against the new UI), lint, a11y report and coverage gates (NOT VERIFIED).

## 8. Search field coverage (2026-11-11, third pass)

Scope per request: this URL and role only. Live probe of 55 searches (live probe run 2026-11-11 (script removed), read-only GET) plus source (`Search.cshtml`, `Search.cshtml.cs`, `_SearchResults.cshtml`) gave the field list; every field is now covered by TC-180 to TC-201 (`features/search-fields/search-fields.feature`, 22 cases, 58 test runs, all passing).

| Field | Rules observed | Cases |
|---|---|---|
| Search text (max 255) | blank, exact, case-insensitive, prefix, suffix, contains, no match, digits, special characters, markup, whitespace-only, 255 and 300 characters, script/SQL blocked with 403 | TC-180..186 |
| Search for (exact phrase / all words) | word order matters for exact, not for all words | TC-187 |
| Appears in (5 options) | selection kept; no effect on results (defect) | TC-188 |
| Display published / draft / scenarios | each alone, all, none | TC-189..191 |
| Sort by (4 options) | selection kept; A-Z and Z-A order | TC-192, 193 |
| Items per page (10, 15, 20, 30, All) | count limit; pagination Next | TC-194, 195 |
| Letters (All, A to Z) | begins-with, empty letter, reset, letter plus text | TC-196..199 |
| Affected species tree | first species selected and reported | TC-200 |
| Combination | text, status, sort, page size | TC-201 |

Not covered: multi-species selection, every one of the 26 letters, species tree expand and collapse, the Show previous versions button. Direct query-string deep links were used only by the blank-count comparison helper.

Defects raised (see `docs/04-potential-defects.md`): Appears in ignored, 403 on script/SQL patterns, scenarios-only empty, arbitrary PageSize accepted. `trace-check`: 235 cases, 190 scenarios, 0 problems.

## 9. Species filter, site links and help (2026-11-11, fourth pass)

Species filter (`features/species-filter/`, TC-202 to TC-211): one species (Frogs and toads, Newts, Birds), three species at once, group then member, clearing, close/open all, species with text, hide, and the View species data page (choose one, choose a second replaces it, remove, open data).

Observed on the live app: Frogs and toads gives 1 profile, Newts 0, Birds 32; three species give the union of their results (the count is at least the largest single count, at most their sum, and equals the count for the three together). Ticking a member of a ticked group unticks the group (tree is hierarchy-exclusive, not cascading). Clearing the last species returns the status to "Any species".

Links (`features/site-links/`, TC-212 to TC-224): header home link, D2R2 Home breadcrumb and Help link from Search, General reports and View species data; skip link; back to top; quality statement download; footer placeholder links; APHA logo; header help icon; header menu open and navigation; manual download; support email links; report download; history version download.

Verification: all species-filter and site-links runs passed after fixing the skip-link focus and the menu locators (`#app-menu-toggle`, `#app-menu-panel`). `trace-check`: 258 cases, 213 scenarios, 0 problems. New defects: footer placeholder links, quality statement is a download, lower-case species heading.

## 10. Deep gap analysis for this URL and role (2026-11-11, fifth pass)

Method: source (`Pages/**` handlers and policies, `_SearchResults.cshtml`, `Search.cshtml`, `_Layout.cshtml`), three live read-only probes, then a route-by-route matrix. Role: non-editor (no ProfileEditor).

| Reachable route | Cases | Status |
|---|---|---|
| Landing/Internal, header, footer, menu | TC-001..008, 176, 212..220 | covered |
| Search (all fields, paging, species) | TC-006/007/030, 116, 129, 180..211, 229 | covered |
| Search result card: current version, status, View reports, Browse profile, previous versions | TC-225..228 | covered (new) |
| Profile reports page and three PDF downloads | TC-059, 141, 163, 230..232 | covered (new) |
| Browse profile: version, tabs, section toggle, Show all, contents, Next page | TC-067, 068, 233..238 | covered (new); tab content not asserted |
| View species data and species data chapters | TC-089..090, 109, 130, 209..211, 239..241 | covered (new) |
| General reports, Help, history, downloads | TC-017, 034, 087, 088, 177..179, 221..224 | covered |
| Disease ranking report (stored PDF) | TC-003 | covered |
| Session status, extend, dialogs | TC-050, 099, 133 | covered |
| Permission boundary on 13 editor routes | TC-174..176 | covered |
| Unknown address, malformed GUID, unknown species | TC-242 | covered (new) |
| Application error page | TC-051, 100, 134 | covered |

Superseded: TC-144, 147, 148, 149, 151 were legacy browse-tab and report scenarios; the same behaviour is now TC-231 and TC-237, so they are tagged `@obsolete`. TC-146, 150, 152 stay `@needs:editor` because the Contributions and All revision dates tabs and the print version are not offered to this role.

Remaining gaps (not covered): content of the References and Further information tabs; the other 22 letters; search result page 15 and the ellipsis; order of "Most recently updated" and "Least recently updated"; the Spell check dialog on browse pages; mobile viewport (menu toggle); `/Landing/External` for an internal user (observation only).

Gates run: `npx eslint .` 0 errors, 4 warnings (`force: true` on styled checkboxes); `npm run grounding` passed; `npm run a11y:report` produced `reports/a11y/a11y-report.html` (1 page scanned in that run); `trace-check` 276 cases, 231 scenarios, 0 problems. The `steps/**` ESLint config now sets `playwright/no-standalone-expect` off because BDD steps run inside a generated test; this is a config change to review.

New defects: zero-GUID profile returns 200, print version for unknown profile returns 200, Help static reports heading with large PageSize, external landing reachable.

## 11. Gap closure (2026-11-11, sixth pass)

Closed in `features/gap-closure/` (TC-243 to TC-249): the 22 remaining letters, the 26 letter counts add up to the total (142), the last results page (2 profiles, Previous but no Next), recency sort (newest first date is not earlier than the oldest), References tab groups, header menu on a 375 px screen. TC-248 (Further information tab loads without an error) is `@known-defect`: it fails because the tab shows "There is a problem", excluded from the default run, run with `RUN_KNOWN_DEFECTS=1`.

Also changed: `data/page-inventory.json` replaced the legacy `.aspx` routes with the current routes (reachable and `role: editor`), so the accessibility report lists real unscanned pages; the species data page and the References and Further information tab pages are now scanned.

Not closable: the 122 `@needs:editor` scenarios need an editor account; the Spell check dialog belongs to the editors' rich-text editing and is not reachable for this role.

Gates (final): default suite 210 passed, 0 failed (includes setup); `npx eslint .` 0 errors, 4 warnings; `trace-check` 283 cases, 238 scenarios, 0 problems; `npm run grounding` passed; `npm run a11y:report` scanned 9 pages, all 9 with violations (10 serious: color-contrast 9, target-size 1). `npm run a11y:coverage` and `a11y:baseline` are NOT IN PROJECT: `scripts/a11y-coverage.js` and `scripts/a11y-baseline.js` are not shipped by the a11y skill templates.

## 12. Accessibility coverage (final run)

Full default run 210 passed, 0 failed. 11y:report: 12 pages scanned, 12 with violations (13 serious: color-contrast 12, target-size 5 nodes on Search). Scanned: Landing, Search, General reports, Help, View species data, Species data, Profile reports, Browse profile, References tab, Further information tab, Application error, Access denied. Not scanned: the 17 editor-only pages in data/page-inventory.json (role: editor), which this account cannot open. Scans cover default page states only, not every dialog, validation error or empty state. This supersedes the 9-page figure in section 11.
