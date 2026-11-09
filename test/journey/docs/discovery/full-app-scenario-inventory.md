# Full app scenario inventory

This inventory is grounded in the source pages that define the app’s real navigation and route surface: [app/Profiles.Web/Home.aspx](../../app/Profiles.Web/Home.aspx), [app/Profiles.Web/NavigationLinks.ascx](../../app/Profiles.Web/NavigationLinks.ascx), [app/Profiles.Web/Footer.ascx](../../app/Profiles.Web/Footer.ascx), [app/Profiles.Web/Web.sitemap](../../app/Profiles.Web/Web.sitemap), [app/Profiles.Web/Search.aspx](../../app/Profiles.Web/Search.aspx), [app/Profiles.Web/ManageProfile.aspx](../../app/Profiles.Web/ManageProfile.aspx), [app/Profiles.Web/ProfileProperties.aspx](../../app/Profiles.Web/ProfileProperties.aspx), [app/Profiles.Web/MaintainContributors.aspx](../../app/Profiles.Web/MaintainContributors.aspx), and [app/Profiles.Web/ShowContributionReport.aspx](../../app/Profiles.Web/ShowContributionReport.aspx).

## 1. Landing and navigation scenarios

These are the entry points visible from the home page, navigation control and footer.

- Home page landing and popular links: Home.aspx — Search Disease Profiles, Disease Ranking Report, General Reports, View Species Data
- Quick links: Help Using D2R2, Compare Profile Versions, Create Disease Ranking Filter
- Navigation control pages: Search disease profiles, Create profile, Compare profile versions, Review timings, General reports, Questions and guidance reports, Disease ranking report
- Footer admin pages: Global users, External users, Maintain reference data, Maintain prioritisation variables, Maintain cross-cutting issue scores

Likely scenario families:
- open home and validate popular links
- open each quick link and validate expected page heading
- route directly to each landing page and confirm the page identity
- confirm page-level controls and filter widgets render without server errors

## 2. Search and profile life-cycle scenarios

The core route map is concentrated under Search.aspx and the profile-editing pages reached from search results.

- Search disease profiles page
- Search result actions: Edit Title, Manage, Contributions
- Manage profile page: Edit properties, Maintain contributors and reviewers, View contributions report, Clone new profile, Clone new scenario
- Profile properties page: create profile, edit profile metadata, navigate back to manage page
- Edit profile title page
- Maintain contributors page
- Contributions report page

The source makes the following flows explicit:
- Search results contain direct links to EditProfileTitle.aspx?ProfileId=...
- Search results contain direct links to ManageProfile.aspx?ProfileId=...
- ManageProfile.aspx sets links to ProfileProperties.aspx?ProfileId=..., MaintainContributors.aspx?ProfileId=..., ShowContributionReport.aspx?ProfileId=...
- ProfileProperties.aspx sets explicit back-navigation to ManageProfile.aspx and supports create/clone flows

High-value undiscovered scenario groups:
- search by title and reach the correct profile
- open manage page from first result and assert the profile-specific action links are visible
- open maintain contributors from manage page and verify the contributor/reviewer controls render
- open profile properties page and verify the edit fields are available
- open contributions report from manage page and verify the report renders
- open edit profile title page and validate title update form controls
- clone profile or clone scenario entry from search result or manage page

## 3. Disease ranking and bespoke report scenarios

The application exposes ranking and report-generation features in multiple places.

- DiseaseRanking.aspx: select ranking report and render a report
- EditDiseaseRankingFilters.aspx: create and submit disease ranking filter criteria
- ProfileReports.aspx: profile-specific reporting
- CreateBespokeReport.aspx: build a bespoke report from selected sections and questions
- ShowDiseaseRankingReport.aspx, ShowDraftSummaryPrioritisationReport.aspx, ShowDraftSummaryProfileReport.aspx, ShowProfileGuidanceReport.aspx, ShowPublishedProfile.aspx, ShowProfileVersionComparisonReport.aspx, ShowProfilePrintVersion.aspx

Likely scenario families:
- open disease ranking page and select a report option
- submit a disease ranking filter and confirm the filter is shown or used
- open profile report pages and validate report generation controls
- open bespoke report builder and select section/question tree items
- open published and comparison report variants from a profile context

## 4. Species and audit-trail scenarios

The app contains species-management and audit pages that are easy to miss because they are not all in the main sitemap.

- ViewSpeciesData.aspx
- EditSpecies.aspx
- MaintainSpeciesData.aspx
- SpeciesDataAuditTrail.aspx
- ReferenceTableAuditTrail.aspx

Likely scenario families:
- open species listing and select a species for maintenance or editing
- open the maintain species data page and validate actions like audit-trail access
- open a reference table audit trail from the reference-data maintenance page
- confirm audit records and table maintenance actions render without exceptions

## 5. User-admin and cross-profile admin scenarios

These are part of the footer admin blocks and are source-backed but not necessarily in the main sitemap.

- MaintainGlobalUsers.aspx — global user administration
- MaintainExternalUsers.aspx — external user administration
- MaintainReferenceData.aspx — reference tables and admin controls
- MaintainPrioritisationVariables.aspx — prioritisation variable controls
- MaintainCrossCuttingIssueScores.aspx — category and update controls

Likely scenario families:
- route directly to each admin page and confirm expected heading and controls
- choose an option from the admin page and assert the expected page state or selection persisted
- verify access control and security exceptions for unauthorised users

## 6. Help, static reporting and support scenarios

The app offers support pages outside the primary navigation flows.

- StaticReports.aspx — general report listing
- EditUserGuidance.aspx — questions and guidance reports
- StaticReports.aspx?UserManual=1 — help using D2R2
- ShowStaticReport.aspx — static report render
- ApplicationError.aspx, SessionTimeout.aspx

Likely scenario families:
- open the manual and validate the listing of help content
- open the questions and guidance page and ensure report buttons render
- render static reports and confirm the expected content appears
- validate error and timeout handling pages

## 7. Coverage status

Implemented in the current pack:
- Home navigation and landing links
- Search disease profile flow
- Maintain reference data
- Maintain prioritisation variables
- Review timings
- Maintain global users
- Maintain external users
- Maintain cross-cutting issue scores
- Questions and guidance reports
- Help using D2R2

Strongly discovered but not yet fully automated:
- Manage profile actions from search results
- Profile properties and clone flows
- Edit profile title workflow
- Maintain contributors workflow
- Contributions report workflow
- Edit profile questions, references and review comments
- Species edit and audit-trail pages
- Bespoke report builder and profile report generation
- User-admin action flows beyond page entry

## 8. Open questions

- Which of the discovered edit/clone/report routes are in active scope for the next automation wave?
- Are profile-editing and clone paths stable enough to automate without brittle selectors?
- Is the app expected to permit users beyond the Windows-auth SSO path used in the current suite?
- Do any admin pages require role-specific data setup that is not yet represented in the test environment?
