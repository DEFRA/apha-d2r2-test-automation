# Discovery index

stack: ASP.NET Web Forms, VB.NET, Windows auth, IIS-hosted app
source: [app/Profiles.Web/Home.aspx](../../app/Profiles.Web/Home.aspx), [app/Profiles.Web/NavigationLinks.ascx](../../app/Profiles.Web/NavigationLinks.ascx), [app/Profiles.Web/Footer.ascx](../../app/Profiles.Web/Footer.ascx), [app/Profiles.Web/Web.sitemap](../../app/Profiles.Web/Web.sitemap), [app/Profiles.Web/Search.aspx](../../app/Profiles.Web/Search.aspx)
feature list:
- Home and landing-page navigation
- Search, results management and profile actions
- Disease ranking and bespoke reporting
- Compare and manage profile versions
- User-admin maintenance pages
- Cross-profile reference and prioritisation maintenance
- Species and audit-trail maintenance
- Help, static reporting and support pages
file pointers:
- app/Profiles.Web/Home.aspx:1-90
- app/Profiles.Web/NavigationLinks.ascx:1-80
- app/Profiles.Web/Footer.ascx:1-120
- app/Profiles.Web/Web.sitemap:1-40
- app/Profiles.Web/Search.aspx:200-340
- app/Profiles.Web/ManageProfile.aspx:1-120
- app/Profiles.Web/ProfileProperties.aspx:1-120
- app/Profiles.Web/MaintainContributors.aspx:1-120
- app/Profiles.Web/ShowContributionReport.aspx:1-40
open questions:
- Which remaining routes are in scope for the next automation wave beyond the current home/search/admin set?
- Are profile-editing and clone flows stable enough for a broad automation pass, or should they stay as discovery-only candidates?
- Are there explicit non-admin roles beyond the Windows-auth SSO path used in the current suite?
