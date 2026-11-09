import { byProfile } from '../support/profiles.js'
import { uiBaseUrl } from '../support/env.js'

const appRoot = uiBaseUrl()

/**
 * Routes are used for navigation only (goto, expected destination). Never assert on the URL of
 * the page you are already on: identify pages by their h1 (skill gds-migration-resilience,
 * Rule 5). GDS changes the URL structure and the page count.
 *
 * Two entries only; add one per screen during discovery.
 */
export const routes = {
  start: byProfile({ legacy: `${appRoot}/Home.aspx`, gds: `${appRoot}/` }), // source: app/Profiles.Web/Home.aspx:1-89
  home: byProfile({ legacy: `${appRoot}/Home.aspx`, gds: `${appRoot}/` }), // source: app/Profiles.Web/Home.aspx:1-89
  search: byProfile({ legacy: `${appRoot}/Search.aspx`, gds: `${appRoot}/search` }), // source: app/Profiles.Web/Search.aspx:1-30
  diseaseRanking: byProfile({ legacy: `${appRoot}/DiseaseRanking.aspx`, gds: `${appRoot}/disease-ranking` }), // source: app/Profiles.Web/DiseaseRanking.aspx:1-30
  generalReports: byProfile({ legacy: `${appRoot}/StaticReports.aspx`, gds: `${appRoot}/general-reports` }), // source: app/Profiles.Web/StaticReports.aspx:1-10
  viewSpeciesData: byProfile({ legacy: `${appRoot}/ViewSpeciesData.aspx`, gds: `${appRoot}/species-data` }), // source: app/Profiles.Web/ViewSpeciesData.aspx:1-10
  help: byProfile({ legacy: `${appRoot}/StaticReports.aspx?UserManual=1`, gds: `${appRoot}/help` }), // source: app/Profiles.Web/Home.aspx:88-90
  sessionTimeout: byProfile({ legacy: `${appRoot}/SessionTimeout.aspx`, gds: `${appRoot}/session-timeout` }), // source: app/Profiles.Web/SessionTimeout.aspx:1-12
  applicationError: byProfile({ legacy: `${appRoot}/ApplicationError.aspx`, gds: `${appRoot}/application-error` }), // source: app/Profiles.Web/ApplicationError.aspx:1-52
  createProfile: byProfile({ legacy: `${appRoot}/ProfileProperties.aspx`, gds: `${appRoot}/create-profile` }), // source: app/Profiles.Web/Home.aspx:1-89
  globalUsers: byProfile({ legacy: `${appRoot}/MaintainGlobalUsers.aspx`, gds: `${appRoot}/global-users` }), // source: app/Profiles.Web/Home.aspx:1-89
  externalUsers: byProfile({ legacy: `${appRoot}/MaintainExternalUsers.aspx`, gds: `${appRoot}/external-users` }), // source: app/Profiles.Web/Home.aspx:1-89
  compareProfileVersions: byProfile({ legacy: `${appRoot}/CompareProfileVersions.aspx`, gds: `${appRoot}/compare-profile-versions` }), // source: app/Profiles.Web/CompareProfileVersions.aspx:1-30
  manageProfile: byProfile({ legacy: `${appRoot}/ManageProfile.aspx`, gds: `${appRoot}/manage-profile` }), // source: app/Profiles.Web/Search.aspx:220-226
  profileProperties: byProfile({ legacy: `${appRoot}/ProfileProperties.aspx`, gds: `${appRoot}/profile-properties` }), // source: app/Profiles.Web/ProfileProperties.aspx:1-30
  editProfileTitle: byProfile({ legacy: `${appRoot}/EditProfileTitle.aspx`, gds: `${appRoot}/edit-profile-title` }), // source: app/Profiles.Web/EditProfileTitle.aspx:1-30
  profileReports: byProfile({ legacy: `${appRoot}/ProfileReports.aspx`, gds: `${appRoot}/profile-reports` }), // source: app/Profiles.Web/ProfileReports.aspx:1-100
  createBespokeReport: byProfile({ legacy: `${appRoot}/CreateBespokeReport.aspx`, gds: `${appRoot}/create-bespoke-report` }), // source: app/Profiles.Web/CreateBespokeReport.aspx:1-80
  editProfileQuestions: byProfile({ legacy: `${appRoot}/EditProfileQuestions.aspx`, gds: `${appRoot}/edit-profile-questions` }), // source: app/Profiles.Web/Search.aspx:337, app/Profiles.Web/EditProfileQuestions.aspx:1-20
  editSpecies: byProfile({ legacy: `${appRoot}/EditSpecies.aspx`, gds: `${appRoot}/edit-species` }), // source: app/Profiles.Web/EditSpecies.aspx:1-80
  reviewTimings: byProfile({ legacy: `${appRoot}/DiseaseReviews.aspx`, gds: `${appRoot}/review-timings` }), // source: app/Profiles.Web/NavigationLinks.ascx:18-31, app/Profiles.Web/Web.sitemap:6-10
  speciesDataAuditTrail: byProfile({ legacy: `${appRoot}/SpeciesDataAuditTrail.aspx`, gds: `${appRoot}/species-data-audit-trail` }), // source: app/Profiles.Web/SpeciesDataAuditTrail.aspx:1-120
  referenceTableAuditTrail: byProfile({ legacy: `${appRoot}/ReferenceTableAuditTrail.aspx`, gds: `${appRoot}/reference-table-audit-trail` }), // source: app/Profiles.Web/ReferenceTableAuditTrail.aspx:1-120
  maintainSpeciesData: byProfile({ legacy: `${appRoot}/MaintainSpeciesData.aspx`, gds: `${appRoot}/maintain-species-data` }), // source: app/Profiles.Web/NavigationLinks.ascx:57-72
  maintainReferenceData: byProfile({ legacy: `${appRoot}/MaintainReferenceData.aspx`, gds: `${appRoot}/maintain-reference-data` }), // source: app/Profiles.Web/NavigationLinks.ascx:57-72
  maintainPrioritisationVariables: byProfile({ legacy: `${appRoot}/MaintainPrioritisationVariables.aspx`, gds: `${appRoot}/maintain-prioritisation-variables` }), // source: app/Profiles.Web/NavigationLinks.ascx:57-72
  maintainCrossCuttingIssueScores: byProfile({ legacy: `${appRoot}/MaintainCrossCuttingIssueScores.aspx`, gds: `${appRoot}/maintain-cross-cutting-issue-scores` }), // source: app/Profiles.Web/NavigationLinks.ascx:57-72
  questionsAndGuidanceReports: byProfile({ legacy: `${appRoot}/EditUserGuidance.aspx`, gds: `${appRoot}/questions-and-guidance-reports` }), // source: app/Profiles.Web/NavigationLinks.ascx:34-47
  createDiseaseRankingFilter: byProfile({ legacy: `${appRoot}/EditDiseaseRankingFilters.aspx`, gds: `${appRoot}/edit-disease-ranking-filters` }), // source: app/Profiles.Web/EditDiseaseRankingFilters.aspx:1-30
  reviewEmail: byProfile({ legacy: `${appRoot}/ReviewEmail.aspx`, gds: `${appRoot}/review-email` }), // source: app/Profiles.Web/ReviewEmail.aspx:1
  profileQuestionHelp: byProfile({ legacy: `${appRoot}/ProfileQuestionHelp.aspx`, gds: `${appRoot}/profile-question-help` }) // source: app/Profiles.Web/ProfileQuestionHelp.aspx.vb:6-12
}

/** Page identity. Assert these, not URLs. */
export const pages = {
  home: { heading: byProfile({ legacy: 'D2R2', gds: 'D2R2' }) }, // source: app/Profiles.Web/Home.aspx:1-89
  search: { heading: byProfile({ legacy: 'Search disease profiles', gds: 'Search disease profiles' }) }, // source: app/Profiles.Web/Search.aspx:1-30
  diseaseRanking: { heading: byProfile({ legacy: 'Disease ranking', gds: 'Disease ranking' }) }, // source: app/Profiles.Web/DiseaseRanking.aspx:1-30
  generalReports: { heading: byProfile({ legacy: 'General reports', gds: 'General reports' }) }, // source: app/Profiles.Web/StaticReports.aspx:1-10
  viewSpeciesData: { heading: byProfile({ legacy: 'View species data', gds: 'View species data' }) }, // source: app/Profiles.Web/ViewSpeciesData.aspx:1-10
  help: { heading: byProfile({ legacy: 'Help using D2R2', gds: 'Help using D2R2' }) }, // source: app/Profiles.Web/StaticReports.aspx.vb:252-254
  sessionTimeout: { heading: byProfile({ legacy: 'Your application session has expired', gds: 'Your application session has expired' }) }, // source: app/Profiles.Web/SessionTimeout.aspx:1-12
  applicationError: { heading: byProfile({ legacy: 'An error has occurred', gds: 'An error has occurred' }) }, // source: app/Profiles.Web/ApplicationError.aspx:1-52
  createProfile: { heading: byProfile({ legacy: 'Create new profile', gds: 'Create new profile' }) }, // source: app/Profiles.Web/ProfileProperties.aspx:1-40
  globalUsers: { heading: byProfile({ legacy: 'Maintain global users', gds: 'Maintain global users' }) }, // source: app/Profiles.Web/MaintainGlobalUsers.aspx:1-40
  externalUsers: { heading: byProfile({ legacy: 'Maintain external users', gds: 'Maintain external users' }) }, // source: app/Profiles.Web/MaintainExternalUsers.aspx:1-40
  compareProfileVersions: { heading: byProfile({ legacy: 'Compare profile versions', gds: 'Compare profile versions' }) }, // source: app/Profiles.Web/CompareProfileVersions.aspx:1-30
  manageProfile: { heading: byProfile({ legacy: 'Manage profile', gds: 'Manage profile' }) }, // source: app/Profiles.Web/ManageProfile.aspx:1-30
  profileProperties: { heading: byProfile({ legacy: 'Profile properties', gds: 'Profile properties' }) }, // source: app/Profiles.Web/ProfileProperties.aspx:1-30
  profileReports: { heading: byProfile({ legacy: 'Profile reports', gds: 'Profile reports' }) }, // source: app/Profiles.Web/ProfileReports.aspx:1-100
  createBespokeReport: { heading: byProfile({ legacy: 'Create bespoke report', gds: 'Create bespoke report' }) }, // source: app/Profiles.Web/CreateBespokeReport.aspx:1-80
  editProfileQuestions: { heading: byProfile({ legacy: 'Edit profile questions', gds: 'Edit profile questions' }) }, // source: app/Profiles.Web/EditProfileQuestions.aspx:1-20
  editSpecies: { heading: byProfile({ legacy: 'Edit species data', gds: 'Edit species data' }) }, // source: app/Profiles.Web/EditSpecies.aspx:1-80
  editProfileTitle: { heading: byProfile({ legacy: 'Edit profile title', gds: 'Edit profile title' }) }, // source: app/Profiles.Web/EditProfileTitle.aspx:1-30
  maintainContributors: { heading: byProfile({ legacy: 'Maintain contributors for', gds: 'Maintain contributors for' }) }, // source: app/Profiles.Web/MaintainContributors.aspx:1-30
  contributionsReport: { heading: byProfile({ legacy: 'Contributions report', gds: 'Contributions report' }) }, // source: app/Profiles.Web/ShowContributionReport.aspx:1-30
  reviewTimings: { heading: byProfile({ legacy: 'Review timings', gds: 'Review timings' }) }, // source: app/Profiles.Web/DiseaseReviews.aspx:1-40
  speciesDataAuditTrail: { heading: byProfile({ legacy: 'Species data audit trail', gds: 'Species data audit trail' }) }, // source: app/Profiles.Web/SpeciesDataAuditTrail.aspx:1-120
  referenceTableAuditTrail: { heading: byProfile({ legacy: 'Audit trail for reference table', gds: 'Audit trail for reference table' }) }, // source: app/Profiles.Web/ReferenceTableAuditTrail.aspx.vb:53-60
  maintainSpeciesData: { heading: byProfile({ legacy: 'Maintain species data', gds: 'Maintain species data' }) }, // source: app/Profiles.Web/MaintainSpeciesData.aspx:1-20
  maintainReferenceData: { heading: byProfile({ legacy: 'Maintain reference data', gds: 'Maintain reference data' }) }, // source: app/Profiles.Web/MaintainReferenceData.aspx:1-20
  maintainPrioritisationVariables: { heading: byProfile({ legacy: 'Maintain profile prioritisation variables', gds: 'Maintain profile prioritisation variables' }) }, // source: app/Profiles.Web/MaintainPrioritisationVariables.aspx:1-20
  maintainCrossCuttingIssueScores: { heading: byProfile({ legacy: 'Maintain cross-cutting issue scores', gds: 'Maintain cross-cutting issue scores' }) }, // source: app/Profiles.Web/MaintainCrossCuttingIssueScores.aspx:1-20
  questionsAndGuidanceReports: { heading: byProfile({ legacy: 'Edit questions and guidance', gds: 'Edit questions and guidance' }) }, // source: app/Profiles.Web/EditUserGuidance.aspx:1-20
  createDiseaseRankingFilter: { heading: byProfile({ legacy: 'Edit disease ranking filters', gds: 'Edit disease ranking filters' }) }, // source: app/Profiles.Web/EditDiseaseRankingFilters.aspx:1-30
  reviewEmail: { heading: byProfile({ legacy: 'Review email', gds: 'Review email' }) } // source: app/Profiles.Web/ReviewEmail.aspx:1 (Title)
}
