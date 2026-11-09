# Home and navigation

source: [app/Profiles.Web/Home.aspx](../../app/Profiles.Web/Home.aspx), [app/Profiles.Web/Web.config](../../app/Profiles.Web/Web.config)
summary:
- Default landing page is Home.aspx.
- Home page links include Search, Disease Ranking, General Reports and View Species Data.
- Quick links also expose Help, Compare Profile Versions and Create Disease Ranking Filter.
rules:
- Authentication is Windows-based and denies anonymous users.
- The app is legacy ASP.NET Web Forms, so selectors may be server-generated.
open questions:
- Which quick links are in scope for the first automation slice?
- Are any routes behind different internal/public variants?
