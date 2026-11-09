# Disease ranking

source: [app/Profiles.Web/DiseaseRanking.aspx](../../app/Profiles.Web/DiseaseRanking.aspx), [app/Profiles.Web/DiseaseRanking.aspx.vb](../../app/Profiles.Web/DiseaseRanking.aspx.vb)
summary:
- The disease ranking page exposes two report dropdowns and two Edit Filters buttons.
- The page is reached from the home page and supports selecting terrestrial or aquatic disease-ranking reports.
rules:
- The page is a public report navigation route in the legacy app.
- The controls are server-rendered dropdown menus built from the disease reference table list.
open questions:
- Are there additional validation cases for the selected filter choices beyond the dropdown selection?
- Does the report selection route to a detail page or a generated file in the same user journey?
