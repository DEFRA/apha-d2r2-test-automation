# Create disease ranking filter

source: [app/Profiles.Web/EditDiseaseRankingFilters.aspx](../../app/Profiles.Web/EditDiseaseRankingFilters.aspx)
summary:
- The page is publicly reachable from the Home page and exposes the disease filter selection and create button.
- The live route identity is the heading `Edit disease ranking filters` and the `Create new filter` action.
rules:
- This is a live public route that is visible in the app menu and should be treated as a confirmed route.
- The scenario should validate the page heading and the visible filter controls.
open questions:
- Should the next stage cover submitting a new filter and validating the generated report output?
