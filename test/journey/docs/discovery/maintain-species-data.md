# Maintain species data

source: [app/Profiles.Web/MaintainSpeciesData.aspx](../../app/Profiles.Web/MaintainSpeciesData.aspx), [app/Profiles.Web/NavigationLinks.ascx](../../app/Profiles.Web/NavigationLinks.ascx)
summary:
- The app exposes a Maintain species data page as a direct route and in the species-data navigation block.
- The page contains tree-view maintenance actions such as View audit trail, Add, Edit name/parent and Edit data.
rules:
- This is a real page in the live app and can be opened directly from its route URL.
- The page identity is the text `Maintain species data` used in the page title and content.
open questions:
- Does this route require a staff or data-admin role beyond the anonymous public profile?
- Are the edit action flows part of the same user journey or a separate admin-only slice?
