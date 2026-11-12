# CDC.Web inventory (source `apha-cdc-apps` 0576aaa)

Policies (src/CDC.Web/Authorization/Policies/AuthorizationPolicyRegistration.cs): signed-in = Search, ViewSpeciesData, Reports, Help. ProfileEditor-only = create/edit profile, compare, review timings, species maintain, user guidance, global/external users, reference data, prioritisation variables, cross-cutting scores, ranking filters, publish, clone, contributors. ProfileEditor + PolicyProfileUser = contributions report, bespoke report. `UserManagementSystem` is denied everywhere. Profile-level rights come from CDC.Api.

Routes are `/{folder}/{Page}`; `{id:guid}` marks the route template. Handlers are Razor page handlers.

| Area | Route | Policy | Operations (handlers) | Coverage in pack |
|---|---|---|---|---|
| Home | `/Landing/Internal`, `/Landing/External`, `/Landing/Error` | anon/auth | read | home, error-handling |
| Account | `SessionController` GET/POST/GET (keep-alive, extend, expired) | auth | session | error-handling (partial) |
| Search | `/SurveillanceProfiles/Search` | signed-in | search, filter, paging (Get, Post) | search |
| Profile create | `/DiseaseProfiles/Create`, `/SurveillanceProfiles/ProfileProperties/{profileId?}` | editor | create | profile-management |
| Manage | `/SurveillanceProfiles/ManageProfile/{id}` | CanEditProfile | save, new draft, delete version, publish public/defranet | profile-lifecycle |
| Edit | `EditProfileTitle/{id}`, `EditProperties/{id}`, `EditProfileQuestions/{id}`, `EditProfileFurtherInformation/{id}`, `EditProfileReviewComments/{id}`, `EditProfileAllRevisionDates/{id}`, `EditProfileContributions/{id}`, `EditProfileReferences/{id}`, `Notes/{id}` | mixed | save/validate/clear/delete/tick-all | profile-editing |
| Lifecycle | `CreateNewDraftVersion/{id}`, `CloneNewScenario/{id}`, `CloneNewProfile`, `DeleteCurrentVersion`, `PublishPublic/{id}`, `PublishDefranetOnly/{id}`, `AllowPublicAccess/{id}` | editor | create/clone/delete/publish | profile-lifecycle |
| Contributors | `MaintainContributors/{id}` | editor | lookup, add, save, delete | profile-editing |
| Reports | `ProfileReports/{versionId}`, `CreateBespokeReport/{versionId}`, `ViewContributionsReport/{id}`, `ViewDraftSummaryReport/{id}/{report}`, `ViewProfilePrintVersion/{id}`, `ViewProfileGuidanceReport` | mixed | generate, download, save-as, delete | questions-and-guidance-reports, profile-management |
| Compare | `/DiseaseProfiles/CompareVersions` | editor | select, remove, review | compare-profile-versions |
| Review timings | `/SurveillanceProfiles/DiseaseReviews` | editor | read, update | review-timings |
| Guidance | `/SurveillanceProfiles/EditUserGuidance` | editor | update | questions-and-guidance-reports |
| Species | `/ViewSpeciesData`, `/EditSpecies/{speciesId}`, `/SpeciesData/Maintain` (19 handlers: add, edit, delete+confirm, inactivate+confirm, reorder, audit trail) | signed-in / editor | full CRUD | view-species-data, maintain-species-data, audit-trails |
| Reference data | `/CrossProfileAdmin/ReferenceData`, `ReferenceDataAudit`, `ReferenceDataAuditDetails` | editor | update, audit | maintain-reference-data, audit-trails |
| Cross-profile | `PrioritisationVariables`, `CrossCuttingIssueScores` (apply, update) | editor | update | maintain-prioritisation-variables, maintain-cross-cutting-issue-scores |
| Ranking | `/Reports/DiseaseRanking` (scored/ranked), `/Reports/EditDiseaseRankingFilters`, `/DiseaseRanking/EditFilters` (create, select, save, delete) | signed-in / editor | CRUD, export | disease-ranking |
| General reports | `/Reports/General` (delete, upload, make public, history) | signed-in | upload, delete | general-reports |
| Help | `/HelpSupport/StaticReports`, `QualityStatement`, `GET /static-reports/versions/{id}/document` | signed-in | upload, delete, download | help |
| Users | `/UserAdmin/GlobalUsers`, `/UserAdmin/ExternalUsers` | editor | lookup, save, delete, pre-register | global-users, external-users |
| Spellcheck | `SpellCheckController` 3 POST | auth | spellcheck | none |
| Error | `/SurveillanceProfiles/ApplicationError` | anon | read | error-handling |

Pages with no `[Authorize]` attribute (fallback policy applies): EditProfileAllRevisionDates, EditProfileContributions, EditProfileFurtherInformation, EditProfileQuestions, EditProfileReferences, EditProfileReviewComments, Notes, ProfileReports, ViewDraftSummaryReport, ViewProfilePrintVersion. Rights decided by CDC.Api per profile; worth a permission scenario.
