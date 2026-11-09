// Manual-only ADO cases for behaviour the automated pack does not cover (needs extra accounts or changes data).
// Usage: node scripts/gen-manual-cases.js   (env ADO_AREA_PATH, ADO_ASSIGNED_TO, ADO_STATE are optional)
import fs from 'node:fs'
import path from 'node:path'

const outDir = path.resolve(import.meta.dirname, '..', 'docs', 'test-cases')
const areaPath = process.env.ADO_AREA_PATH ?? 'Path x'
const assignedTo = process.env.ADO_ASSIGNED_TO ?? ''
const state = process.env.ADO_STATE ?? 'Design'

let counter = 0
const s = (action, expected) => ({ action, expected })
const tc = (title, source, steps, loginAs = '<D2R2 account with the Profile editor role>') => ({
  ref: `MT-${String(++counter).padStart(3, '0')}`,
  title: title.slice(0, 120),
  layer: 'manual',
  acs: [`DERIVED: ${source}`],
  area_path: areaPath,
  assigned_to: assignedTo,
  state,
  steps: loginAs.startsWith('no account') ? steps : [s(`Log in to D2R2 as ${loginAs}`, 'The D2R2 Home page is displayed'), ...steps]
})
const home = (heading, link) => s(`Click ${link} in the main menu`, `The ${heading} page is displayed`)

// ---------- Roles, permissions and unauthenticated access ----------
const access = []

access.push(tc('Verify an unauthenticated browser is sent to the sign-in page for Home', 'app/Profiles.Web/Web.config authorization (deny users="?"), forms loginUrl ../VLAServices/Login.aspx', [
  s('Open a browser on a machine or profile that has no Windows or SSO session for the service', 'No D2R2 session cookie exists'),
  s('Open the D2R2 Home page address', 'The browser is redirected to the sign-in page (VLAServices Login) instead of the D2R2 Home page'),
  s('Check the page content', 'No D2R2 menu, search box or profile data is displayed'),
  s('Check the address bar', 'The address is the sign-in page address and not the requested D2R2 page'),
  s('Sign in with a valid D2R2 account', 'The D2R2 Home page is displayed')
], 'no account (unauthenticated browser; skip the login step)'))

for (const page of ['MaintainGlobalUsers', 'MaintainExternalUsers', 'ReviewEmail', 'Search']) {
  access.push(tc(`Verify an unauthenticated browser cannot open ${page} directly`, 'app/Profiles.Web/Web.config authorization (deny users="?")', [
    s('Open a browser with no Windows or SSO session for the service', 'No D2R2 session cookie exists'),
    s(`Open the address of ${page}.aspx directly`, 'The browser is redirected to the sign-in page'),
    s('Check the page content', `No ${page} controls or data are displayed`),
    s('Check the address bar', 'The address is the sign-in page address and not the requested D2R2 page'),
  s('Sign in with a valid D2R2 account', `The ${page} page is displayed only if the account has permission, otherwise the application error page is displayed`)
  ], 'no account (unauthenticated browser; skip the login step)'))
}

const restricted = [
  ['MaintainGlobalUsers', 'Maintain global users', 'MaintainGlobalUsers.aspx.vb:272'],
  ['MaintainExternalUsers', 'Maintain external users', 'MaintainExternalUsers.aspx.vb:71'],
  ['MaintainReferenceData', 'Maintain reference data', 'MaintainReferenceData.aspx.vb:75'],
  ['MaintainSpeciesData', 'Maintain species data', 'MaintainSpeciesData.aspx.vb:32'],
  ['EditUserGuidance', 'Edit questions and guidance', 'EditUserGuidance.aspx.vb:141'],
  ['ReferenceTableAuditTrail', 'reference table audit trail', 'ReferenceTableAuditTrail.aspx.vb:43'],
  ['SpeciesDataAuditTrail', 'species data audit trail', 'SpeciesDataAuditTrail.aspx.vb:45'],
  ['ReviewEmail', 'Review email', 'ReviewEmail.aspx.vb:16'],
  ['CompareProfileVersions', 'Compare profile versions', 'CompareProfileVersions.aspx.vb:34'],
  ['DiseaseRanking', 'Disease ranking', 'DiseaseRanking.aspx.vb:13'],
  ['CreateBespokeReport', 'Create bespoke report', 'CreateBespokeReport.aspx.vb:337'],
  ['ManageProfile', 'Manage profile', 'ManageProfile.aspx.vb:19'],
  ['MaintainContributors', 'Maintain contributors', 'MaintainContributors.aspx.vb:314'],
  ['EditProfileTitle', 'Edit profile title', 'EditProfileTitle.aspx.vb:23']
]
for (const [file, label, src] of restricted) {
  access.push(tc(`Verify an account without permission cannot open the ${label} page by address`, `app/Profiles.Web/${src} (SecurityException)`, [
    s('Open the D2R2 Home page', 'The Home page is displayed with only the menu links the account may use'),
    s(`Open the address of ${file}.aspx directly in the browser`, 'The application error page with the heading "An error has occurred" is displayed'),
    s('Check the page content', `No ${label} controls or data are displayed`),
    s('Click the D2R2 link at the top of the page', 'The Home page is displayed and the session is still signed in')
  ], '<D2R2 account that does not hold the permission for this page, for example a Policy profile user>'))
}

access.push(tc('Verify the menu hides links the account has no permission to use', 'app/Profiles.Web/NavigationLinks.ascx.vb:8-20 (Can* checks)', [
  s('Open the D2R2 Home page', 'The Home page is displayed'),
  s('Read the main menu links', 'The links shown are limited to those the account is allowed to use'),
  s('Compare the menu with the role matrix <role matrix for this account>', 'Every link in the matrix for this role is displayed and no other link is displayed'),
  s('Click each displayed link in turn', 'Each link opens its page without the application error page'),
  s('Repeat the check with a Profile editor and a Policy profile user account', 'The menu differs between roles exactly as the role matrix states')
], '<D2R2 account for the role under test>'))

access.push(tc('Verify a global user cannot change their own role', 'app/Profiles.Web/MaintainGlobalUsers.aspx.vb:85-86', [
  home('Maintain global users', 'Global Users'),
  s('Click Edit for the row of the signed-in account', 'The edit form opens with the current role selected'),
  s('Check the Role list', 'The Role list is disabled and cannot be changed'),
  s('Click Cancel', 'The form closes and the role is unchanged')
], '<D2R2 account with the global user administration role>'))

for (const [name, message] of [['an SSO user', 'SSO users cannot be given global access rights'], ['a user who is not in the profiles system', 'The user is not currently in the profiles system'], ['a user who cannot be made a global user', 'This user cannot be made a global user']]) {
  access.push(tc(`Verify the global user lookup rejects ${name}`, 'app/Profiles.Web/MaintainGlobalUsers.aspx.vb:66-75', [
    home('Maintain global users', 'Global Users'),
    s('Click the Add button', 'The add global user form is displayed'),
    s(`Enter the username of ${name} in the format Domain\\UserId in the Username field`, 'The username is shown in the field'),
    s('Click the Look up button', `The message "${message}" is displayed`),
    s('Check the OK button', 'The OK button stays disabled and no user is added')
  ], '<D2R2 account with the global user administration role>'))
}

access.push(tc('Verify a contributor lookup rejects a user who cannot be made a contributor', 'app/Profiles.Web/MaintainContributors.aspx.vb:83-84', [
  s('Search for <profile title> and click Manage on the first result', 'The Manage profile page is displayed'),
  s('Click the Maintain contributors and reviewers link', 'The Maintain contributors page is displayed'),
  s('Click Add a contributor', 'The add contributor form is displayed'),
  s('Enter the username of <user who cannot be a contributor> and look the user up', 'The message "This user cannot be made a contributor" is displayed'),
  s('Check the contributor list', 'No contributor is added')
]))

// ---------- Create, update, delete and remaining form rules (change data) ----------
const data = []
const synthetic = 'ADO-TEST <unique test title with date>'

data.push(tc('Verify a profile can be created with a title and appears in the search', 'app/Profiles.Web/ProfileProperties.aspx.vb:20,113 (Create profile)', [
  home('Create new profile', 'Create Profile'),
  s(`Enter "${synthetic}" in the profile title`, 'The title is shown in the title box'),
  s('Click the Create profile button', 'The profile is created and a confirmation or the Manage profile page is displayed'),
  s('Open Search disease profiles, search for the new title and click Search profiles', 'The new profile is listed in the results'),
  s('Delete the profile version created for this test (Manage profile, Delete)', 'The test data is removed')
]))

data.push(tc('Verify a profile title of 255 characters can be saved', 'app/Profiles.Web/EditProfileTitle.aspx.vb:46-51', [
  s('Search for <test profile> and click Edit Title on the first result', 'The Edit profile title page is displayed'),
  s('Enter a title of exactly 255 characters', 'The title shows 255 characters'),
  s('Click Save', 'The message "The profile title was successfully updated" is displayed'),
  s('Restore the original title and click Save', 'The message "The profile title was successfully updated" is displayed')
]))

data.push(tc('Verify a profile title of 256 characters is rejected', 'app/Profiles.Web/EditProfileTitle.aspx.vb:46', [
  s('Search for <test profile> and click Edit Title on the first result', 'The Edit profile title page is displayed'),
  s('Enter a title of exactly 256 characters', 'The title shows the entered characters'),
  s('Click Save', 'The message "Profile save failed: Title cannot exceed 255 characters" is displayed'),
  s('Search for <test profile> again', 'The profile still shows its original title')
]))

for (const kind of ['profile', 'scenario']) {
  data.push(tc(`Verify a new ${kind} can be cloned from an existing version`, 'app/Profiles.Web/ProfileProperties.aspx.vb:31-36', [
    s('Search for <test profile> and click Manage on the first result', 'The Manage profile page is displayed'),
    s(`Click the Clone new ${kind} link`, `The properties page shows "The new ${kind} will be cloned from:" followed by the source version`),
    s(`Enter "${synthetic}" as the title`, 'The title is shown in the title box'),
    s('Click the Create profile button', `The new ${kind} is created`),
    s('Delete the version created for this test', 'The test data is removed')
  ]))
}

data.push(tc('Verify the profile status can be changed on the Manage profile page', 'app/Profiles.Web/ManageProfile.aspx.vb:198', [
  s('Search for <test profile> and click Manage on the first result', 'The Manage profile page is displayed'),
  s('Select a different value in the profile status list', 'The new status is selected'),
  s('Save the change', 'The message "Successfully updated the profile status." is displayed'),
  s('Select the original status and save', 'The message "Successfully updated the profile status." is displayed')
]))

data.push(tc('Verify a draft version can be deleted after the confirmation prompt', 'app/Profiles.Web/ManageProfile.aspx:lnkDelete, ManageProfile.aspx.vb:114', [
  s('Open the Manage profile page for <test profile> that has a draft version', 'The Manage profile page is displayed'),
  s('Click the Delete link', 'A confirmation prompt asking whether to delete the version is displayed'),
  s('Click Cancel on the prompt', 'The version is not deleted'),
  s('Click the Delete link again and confirm', 'The draft version is removed and the page no longer lists it')
]))

data.push(tc('Verify a global user can be added with all required details and then revoked', 'app/Profiles.Web/MaintainGlobalUsers.aspx:60-117, MaintainGlobalUsers.aspx.vb:151', [
  home('Maintain global users', 'Global Users'),
  s('Click Add, enter <test username Domain\\UserId> and click Look up', 'The full name, organisation and role fields are enabled'),
  s('Enter a full name, an organisation and select Profile editor in the Role list', 'The values are shown'),
  s('Click OK', 'The user appears in the global users list'),
  s('Click Delete for the new user and confirm', 'The message "The user\'s global role was successfully revoked" is displayed')
], '<D2R2 account with the global user administration role>'))

for (const [field, limit, message] of [['full name', 100, 'Please enter a full name'], ['organisation', 100, 'Please enter an organisation']]) {
  data.push(tc(`Verify the global user ${field} is required and limited to ${limit} characters`, 'app/Profiles.Web/MaintainGlobalUsers.aspx:81-92', [
    home('Maintain global users', 'Global Users'),
    s('Click Add, enter <test username Domain\\UserId> and click Look up', `The ${field} field is enabled`),
    s(`Leave the ${field} empty, fill the other fields and click OK`, `The message "${message}" is displayed and the user is not added`),
    s(`Enter ${limit + 1} characters in the ${field} field`, `The field holds ${limit} characters`),
    s('Click Cancel', 'The form closes and no user is added')
  ], '<D2R2 account with the global user administration role>'))
}

data.push(tc('Verify an external user change is saved only after OK and validates role and sections', 'app/Profiles.Web/MaintainExternalUsers.aspx:133,149 and .vb:283,382', [
  home('Maintain external users', 'External Users'),
  s('Click Edit for <test external user>', 'The profiles for that user are listed'),
  s('Click Add for a profile and click OK without choosing a role', 'The message "Please select a valid role." is displayed'),
  s('Choose a role, untick every section and click OK', 'The message "At least one section must be ticked." is displayed'),
  s('Tick at least one section and click OK, then save the user', 'The message "The changes to the external user were saved successfully." is displayed'),
  s('Make a change and leave without clicking OK', 'The message "You have pending changes. To save these changes, click the OK button." is displayed')
], '<D2R2 account with the external user administration role>'))

data.push(tc('Verify a reference value can be added with a new value and a reason', 'app/Profiles.Web/MaintainReferenceData.aspx:103-119, .vb:242', [
  home('Maintain reference data', 'Maintain Reference Data'),
  s('Select the <reference table> and click Add reference value', 'The new value and reason fields are enabled'),
  s('Enter "ADO-TEST <unique value>" in the new value field and a reason in the reason field', 'The values are shown'),
  s('Click Save', 'The message "Reference value change successfully saved" is displayed'),
  s('Click View audit trail', 'The audit trail lists the change with the reason entered')
], '<D2R2 account with the reference data administration role>'))

data.push(tc('Verify a reference value change needs a new value and a reason', 'app/Profiles.Web/MaintainReferenceData.aspx:103-119', [
  home('Maintain reference data', 'Maintain Reference Data'),
  s('Select the <reference table> and click Add reference value', 'The new value and reason fields are enabled'),
  s('Leave both fields empty and click Save', 'The messages "You need to provide a new value" and "You need to provide a reason for this change" are displayed'),
  s('Enter 256 characters in the new value field', 'The field holds 255 characters'),
  s('Click Cancel', 'No reference value is added')
], '<D2R2 account with the reference data administration role>'))

data.push(tc('Verify species maintenance asks for a species before edit, inactivate or delete', 'app/Profiles.Web/MaintainSpeciesData.aspx.vb:182-245', [
  home('Maintain species data', 'Maintain Species Data'),
  s('Click Edit without selecting a species', 'The message "Please select a species to edit" is displayed'),
  s('Click Inactivate without selecting a species', 'The message "Please select a species to inactivate" is displayed'),
  s('Click Delete without selecting a species', 'The message "Please select a species to delete" is displayed'),
  s('Check the species list', 'No species is changed')
], '<D2R2 account with the species data administration role>'))

data.push(tc('Verify a species can be edited and the change appears in the species audit trail', 'app/Profiles.Web/MaintainSpeciesData.aspx.vb:100-118, SpeciesDataAuditTrail.aspx', [
  home('Maintain species data', 'Maintain Species Data'),
  s('Select <test species> and click Edit', 'The edit form opens with the current name'),
  s('Change the name to "ADO-TEST <unique name>" and click Save', 'The change is saved'),
  s('Click View audit trail', 'The species audit trail lists the change'),
  s('Restore the original name and click Save', 'The original name is shown')
], '<D2R2 account with the species data administration role>'))

data.push(tc('Verify a review comment can be edited and deleted', 'app/Profiles.Web/EditProfileReviewComments.aspx.vb:178-226', [
  s('Open the Browse profile page for a draft version and click the Review comments tab', 'The review comments are listed'),
  s('Click Edit for <test review comment>', 'The panel heading "Edit review comment" is displayed'),
  s('Change the comment text and click Save', 'The message "Review comment save succeeded" is displayed'),
  s('Click Delete for the same comment and confirm', 'The message "Review comment deletion succeeded" is displayed'),
  s('Check the review comments list', 'The comment is no longer listed')
]))

data.push(tc('Verify prioritisation variables can be saved and the criterion text is limited to 255 characters', 'app/Profiles.Web/MaintainPrioritisationVariables.aspx.vb:151,183', [
  home('Maintain profile prioritisation variables', 'Maintain Prioritisation Variables'),
  s('Select <category> in the prioritisation categories list', 'The variables for the category are listed'),
  s('Enter 256 characters in a criterion text', 'The validation message "The criterion text must be no longer than 255 characters" is displayed'),
  s('Enter a valid criterion text of 255 characters and click Update', 'The message "Your changes were successfully saved" is displayed'),
  s('Restore the original criterion text and click Update', 'The message "Your changes were successfully saved" is displayed')
], '<D2R2 account with the prioritisation administration role>'))

data.push(tc('Verify cross-cutting issue scores report when there is nothing to save and when they are saved', 'app/Profiles.Web/MaintainCrossCuttingIssueScores.aspx.vb:119-125', [
  home('Maintain cross-cutting issue scores', 'Maintain Cross-Cutting Issue Scores'),
  s('Click Update without changing any score', 'The message "There are no changes to save" is displayed'),
  s('Change one score and click Update', 'The message "Your changes were successfully saved" is displayed'),
  s('Restore the original score and click Update', 'The message "Your changes were successfully saved" is displayed')
], '<D2R2 account with the prioritisation administration role>'))

data.push(tc('Verify a static report can be uploaded and its version deleted', 'app/Profiles.Web/StaticReports.aspx.vb:134,182-191', [
  home('General reports', 'General Reports'),
  s('Click Browse for the upload and choose <synthetic test report file>', 'The file name is shown'),
  s('Enter a title if requested and click Add', 'The message "The report was uploaded successfully" is displayed'),
  s('Click the title of the new report', 'The report opens in a new browser window'),
  s('Click Delete for the new version', 'The message "The report version was successfully deleted" is displayed')
], '<D2R2 account with the static report administration role>'))

data.push(tc('Verify a static report upload fails with a message for an unsupported file', 'app/Profiles.Web/StaticReports.aspx.vb:187-191', [
  home('General reports', 'General Reports'),
  s('Choose <unsupported file type> in the upload field', 'The file name is shown'),
  s('Click Add', 'A message starting "Failed to upload the report" is displayed'),
  s('Check the reports list', 'No new report is listed')
], '<D2R2 account with the static report administration role>'))

for (const cases of [[access, 'manual-roles-and-access'], [data, 'manual-data-changes']]) {
  const [list, name] = cases
  const doc = {
    story_summary: name === 'manual-roles-and-access'
      ? 'Manual-only cases for unauthenticated access, role permissions and role-restricted pages.'
      : 'Manual-only cases for create, update, delete flows and remaining form rules that change data.',
    assumptions: [
      'Run on UAT. Values in angle brackets are replaced with real accounts or data before execution',
      'Cases that change data use synthetic titles starting "ADO-TEST" and restore or delete their data at the end',
      'Area path is a placeholder unless ADO_AREA_PATH was set'
    ],
    open_questions: [
      'Which accounts exist for each role, and what is the role-to-menu matrix?',
      'Which UAT records may be created, changed and deleted by testers?'
    ],
    coverage: list.map((t) => ({ ac: t.acs[0], test_cases: [t.title] })),
    test_cases: list
  }
  fs.writeFileSync(path.join(outDir, `${name}.json`), `${JSON.stringify(doc, null, 2)}\n`)
}
console.log(`${access.length + data.length} manual cases written`)


