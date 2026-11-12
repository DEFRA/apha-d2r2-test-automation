import { byProfile } from '../support/profiles.js'
import { uiBaseUrl } from '../support/env.js'

const appRoot = uiBaseUrl()
const siteRoot = new URL(appRoot).origin // Razor pages are served from the host root; /Landing/Internal is only the landing page

/**
 * Routes are used for navigation only (goto, expected destination). Never assert on the URL of
 * the page you are already on: identify pages by their h1 (skill gds-migration-resilience,
 * Rule 5). GDS changes the URL structure and the page count.
 *
 * Two entries only; add one per screen during discovery.
 */
export const routes = {
  start: byProfile({ legacy: `${appRoot}/Home.aspx`, gds: appRoot }), // source: observed live landing page /Landing/Internal
  home: byProfile({ legacy: `${appRoot}/Home.aspx`, gds: appRoot }), // source: observed live landing page /Landing/Internal
  search: byProfile({ legacy: `${appRoot}/Search.aspx`, gds: `${siteRoot}/SurveillanceProfiles/Search` }), // source: observed home page link "Search disease profiles"
  diseaseRanking: byProfile({ legacy: `${appRoot}/DiseaseRanking.aspx`, gds: `${siteRoot}/Reports/DiseaseRanking` }), // source: observed home page link; the route returns a file download
  generalReports: byProfile({ legacy: `${appRoot}/StaticReports.aspx`, gds: `${siteRoot}/Reports/General` }), // source: observed home page link "General reports"
  viewSpeciesData: byProfile({ legacy: `${appRoot}/ViewSpeciesData.aspx`, gds: `${siteRoot}/ViewSpeciesData` }), // source: observed home page link "View species data"
  help: byProfile({ legacy: `${appRoot}/StaticReports.aspx?UserManual=1`, gds: `${siteRoot}/HelpSupport/StaticReports?UserManual=1` }), // source: observed home page link "Help using D2R2"
  sessionTimeout: byProfile({ legacy: `${appRoot}/SessionTimeout.aspx`, gds: `${appRoot}/session-timeout` }), // source: app/Profiles.Web/SessionTimeout.aspx:1-12
  applicationError: byProfile({ legacy: `${appRoot}/ApplicationError.aspx`, gds: `${siteRoot}/SurveillanceProfiles/ApplicationError` }), // source: app/Profiles.Web/ApplicationError.aspx:1-52
  createProfile: byProfile({ legacy: `${appRoot}/ProfileProperties.aspx`, gds: `${siteRoot}/DiseaseProfiles/Create` }), // source: app/Profiles.Web/Home.aspx:1-89
  globalUsers: byProfile({ legacy: `${appRoot}/MaintainGlobalUsers.aspx`, gds: `${siteRoot}/UserAdmin/GlobalUsers` }), // source: app/Profiles.Web/Home.aspx:1-89
  externalUsers: byProfile({ legacy: `${appRoot}/MaintainExternalUsers.aspx`, gds: `${siteRoot}/UserAdmin/ExternalUsers` }), // source: app/Profiles.Web/Home.aspx:1-89
  compareProfileVersions: byProfile({ legacy: `${appRoot}/CompareProfileVersions.aspx`, gds: `${siteRoot}/DiseaseProfiles/CompareVersions` }), // source: app/Profiles.Web/CompareProfileVersions.aspx:1-30
  manageProfile: byProfile({ legacy: `${appRoot}/ManageProfile.aspx`, gds: `${siteRoot}/SurveillanceProfiles/ManageProfile` }), // source: app/Profiles.Web/Search.aspx:220-226
  profileProperties: byProfile({ legacy: `${appRoot}/ProfileProperties.aspx`, gds: `${siteRoot}/SurveillanceProfiles/ProfileProperties` }), // source: app/Profiles.Web/ProfileProperties.aspx:1-30
  editProfileTitle: byProfile({ legacy: `${appRoot}/EditProfileTitle.aspx`, gds: `${siteRoot}/SurveillanceProfiles/EditProfileTitle` }), // source: app/Profiles.Web/EditProfileTitle.aspx:1-30
  profileReports: byProfile({ legacy: `${appRoot}/ProfileReports.aspx`, gds: `${siteRoot}/SurveillanceProfiles/ProfileReports` }), // source: app/Profiles.Web/ProfileReports.aspx:1-100
  createBespokeReport: byProfile({ legacy: `${appRoot}/CreateBespokeReport.aspx`, gds: `${siteRoot}/SurveillanceProfiles/CreateBespokeReport` }), // source: app/Profiles.Web/CreateBespokeReport.aspx:1-80
  editProfileQuestions: byProfile({ legacy: `${appRoot}/EditProfileQuestions.aspx`, gds: `${siteRoot}/SurveillanceProfiles/EditProfileQuestions` }), // source: app/Profiles.Web/Search.aspx:337, app/Profiles.Web/EditProfileQuestions.aspx:1-20
  editSpecies: byProfile({ legacy: `${appRoot}/EditSpecies.aspx`, gds: `${siteRoot}/EditSpecies` }), // source: app/Profiles.Web/EditSpecies.aspx:1-80
  reviewTimings: byProfile({ legacy: `${appRoot}/DiseaseReviews.aspx`, gds: `${siteRoot}/SurveillanceProfiles/DiseaseReviews` }), // source: app/Profiles.Web/NavigationLinks.ascx:18-31, app/Profiles.Web/Web.sitemap:6-10
  speciesDataAuditTrail: byProfile({ legacy: `${appRoot}/SpeciesDataAuditTrail.aspx`, gds: `${siteRoot}/SpeciesData/Maintain` }), // source: app/Profiles.Web/SpeciesDataAuditTrail.aspx:1-120
  referenceTableAuditTrail: byProfile({ legacy: `${appRoot}/ReferenceTableAuditTrail.aspx`, gds: `${siteRoot}/CrossProfileAdmin/ReferenceDataAudit` }), // source: app/Profiles.Web/ReferenceTableAuditTrail.aspx:1-120
  maintainSpeciesData: byProfile({ legacy: `${appRoot}/MaintainSpeciesData.aspx`, gds: `${siteRoot}/SpeciesData/Maintain` }), // source: app/Profiles.Web/NavigationLinks.ascx:57-72
  maintainReferenceData: byProfile({ legacy: `${appRoot}/MaintainReferenceData.aspx`, gds: `${siteRoot}/CrossProfileAdmin/ReferenceData` }), // source: app/Profiles.Web/NavigationLinks.ascx:57-72
  maintainPrioritisationVariables: byProfile({ legacy: `${appRoot}/MaintainPrioritisationVariables.aspx`, gds: `${siteRoot}/CrossProfileAdmin/PrioritisationVariables` }), // source: app/Profiles.Web/NavigationLinks.ascx:57-72
  maintainCrossCuttingIssueScores: byProfile({ legacy: `${appRoot}/MaintainCrossCuttingIssueScores.aspx`, gds: `${siteRoot}/CrossProfileAdmin/CrossCuttingIssueScores` }), // source: app/Profiles.Web/NavigationLinks.ascx:57-72
  questionsAndGuidanceReports: byProfile({ legacy: `${appRoot}/EditUserGuidance.aspx`, gds: `${siteRoot}/SurveillanceProfiles/EditUserGuidance` }), // source: app/Profiles.Web/NavigationLinks.ascx:34-47
  createDiseaseRankingFilter: byProfile({ legacy: `${appRoot}/EditDiseaseRankingFilters.aspx`, gds: `${siteRoot}/Reports/EditDiseaseRankingFilters` }), // source: app/Profiles.Web/EditDiseaseRankingFilters.aspx:1-30
  reviewEmail: byProfile({ legacy: `${appRoot}/ReviewEmail.aspx`, gds: `${appRoot}/review-email` }), // source: app/Profiles.Web/ReviewEmail.aspx:1
  profileQuestionHelp: byProfile({ legacy: `${appRoot}/ProfileQuestionHelp.aspx`, gds: `${appRoot}/profile-question-help` }) // source: app/Profiles.Web/ProfileQuestionHelp.aspx.vb:6-12
}

/** Page identity. Assert these, not URLs. */
export const pages = {
  home: { heading: byProfile({ legacy: 'D2R2', gds: 'Welcome back' }) }, // source: observed home h1 "Welcome back, <name>"
  search: { heading: byProfile({ legacy: 'Search disease profiles', gds: 'Search Disease Profiles' }) }, // source: observed search h1
  diseaseRanking: { heading: byProfile({ legacy: 'Disease ranking', gds: 'Disease ranking report' }) }, // source: app/Profiles.Web/DiseaseRanking.aspx:1-30
  generalReports: { heading: byProfile({ legacy: 'General reports', gds: 'General reports' }) }, // source: app/Profiles.Web/StaticReports.aspx:1-10
  viewSpeciesData: { heading: byProfile({ legacy: 'View species data', gds: 'View species data' }) }, // source: app/Profiles.Web/ViewSpeciesData.aspx:1-10
  help: { heading: byProfile({ legacy: 'Help using D2R2', gds: 'Help Using D2R2' }) }, // source: observed help h1
  sessionTimeout: { heading: byProfile({ legacy: 'Your application session has expired', gds: 'Your application session has expired' }) }, // source: app/Profiles.Web/SessionTimeout.aspx:1-12
  applicationError: { heading: byProfile({ legacy: 'An error has occurred', gds: 'Application error' }) }, // source: app/Profiles.Web/ApplicationError.aspx:1-52
  createProfile: { heading: byProfile({ legacy: 'Create new profile', gds: 'Create profile' }) }, // source: app/Profiles.Web/ProfileProperties.aspx:1-40
  globalUsers: { heading: byProfile({ legacy: 'Maintain global users', gds: 'Maintain global users' }) }, // source: app/Profiles.Web/MaintainGlobalUsers.aspx:1-40
  externalUsers: { heading: byProfile({ legacy: 'Maintain external users', gds: 'Maintain external users' }) }, // source: app/Profiles.Web/MaintainExternalUsers.aspx:1-40
  compareProfileVersions: { heading: byProfile({ legacy: 'Compare profile versions', gds: 'Compare profile versions' }) }, // source: app/Profiles.Web/CompareProfileVersions.aspx:1-30
  manageProfile: { heading: byProfile({ legacy: 'Manage profile', gds: 'Manage profile:' }) }, // source: app/Profiles.Web/ManageProfile.aspx:1-30
  profileProperties: { heading: byProfile({ legacy: 'Profile properties', gds: 'Profile properties' }) }, // source: app/Profiles.Web/ProfileProperties.aspx:1-30
  profileReports: { heading: byProfile({ legacy: 'Profile reports', gds: 'Profile reports' }) }, // source: observed ProfileReports page h1 "Profile reports for <title> v<version>"
  createBespokeReport: { heading: byProfile({ legacy: 'Create bespoke report', gds: 'Create bespoke report' }) }, // source: app/Profiles.Web/CreateBespokeReport.aspx:1-80
  editProfileQuestions: { heading: byProfile({ legacy: 'Edit profile questions', gds: 'African Horse Sickness' }) }, // source: observed browse page h1 is the profile title; scenarios browse African Horse Sickness
  editSpecies: { heading: byProfile({ legacy: 'Edit species data', gds: 'Edit species data' }) }, // source: app/Profiles.Web/EditSpecies.aspx:1-80
  editProfileTitle: { heading: byProfile({ legacy: 'Edit profile title', gds: 'Edit profile title' }) }, // source: app/Profiles.Web/EditProfileTitle.aspx:1-30
  maintainContributors: { heading: byProfile({ legacy: 'Maintain contributors for', gds: 'Maintain contributors' }) }, // source: app/Profiles.Web/MaintainContributors.aspx:1-30
  contributionsReport: { heading: byProfile({ legacy: 'Contributions report', gds: 'Contributions report' }) }, // source: app/Profiles.Web/ShowContributionReport.aspx:1-30
  reviewTimings: { heading: byProfile({ legacy: 'Review timings', gds: 'Review timings' }) }, // source: app/Profiles.Web/DiseaseReviews.aspx:1-40
  speciesDataAuditTrail: { heading: byProfile({ legacy: 'Species data audit trail', gds: 'Species data audit trail' }) }, // source: app/Profiles.Web/SpeciesDataAuditTrail.aspx:1-120
  referenceTableAuditTrail: { heading: byProfile({ legacy: 'Audit trail for reference table', gds: 'Reference data audit trail' }) }, // source: app/Profiles.Web/ReferenceTableAuditTrail.aspx.vb:53-60
  maintainSpeciesData: { heading: byProfile({ legacy: 'Maintain species data', gds: 'Maintain species data' }) }, // source: app/Profiles.Web/MaintainSpeciesData.aspx:1-20
  maintainReferenceData: { heading: byProfile({ legacy: 'Maintain reference data', gds: 'Maintain reference data' }) }, // source: app/Profiles.Web/MaintainReferenceData.aspx:1-20
  maintainPrioritisationVariables: { heading: byProfile({ legacy: 'Maintain profile prioritisation variables', gds: 'Maintain prioritisation variables' }) }, // source: app/Profiles.Web/MaintainPrioritisationVariables.aspx:1-20
  maintainCrossCuttingIssueScores: { heading: byProfile({ legacy: 'Maintain cross-cutting issue scores', gds: 'Maintain cross-cutting issue scores' }) }, // source: app/Profiles.Web/MaintainCrossCuttingIssueScores.aspx:1-20
  questionsAndGuidanceReports: { heading: byProfile({ legacy: 'Edit questions and guidance', gds: 'Edit questions and guidance' }) }, // source: app/Profiles.Web/EditUserGuidance.aspx:1-20
  createDiseaseRankingFilter: { heading: byProfile({ legacy: 'Edit disease ranking filters', gds: 'Edit disease ranking filters' }) }, // source: app/Profiles.Web/EditDiseaseRankingFilters.aspx:1-30
  reviewEmail: { heading: byProfile({ legacy: 'Review email', gds: 'Review email' }) } // source: app/Profiles.Web/ReviewEmail.aspx:1 (Title)
}

/** Editor-only routes, keyed by the name used in features. Verified against the [Authorize] policies on the Razor page models. */
export const editorOnlyRoutes = {
  'Maintain global users': `${siteRoot}/UserAdmin/GlobalUsers`, // source: CDC.Web/Pages/UserAdmin/GlobalUsers.cshtml.cs CanManageGlobalUsers
  'Maintain external users': `${siteRoot}/UserAdmin/ExternalUsers`, // source: CDC.Web/Pages/UserAdmin/ExternalUsers.cshtml.cs CanManageExternalUsers
  'Maintain reference data': `${siteRoot}/CrossProfileAdmin/ReferenceData`, // source: CDC.Web/Pages/CrossProfileAdmin/ReferenceData.cshtml.cs CanManageReferenceData
  'Reference data audit trail': `${siteRoot}/CrossProfileAdmin/ReferenceDataAudit`, // source: CDC.Web/Pages/CrossProfileAdmin/ReferenceDataAudit.cshtml.cs CanManageReferenceData
  'Maintain prioritisation variables': `${siteRoot}/CrossProfileAdmin/PrioritisationVariables`, // source: CDC.Web/Pages/CrossProfileAdmin/PrioritisationVariables.cshtml.cs CanManagePrioritisationVariables
  'Maintain cross-cutting issue scores': `${siteRoot}/CrossProfileAdmin/CrossCuttingIssueScores`, // source: CDC.Web/Pages/CrossProfileAdmin/CrossCuttingIssueScores.cshtml.cs CanManageCrossCuttingScores
  'Maintain species data': `${siteRoot}/SpeciesData/Maintain`, // source: CDC.Web/Pages/SpeciesData/Maintain.cshtml.cs CanManageSpeciesData
  'Compare profile versions': `${siteRoot}/DiseaseProfiles/CompareVersions`, // source: CDC.Web/Pages/DiseaseProfiles/CompareVersions.cshtml.cs CanViewProfileComparison
  'Create profile': `${siteRoot}/DiseaseProfiles/Create`, // source: CDC.Web/Pages/DiseaseProfiles/Create.cshtml.cs CanCreateProfile
  'Review timings': `${siteRoot}/SurveillanceProfiles/DiseaseReviews`, // source: CDC.Web/Pages/SurveillanceProfiles/DiseaseReviews.cshtml.cs CanViewReviewTiming
  'Edit questions and guidance': `${siteRoot}/SurveillanceProfiles/EditUserGuidance`, // source: CDC.Web/Pages/SurveillanceProfiles/EditUserGuidance.cshtml.cs CanEditUserGuidance
  'Edit disease ranking filters': `${siteRoot}/DiseaseRanking/EditFilters`, // source: CDC.Web/Pages/DiseaseRanking/EditFilters.cshtml.cs CanManageDiseaseRankingFilters
  'Report editor disease ranking filters': `${siteRoot}/Reports/EditDiseaseRankingFilters` // source: CDC.Web/Pages/Reports/EditDiseaseRankingFilters.cshtml.cs CanManageDiseaseRankingFilters
}

export const sessionRoutes = {
  status: `${siteRoot}/Session/Status`, // source: CDC.Web/Features/Account/SessionController.cs:26 Status
  extend: `${siteRoot}/Session/Extend` // source: CDC.Web/Features/Account/SessionController.cs:43 Extend
}

export const permissionDenied = {
  heading: 'You do not have permission to view this page', // source: observed on /UserAdmin/GlobalUsers for a non-editor, error-context TC-103
  homeLink: 'Go to the D2R2 home page' // source: observed access denied page
}

export const sessionDialogs = {
  warningTitle: 'Extend session?', // source: CDC.Web/Views/Shared/_SessionTimeout.cshtml:21
  expiredTitle: 'Session expired', // source: CDC.Web/Views/Shared/_SessionTimeout.cshtml:35
  extendButton: 'Yes, extend session', // source: CDC.Web/Views/Shared/_SessionTimeout.cshtml:31
  signInButton: 'Sign in again' // source: CDC.Web/Views/Shared/_SessionTimeout.cshtml
}
