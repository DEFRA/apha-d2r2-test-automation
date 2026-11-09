# Maintain profile prioritisation variables

source: [app/Profiles.Web/MaintainPrioritisationVariables.aspx](../../app/Profiles.Web/MaintainPrioritisationVariables.aspx)
summary:
- The page is publicly reachable and exposes the prioritisation controls used to recalculate draft profile scores.
- The live route identity is the title `Maintain profile prioritisation variables` and the visible controls begin with `Draft prioritisation`.
rules:
- This is a user-facing route in the live app and should be treated as confirmed.
- Validation should focus on the heading and the visible action/selection controls, not on hidden admin-only state.
open questions:
- Should the next scenario cover the prioritisation form submission or just the public route and visible controls?
