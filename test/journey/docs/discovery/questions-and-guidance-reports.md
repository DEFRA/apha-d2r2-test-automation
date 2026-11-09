# Questions and guidance reports

source: [app/Profiles.Web/NavigationLinks.ascx](../../app/Profiles.Web/NavigationLinks.ascx), [app/Profiles.Web/EditUserGuidance.aspx](../../app/Profiles.Web/EditUserGuidance.aspx)
summary:
- The home page exposes a visible Questions and guidance reports link under the Reports section.
- The live route is `EditUserGuidance.aspx` and it exposes report-generation buttons and a profile section dropdown.
rules:
- This is a live direct route in the application and is not hidden behind an admin-only menu.
- The page identity is the page title `Edit questions and guidance`.
open questions:
- Is this route intended for staff-only editing or a public authoring flow?
- Should the next scenario cover the report-generation buttons or the profile-section selection workflow?
