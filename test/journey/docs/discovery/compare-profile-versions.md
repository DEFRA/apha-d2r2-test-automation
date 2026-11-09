# Compare profile versions

source: [app/Profiles.Web/CompareProfileVersions.aspx](../../app/Profiles.Web/CompareProfileVersions.aspx), [app/Profiles.Web/CompareProfileVersions.aspx.vb](../../app/Profiles.Web/CompareProfileVersions.aspx.vb)
summary:
- The page compares two profile versions using a hierarchical tree view and a selection status panel.
- The UI includes an `Open all` toggle, a `Remove selection` action, and a `Compare` button.
rules:
- This is a public route in the legacy app and is reached from the home page.
- The main page identity is the heading `Compare profile versions`.
open questions:
- Does the compare action trigger a results page or a download/report render for the selected versions?
- Are there additional guard rails for selecting more than two versions or invalid combinations?
