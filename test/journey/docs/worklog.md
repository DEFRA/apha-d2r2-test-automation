# Worklog

| When | Phase | Unit | Fingerprint | Result | Evidence |
|---|---|---|---|---|---|
| 2026-11-11 | preflight | inputs: source `C:\Dev\Laps-new\apha-cdc-apps` (.NET Razor, CDC.Web), url from `.env` UI_BASE_URL, UI_PROFILE=gds | src `0576aaa` / pack `e8785b3` | done | `.env` keys only read |
| 2026-11-11 | adopt | existing pack (24 features, 162 TCs, legacy-app grounded) | `e8785b3` | adopted | `docs/03-build-report.md` |
| 2026-11-11 | discover | CDC.Web Razor pages (45 pages, 2 session endpoints, 3 spellcheck endpoints, 1 static-report download) | src `0576aaa` / 45 routes | done | `content/routes.js` gds entries |
| 2026-11-11 | amend | `content/routes.js`: guessed kebab-case gds routes replaced by CDC.Web page routes; 7 headings corrected from `<h1>` | `e8785b3` | done | `content/routes.js` |
| 2026-11-11 | execute | full suite vs gds profile | `e8785b3` | running | `reports/playwright/` |
| 2026-11-11 | discover | route x policy x handler inventory | src `0576aaa` / 45 pages | done | `docs/discovery/cdc-web-inventory.md` |
| 2026-11-11 | execute | full suite RUN_WIP=1 gds profile | `e8785b3` | done: 35 pass, 128 fail | `run-gds-wip.log` |
| 2026-11-11 | triage | 56 access-denied + 72 hidden-action failures; blocker B-1 non-editor account | `e8785b3` | done | `docs/06-investigation-report.md` |
| 2026-11-11 | verify | gds routes under /Landing/Internal prefix (user request) tried on TC-103 | `e8785b3` | failed: page.goto ERR_HTTP_RESPONSE_CODE_FAILURE; reverted | `content/routes.js` |
| 2026-11-11 | crawl | live read-only crawl, 20 templates | `e8785b3` / 20 routes | done | `docs/discovery/crawl.json` |
| 2026-11-11 | amend | retag 122 @needs:editor, 3 @obsolete, rewrite TC-050/099/133, add TC-174..179, regenerate cases+CSV | `e8785b3` | done: trace 0 problems | `docs/06-investigation-report.md` |
| 2026-11-11 | execute | default suite gds | `e8785b3` | done: 64 pass, 0 fail | `run-gds.log` |
| 2026-11-11 | discover | search form probe, 55 searches + source | `e8785b3` | done | live probe run 2026-11-11 (script removed) |
| 2026-11-11 | build | search-fields feature TC-180..201, regenerate cases | `e8785b3` | done: 58 pass, trace 0 problems | `features/search-fields/` |
| 2026-11-11 | build | species-filter TC-202..211 and site-links TC-212..224, regenerate cases | `e8785b3` | done: all pass in targeted runs; trace 0 problems | `features/species-filter/`, `features/site-links/` |
| 2026-11-11 | execute | full default suite gds | `e8785b3` | done: 160 pass, 0 fail | `run-gds.log` |
| 2026-11-11 | discover | deep probes: search card, profile reports, browse, species chapters, error routes | `e8785b3` | done | `docs/06-investigation-report.md` section 10 |
| 2026-11-11 | build | profile-browse TC-225..242; 5 legacy TCs obsolete; lint fixes; eslint steps override | `e8785b3` | done: 25 pass targeted, lint 0 errors, trace 0 problems | `features/profile-browse/` |
| 2026-11-11 | execute | full default suite after step refactor | `e8785b3` | done: 184 pass, 0 fail | `run-gds.log` |
| 2026-11-11 | build | gap-closure TC-243..249; page inventory rewritten; a11y scans for species and tabs; known-defect tag | `e8785b3` | done: 27 pass + TC-248 known defect | `features/gap-closure/` |
| 2026-11-11 | execute | full default suite + a11y report | `e8785b3` | done: 210 pass, a11y 12 scanned / 12 with violations | `reports/a11y/a11y-report.html` |
