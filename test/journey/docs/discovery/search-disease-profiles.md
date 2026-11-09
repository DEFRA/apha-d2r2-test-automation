# Search disease profiles

source: [app/Profiles.Web/Search.aspx](../../app/Profiles.Web/Search.aspx), [app/Profiles.Web/Search.aspx.vb](../../app/Profiles.Web/Search.aspx.vb)
summary:
- The search page is reached from the home page and exposes a disease title text box, alphabet filter, and published/draft/scenario toggles.
- Search results are shown as profile titles under the search controls.
- The page supports text search and letter-based filtering.
rules:
- Results are page-based and the search is driven by the disease title field.
- The current scope is the public search route, not authenticated edit flows.
open questions:
- Which result count or published-only rule should be asserted in a future slice?
- Are there additional advanced filter scenarios beyond title text search?
