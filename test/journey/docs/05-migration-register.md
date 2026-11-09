# Migration register

status: active
ui-profile: legacy
notes:
- Legacy page structure is ASP.NET Web Forms with server controls and master pages.
- Selectors are expected to depend heavily on server-generated ids and CSS classes.
- GDS migration work will likely impact main navigation, reports and form controls.
- Each locator should be reviewed for byProfile handling before automation.

- components/character-count.js:23 | plain textarea without a live counter in the legacy DOM | use the GOV.UK character count component with profile-aware markup | pending
- components/character-count.js:30 | missing counter element before the migration | use a GDS counter element or hide the feature in legacy | pending
- components/checkboxes.js:24 | legacy checkbox labels rely on a label/for structure | use the GOV.UK checkbox group with explicit labels | pending
- components/cookie-banner.js:22 | legacy banner is optional and data-driven | use the GDS cookie banner component or conditional wrapper | pending
- components/date-input.js:27 | legacy date field is a single free-text control | replace with a multi-field date component in GDS | pending
- components/details.js:17 | legacy details widget is a custom data attribute pattern | use the GOV.UK details component | pending
- components/error-summary.js:23 | legacy form has no error summary, so messages are inline only | render the GDS error summary and inline field errors | pending
- components/file-upload.js:19 | legacy file upload is bound to an id-based lookup | use a label-driven file upload component | pending
- components/radios.js:28 | legacy radio labels are styled text instead of input-driven labels | use the GOV.UK radio component with label mapping | pending
- components/skip-link.js:21 | legacy skip link may be absent before migration | keep the GDS skip link in the page shell and gate variants | pending
- components/table.js:18 | legacy table markup uses custom data-table hooks | replace with the GOV.UK table pattern | pending
- components/tag.js:17 | legacy tag widget is a custom data attribute pattern | switch to the GOV.UK tag component | pending
- components/task-list.js:16 | legacy task-list is represented with a custom data attribute | use the GOV.UK task-list pattern | pending
- components/text-input.js:22 | legacy input lookup depends on generated ids | prefer label-based lookups and the GDS text-input wrapper | pending
