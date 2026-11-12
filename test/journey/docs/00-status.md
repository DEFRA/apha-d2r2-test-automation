# Status
phase: investigated and automated for the non-editor role; editor scenarios unverified
source: C:\Dev\Laps-new\apha-cdc-apps (0576aaa)
base-url: UI_BASE_URL in .env (host root pages, entry /Landing/Internal)
ui-profile: gds
role: non-editor (no ProfileEditor)
default run: 210 passed, 0 failed; trace 283 cases / 238 scenarios
blocked: 122 @needs:editor scenarios need an editor-role account (EDITOR_ACCOUNT=1)
open defects: docs/04-potential-defects.md (known-defect TC-248)
next: provide editor account, rerun with EDITOR_ACCOUNT=1
