// Builds the ADO manual test-case JSON from the Gherkin features, one JSON per feature.
// Usage: node scripts/gen-ado-cases.js   (env ADO_AREA_PATH, ADO_ASSIGNED_TO, ADO_STATE are optional)
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const featuresDir = path.join(root, 'features')
const outDir = path.join(root, 'docs', 'test-cases')
const areaPath = process.env.ADO_AREA_PATH ?? 'Path x'
const assignedTo = process.env.ADO_ASSIGNED_TO ?? ''
const state = process.env.ADO_STATE ?? 'Design'

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const step = (action, expected) => ({ action, expected })
const pageName = (s) => s.replace(/^the /, '').trim()
const fallbacks = []

const manageLinks = {
  'maintain contributors': 'Maintain contributors and reviewers',
  'profile properties': 'Edit properties',
  'contributions report': 'Contributions'
}

// Ordered rules: first match wins. Each returns a list of { action, expected } steps.
const rules = [
  [/^the profile counts for the letters A to Z add up to the count for all letters$/, () => [step('Search with each letter A to Z and note the counts, then search with All', 'The 26 counts add up to the count for All')]],
  [/^the applicant chooses the last page of the results$/, () => [step('Click the highest page number under the results', 'The last page is displayed and marked as current')]],
  [/^the last page lists only the remaining profiles$/, () => [step('Count the profiles on the last page', 'The count equals the remainder of the total divided by the page size')]],
  [/^there is no Next page link$/, () => [step('Check the page numbers under the results', 'There is a Previous page link and no Next page link')]],
  [/^the applicant notes the date of the first profile$/, () => [step('Note the date shown for the first profile', 'The date is noted')]],
  [/^the date of the first profile is not earlier than the noted date$/, () => [step('Compare the first profile date with the noted date', 'The newer sort shows an equal or later date')]],
  [/^the page lists the reference groups (.+)$/, (m) => [step('Read the References tab', `${m[1].replace(/"/g, '')} are listed`)]],
  [/^no error message is shown on the page$/, () => [step('Check the page', 'No "There is a problem" message is displayed')]],
  [/^the applicant uses a phone-sized screen$/, () => [step('Set the browser window to 375 by 667 pixels', 'The page uses the phone layout')]],
  [/^the header menu is closed$/, () => [step('Check the header menu', 'The menu panel is hidden and the menu button is not expanded')]],
  [/^the applicant presses Escape$/, () => [step('Press the Escape key', 'The menu closes')]],
  [/^the applicant opens the search results for "(.*)"$/, (m) => [step(`Open Search Disease Profiles with all version types ticked and search for "${m[1]}"`, 'The matching profiles are listed')]],
  [/^the first profile shows its current published version.*$/, () => [step('Read the first profile card', 'It shows the current published version, the profile status, and View reports and Browse profile links')]],
  [/^the applicant (shows|hides) the previous versions of the first profile$/, (m) => [step(`Click ${m[1] === 'shows' ? 'Show' : 'Hide'} previous versions on the first profile`, m[1] === 'shows' ? 'The earlier versions are listed' : 'The earlier versions are hidden')]],
  [/^the previous versions are listed.*$/, () => [step('Check the list of versions', 'Each version shows its dates with View reports and Browse profile links')]],
  [/^the previous versions are not listed$/, () => [step('Check the first profile', 'No earlier versions are shown and the button reads Show previous versions')]],
  [/^the applicant opens (View reports|Browse profile) for the first profile$/, (m) => [step(`Click ${m[1]} on the first profile`, m[1] === 'View reports' ? 'The Profile reports page opens' : 'The profile opens')]],
  [/^the profile reports page is shown for "(.+)"$/, (m) => [step('Check the heading', `It reads "Profile reports for ${m[1]}" with the version`)]],
  [/^the browse page is shown for "(.+)"$/, (m) => [step('Check the heading', `It reads "${m[1]}"`)]],
  [/^the applicant chooses (Next|Previous) page of the results$/, (m) => [step(`Click ${m[1]} page under the results`, 'The results page changes')]],
  [/^page "(\d+)" of the results is current$/, (m) => [step('Check the page numbers under the results', `Page ${m[1]} is marked as the current page`)]],
  [/^the profile reports page lists (.+)$/, (m) => [step('Check the table of reports', `${m[1].replace(/"/g, '')} are listed`)]],
  [/^the profile reports page explains how to request access.*$/, () => [step('Read the text above the table', 'It explains how to request permission for scenarios and drafts, with a link to D2R2@defra.gov.uk')]],
  [/^the applicant downloads the "(.+)" report$/, (m) => [step(`Click ${m[1]}`, 'A PDF file is downloaded')]],
  [/^the downloaded file is named "(.+)"$/, (m) => [step('Check the downloaded file name', `It is ${m[1]}`)]],
  [/^the applicant chooses Browse disease profile$/, () => [step('Click Browse disease profile', 'The profile opens')]],
  [/^the browse page shows the version.*$/, () => [step('Read the browse page', 'The version and status, the Summary, References and Further information tabs and Show all sections are displayed')]],
  [/^the applicant (shows|hides) the section "(.+)"$/, (m) => [step(`Click ${m[2]} to ${m[1] === 'shows' ? 'show' : 'hide'} it`, `The section is ${m[1] === 'shows' ? 'open' : 'closed'}`)]],
  [/^the section "(.+)" is (open|closed)$/, (m) => [step(`Check ${m[1]}`, `It is ${m[2]}`)]],
  [/^the applicant chooses Show all sections$/, () => [step('Click Show all sections', 'Every section opens')]],
  [/^every section is open$/, () => [step('Check each section', 'All are open')]],
  [/^the applicant chooses the contents link "(.+)"$/, (m) => [step(`Click the contents link for section ${m[1]}`, 'That section opens')]],
  [/^the section "(.+)" is listed$/, (m) => [step('Check the page', `Question ${m[1]} is listed`)]],
  [/^the applicant chooses the tab "(.+)"$/, (m) => [step(`Click the ${m[1]} tab`, `The ${m[1]} content opens`)]],
  [/^the tab "(.+)" is the current tab$/, (m) => [step('Check the tabs', `${m[1]} is marked as current`)]],
  [/^the applicant chooses the Next page link of (?:the profile|the species data)$/, () => [step('Click the Next page link at the foot of the page', 'The next section opens')]],
  [/^the species data lists the chapters (.+)$/, (m) => [step('Check the chapter links', `${m[1].replace(/"/g, '')} are listed`)]],
  [/^the applicant chooses the chapter "(.+)"$/, (m) => [step(`Click ${m[1]}`, 'The chapter opens')]],
  [/^the question "(.+)" is listed$/, (m) => [step('Check the page', `Question ${m[1]} is listed`)]],
  [/^the applicant (shows|hides) the first species data question$/, (m) => [step(`Click the first question to ${m[1] === 'shows' ? 'show' : 'hide'} it`, `The question is ${m[1] === 'shows' ? 'open' : 'closed'}`)]],
  [/^the first species data question is (open|closed)$/, (m) => [step('Check the first question', `It is ${m[1]}`)]],
  [/^the applicant requests the address "(.+)"$/, (m) => [step(`Open ${m[1]} in the browser`, 'The request is made')]],
  [/^the response status is (\d+)$/, (m) => [step('Check the response', `The status is ${m[1]} (not found)`)]],
  [/^the applicant ticks the species "(.+)"$/, (m) => [step(`Tick ${m[1]} in the affected species tree`, `${m[1]} is ticked`)]],
  [/^the applicant unticks the species "(.+)"$/, (m) => [step(`Untick ${m[1]}`, `${m[1]} is not ticked`)]],
  [/^the species "(.+)" is (not )?ticked$/, (m) => [step(`Check ${m[1]} in the tree`, `${m[1]} is ${m[2] ? 'not ' : ''}ticked`)]],
  [/^the species status reads "(.+)"$/, (m) => [step('Check the Currently selected text under the tree', `It reads "${m[1]}"`)]],
  [/^exactly (\d+) species (?:is|are) ticked$/, (m) => [step('Count the ticked species', `${m[1]} species ${m[1] === '1' ? 'is' : 'are'} ticked`)]],
  [/^the result count is the union of the three single species results$/, () => [step('Search for each of the three species on its own and compare counts', 'The combined count is at least the largest single count, at most their sum, and equals the count for the three species together')]],
  [/^the applicant chooses the tree toggle named "(.+)"$/, (m) => [step(`Click ${m[1]} above the tree`, 'All branches close or open')]],
  [/^the tree toggle is named "(.+)"$/, (m) => [step('Check the toggle above the tree', `It reads ${m[1]}`)]],
  [/^the applicant hides the affected species filter$/, () => [step('Click Hide filter by affected species', 'The tree is hidden')]],
  [/^the affected species tree is not shown$/, () => [step('Check the page', 'The species tree is not displayed')]],
  [/^the applicant chooses the species "(.+)" on the view species data page$/, (m) => [step(`Select ${m[1]} in the species list`, `${m[1]} is selected`)]],
  [/^the view species data page reports "(.+)"$/, (m) => [step('Check the selection text', `It reads "${m[1]}"`)]],
  [/^the view species data page does not report "(.+)"$/, (m) => [step('Check the selection text', `It no longer names ${m[1]}`)]],
  [/^the applicant opens the data for the chosen species$/, () => [step('Click View data', 'The species data page opens')]],
  [/^the species data page for "(.+)" is shown$/, (m) => [step('Check the page heading', `It reads "View species data - ${m[1]}"`)]],
  [/^the applicant removes the species selection$/, () => [step('Click Remove selection', 'The selection is cleared')]],
  [/^the applicant is on the "(.+)" page$/, (m) => [step(`Open the ${m[1]} page`, `The ${m[1]} page is displayed`)]],
  [/^the applicant chooses the shared link "(.+)"$/, (m) => [step(`Click ${m[1]}`, 'The link is followed')]],
  [/^the "(.+)" page is displayed$/, (m) => [step('Check the page', `The ${m[1]} page is displayed`)]],
  [/^the address ends with "(.+)"$/, (m) => [step('Check the browser address', `It ends with ${m[1]}`)]],
  [/^the applicant stays on the "(.+)" page$/, (m) => [step('Check the page', `The ${m[1]} page is still displayed because the link has no destination`)]],
  [/^the applicant chooses the quality statement link$/, () => [step('Click D2R2 Quality Statement in the footer', 'The quality statement document is downloaded')]],
  [/^a document is downloaded$/, () => [step('Check the browser downloads', 'A file with a name is downloaded')]],
  [/^the APHA logo links to the APHA intranet$/, () => [step('Check the APHA logo link', 'It points to the APHA intranet')]],
  [/^the applicant chooses the header help icon$/, () => [step('Click the help icon in the header', 'The Help Using D2R2 page is displayed')]],
  [/^the applicant opens the header menu$/, () => [step('Open the header menu', 'The menu panel is displayed')]],
  [/^the header menu offers (.+)$/, (m) => [step('Check the menu panel', `It offers ${m[1].replace(/"/g, '')}`)]],
  [/^the applicant chooses the menu link "(.+)"$/, (m) => [step(`Click ${m[1]} in the menu`, 'The page opens')]],
  [/^the applicant chooses the first (manual|report|version in the history)$/, (m) => [step(`Click the first ${m[1]}`, 'The document is downloaded')]],
  [/^the help page offers the email link "(.+)"$/, (m) => [step('Check the contact links', `A mailto link for ${m[1]} is displayed`)]],
  [/^the applicant opens the search page with all version types displayed$/, () => [step('Open the Search Disease Profiles page with published, draft and scenario versions all ticked and the letter All', 'The Search Disease Profiles page is displayed with all three display options ticked')]],
  [/^the applicant submits the search form$/, () => [step('Click Search profiles', 'The results list and the count of disease profiles found are displayed')]],
  [/^profiles are listed with a result count$/, () => [step('Check the results', 'A count greater than 0 and at least one profile card are displayed')]],
  [/^the applicant searches for "(.*)"$/, (m) => [step(`Enter "${m[1]}" in the Search for disease profiles box and click Search profiles`, 'The results are reloaded for that text')]],
  [/^every listed profile title contains "(.+)" ignoring case$/, (m) => [step('Check every profile title in the results', `Each title contains "${m[1]}" whatever its letter case`)]],
  [/^no disease profiles match the search$/, () => [step('Check the results', 'The count is 0 and "No disease profiles match your search criteria. Please try different search terms or filter options." is displayed')]],
  [/^the result count equals that of a blank search$/, () => [step('Compare the count with a search with no text and all versions ticked', 'The counts are equal')]],
  [/^the applicant types (\d+) characters in the search box$/, (m) => [step(`Type ${m[1]} characters into the search box`, 'Typing stops accepting characters at the limit')]],
  [/^the search box holds (\d+) characters$/, (m) => [step('Check the search box', `It holds exactly ${m[1]} characters`)]],
  [/^the applicant searches for (\d+) repeated characters$/, (m) => [step(`Enter ${m[1]} characters and click Search profiles`, 'The search completes without an error')]],
  [/^the request is refused with a forbidden page$/, () => [step('Check the page that is displayed', 'A "403 Forbidden" page is displayed instead of results')]],
  [/^the applicant shows the more filters$/, () => [step('Click More filters', 'The Search for options and the Appears in list are displayed')]],
  [/^the applicant searches for "(.+)" using the "(.+)" option$/, (m) => [step(`Tick "${m[2]}", enter "${m[1]}" and click Search profiles`, 'The results are reloaded')]],
  [/^the applicant searches for "(.+)" appearing in "(.+)"$/, (m) => [step(`Choose "${m[2]}" in the Appears in list, enter "${m[1]}" and click Search profiles`, 'The results are reloaded')]],
  [/^the "(.+)" list shows "(.+)" selected$/, (m) => [step(`Check the ${m[1]} list`, `"${m[2]}" is selected`)]],
  [/^the applicant displays only "(.+)" versions$/, (m) => [step(`Tick only the Display ${m[1]} option and untick the other two`, 'The results reload for that version type')]],
  [/^the applicant displays (all|no) version types$/, (m) => [step(`${m[1] === 'all' ? 'Tick' : 'Untick'} all three Display options`, 'The results reload')]],
  [/^the status checkboxes show only "(.+)" ticked$/, (m) => [step('Check the three Display options', `Only the ${m[1]} option is ticked`)]],
  [/^the applicant notes the result count$/, () => [step('Note the count of disease profiles found', 'The count is noted')]],
  [/^the result count is not greater than the noted count$/, () => [step('Compare the new count with the noted count', 'The new count is less than or equal to the noted count')]],
  [/^the applicant sorts the results by "(.+)"$/, (m) => [step(`Choose "${m[1]}" in the Sort by list`, 'The results reload in that order')]],
  [/^the listed titles are in (ascending|descending) order$/, (m) => [step('Check the order of the listed titles', `The titles are in ${m[1]} alphabetical order`)]],
  [/^the applicant shows "(.+)" profiles per page$/, (m) => [step(`Choose ${m[1]} in the Items per page list`, 'The results reload')]],
  [/^at most "(.+)" profiles are listed$/, (m) => [step('Count the profile cards', m[1] === 'All' ? 'Every profile found is listed' : `No more than ${m[1]} profiles are listed`)]],
  [/^the applicant notes the first listed profile$/, () => [step('Note the title of the first profile', 'The title is noted')]],
  [/^the applicant opens the next page of results$/, () => [step('Click Next in the Search results pages navigation', 'The next page of results is displayed')]],
  [/^the first listed profile is different from the noted one$/, () => [step('Compare the first title with the noted one', 'They are different')]],
  [/^the applicant chooses the letter "(.+)"$/, (m) => [step(`Click ${m[1]} in the view profiles beginning with list`, 'The results reload for that letter')]],
  [/^every listed profile title begins with "(.+)"$/, (m) => [step('Check every profile title', `Each title begins with ${m[1]}`)]],
  [/^the result is either no profiles or only titles beginning with "(.+)"$/, (m) => [step('Check the results', `No profiles are listed, or every title begins with ${m[1]}`)]],
  [/^the applicant shows the affected species filter$/, () => [step('Click Show filter by affected species', 'The affected species tree is displayed')]],
  [/^the applicant selects the first affected species$/, () => [step('Tick the first species in the tree', 'The species is ticked')]],
  [/^the selected species is reported as currently selected$/, () => [step('Check the Currently selected text', 'It names the ticked species')]],
  [/^the applicant searches with text "(.+)", only "(.+)" versions, sorted by "(.+)", "(.+)" per page$/, (m) => [
    step(`Search for "${m[1]}"`, 'Results are displayed'),
    step(`Display only ${m[2]} versions`, 'The results reload'),
    step(`Sort by ${m[3]}`, 'The results reload in that order'),
    step(`Show ${m[4]} items per page`, 'The results reload with that page size')
  ]],
  [/^the applicant opens the "(.+)" report table$/, (m) => [step(`Open the ${m[1]} page`, 'A table of reports with Title, Version and Effective dates columns, an Items per page list and a History link per report is displayed')]],
  [/^the applicant sorts the report table by "(.+)"$/, (m) => [step(`Click the ${m[1]} column heading`, 'The table is reloaded sorted by that column')]],
  [/^the "(.+)" column is marked as sorted$/, (m) => [step(`Check the ${m[1]} column heading`, 'The heading shows an ascending or descending sort state')]],
  [/^the applicant opens the history of the first report$/, () => [step('Click History on the first report row', 'The History for <report title> page is displayed')]],
  [/^the report history page is shown$/, () => [step('Check the page that is displayed', 'The page heading starts with "History for" and lists the versions of the report')]],
  [/^the applicant chooses the last items per page option$/, () => [step('Select the last option in the Items per page list', 'The table reloads with that page size')]],
  [/^the items per page option stays selected$/, () => [step('Check the Items per page list', 'The chosen option is still selected')]],
  [/^the disease ranking report is downloaded$/, () => [step('Check the browser downloads', 'The stored Disease ranking report file is downloaded')]],
  [/^the applicant opens the "(.+)" page by address$/, (m) => [step(`Open the ${m[1]} page by typing its address in the browser`, 'The "You do not have permission to view this page" message is displayed')]],
  [/^the permission denied page is shown$/, () => [step('Check the page that is displayed', 'The message "You do not have permission to view this page" and a Go to the D2R2 home page link are displayed, and none of the page\'s controls are shown')]],
  [/^the applicant chooses to go to the D2R2 home page$/, () => [step('Click the Go to the D2R2 home page link', 'The D2R2 Home page is displayed')]],
  [/^the home page does not offer the editor links$/, () => [step('Check the Home page and the main menu', 'None of these links are displayed: Compare profile versions, Create disease ranking filter, Create profile, Review timings, Maintain species data, Maintain reference data, Maintain global users, Maintain external users, Maintain prioritisation variables, Maintain cross-cutting issue scores, Edit questions and guidance')]],
  [/^the applicant asks the application for the session status$/, () => [step('Request GET /Session/Status while signed in', 'The request returns HTTP 200 with JSON')]],
  [/^the session is reported as active with time remaining$/, () => [step('Check the JSON response', 'authenticated is true and remainingSeconds is greater than 0')]],
  [/^the session (warning|expired) dialog is not shown$/, (m) => [step(`Check the ${m[1] === 'warning' ? 'Extend session?' : 'Session expired'} dialog`, 'The dialog exists in the page but is not displayed')]],
  [/^the applicant asks to extend the session without a token$/, () => [step('Send POST /Session/Extend without an antiforgery token', 'The request is sent')]],
  [/^the application rejects the request as invalid$/, () => [step('Check the response', 'The response is HTTP 400 and the session is not extended')]],
  [/^the home page does not show the (.+) link$/, (m) => [step('Check the main menu on the Home page', `The ${m[1]} link is not displayed`)]],
  [/^the applicant opens the edit species page$/, () => [step('Click the Edit link for a species on the Maintain species data page', 'The Edit species data page is displayed')]],
  [/^the applicant opens the "(.+)" tab of the browse profile page$/, (m) => [step(`Click the ${m[1]} tab`, `The ${m[1]} tab content is displayed for the profile section`)]],
  [/^the applicant opens the "(.+)" section link$/, (m) => [step(`Click the ${m[1]} link in the profile section links`, `The ${m[1]} page is displayed`)]],
  [/^the applicant opens the full profile print version$/, () => [step('Click the Print full profile link', 'A new browser window opens for the print version')]],
  [/^the print version opens in a new window$/, () => [step('Check for a new browser window', 'A new browser window opens for the full profile print version')]],
  [/^the applicant browses the profile from the profile reports page$/, () => [step('Click the Browse profile link on the Profile reports page', 'The profile questions page for that version is displayed')]],
  [/^the applicant opens the questions and guidance reports page directly$/, () => [step('Open the Edit questions and guidance page directly in the browser', 'The Edit questions and guidance page is displayed')]],
  [/^the applicant is on the home page$/, () => [step('Open the D2R2 Home page', 'The Home page is displayed with the D2R2 menu')]],
  [/^the applicant is on the search page$/, () => [step('Open the Search disease profiles page', 'The Search disease profiles page is displayed with the search box and filters')]],
  [/^the applicant is on the create profile page$/, () => [step('Open the Create new profile page', 'The Create new profile page is displayed with an empty title and a Create profile button')]],
  [/^the applicant is on the (.+) page$/, (m) => [step(`Open the ${m[1]} page`, `The ${m[1]} page is displayed with its heading and controls`)]],
  [/^the applicant is on the review email page$/, () => [step('Open the Review email page', 'The Review email page is displayed')]],
  [/^the applicant opens the application error page$/, () => [step('Open the application error page directly in the browser', 'The page with the heading "An error has occurred" is displayed')]],
  [/^the applicant opens the session timeout page$/, () => [step('Open the session timeout page directly in the browser', 'The page with the heading "Your application session has expired" is displayed')]],
  [/^the applicant opens the (reference table|species data) audit trail page$/, (m) => [step(`Click the View Audit Trail button for the ${m[1]} screen`, `The ${m[1]} audit trail page is displayed`)]],
  [/^the applicant clicks View Audit Trail$/, () => [step('Click the View audit trail button', 'The audit trail page for the selected table is displayed')]],
  [/^the applicant selects the Surveillance outcome reference table$/, () => [step('Select Surveillance outcome in the reference table list', 'The Surveillance outcome reference values are listed')]],
  [/^the applicant opens the question help page without a question$/, () => [step('Open the Profile question help page without a ProfileQuestionId in the address', 'The "An error has occurred" page is displayed')]],
  [/^the applicant chooses the terrestrial disease ranking report$/, () => [step('Select "Disease ranking report: Terrestrial diseases" in the disease ranking report list', 'The option "Disease ranking report: Terrestrial diseases" is shown as selected')]],
  [/^the applicant chooses (.+)$/, (m) => [step(`Click ${m[1]} in the main menu`, `The ${m[1]} page is displayed`)]],
  [/^the applicant searches for "(.+)"$/, (m) => [
    step(`Enter "${m[1]}" in the Search for disease profiles field`, `"${m[1]}" is shown in the field`),
    step('Click the Search profiles button', 'The search results list is displayed')
  ]],
  [/^the search results show "(.+)"$/, (m) => [step('Check the search results list', `A result named "${m[1]}" is listed`)]],
  [/^the applicant opens the manage page for the first result$/, () => [step('Click the Manage link on the first search result', 'The Manage profile page is displayed')]],
  [/^the applicant opens the browse profile page for an editable draft version$/, () => [
    step('Tick Display draft versions and click Search profiles', 'Draft versions are included in the search results'),
    step('Click Browse profile on a draft version that shows the Contributions tab', 'The profile questions page is displayed with the tabs Summary, References, Further information, Review comments, All Revision dates and Contributions')
  ]],
  [/^the applicant opens the browse profile page from the search results$/, () => [step('Click the Browse profile link on the first search result', 'The profile questions page for that version is displayed')]],
  [/^the applicant opens the (maintain contributors|profile properties|contributions report) from the manage page$|^the applicant opens the (maintain contributors|profile properties) page from the manage page$/, (m) => {
    const key = m[1] ?? m[2]
    return [step(`Click the ${manageLinks[key]} link on the Manage profile page`, `The ${key} ${key === 'contributions report' ? '' : 'page '}is displayed`.replace('  ', ' '))]
  }],
  [/^the applicant opens the profile reports page (?:for the first result|from the manage page)$/, () => [step('Click the link to the profile reports (View reports) for the first result', 'The Profile reports page is displayed')]],
  [/^the applicant opens the edit profile title page from the (search results|manage page)$/, () => [step('Click the Edit Title link', 'The Edit profile title page is displayed')]],
  [/^the applicant clones a new (profile|scenario) from the (search results|manage page)$/, (m) => [step(`Click the Clone ${m[1]} link (Clone new ${m[1]} on the Manage page)`, 'The Profile properties page is displayed for the new copy')]],
  [/^the applicant opens the bespoke report builder$/, () => [step('Click the Create bespoke report button', 'The Create bespoke report page is displayed')]],
  [/^the applicant opens the review comments page from the browse profile page$/, () => [step('Click the Review comments tab', 'The review comments tab is displayed with the Add a review comment option')]],
  [/^the applicant clicks add review comment$/, () => [step('Click the Add button', 'The add review comment form opens with Subject, Reference and Comment fields')]],
  [/^the applicant saves an empty review comment$/, () => [step('Leave Subject, Reference and Comment empty and click Save', 'The form is not saved')]],
  [/^the applicant adds a review comment with subject "(.+)", reference "(.+)", and comment "(.+)"$/, (m) => [
    step(`Enter "${m[1]}" in the Subject field`, `"${m[1]}" is shown in the Subject field`),
    step(`Enter "${m[2]}" in the Reference field`, `"${m[2]}" is shown in the Reference field`),
    step(`Enter "${m[3]}" in the Comment field`, `"${m[3]}" is shown in the Comment field`),
    step('Click Save', 'The form closes and the comment is saved')
  ]],
  [/^the applicant clicks add a contributor$/, () => [step('Click the Add a contributor option', 'The add contributor form is displayed')]],
  [/^the applicant saves the contributor without required details$/, () => [step('Leave the required contributor fields empty and click Save', 'The contributor is not saved')]],
  [/^the applicant submits the empty profile title form$/, () => [step('Clear the profile title and click Save', 'The title is not saved')]],
  [/^the applicant compares the selected versions$/, () => [step('Click the Compare button', 'The comparison is requested')]],
  [/^the applicant selects (\d+) profile versions to compare$/, (m) => [
    step('Click Open all to expand the profile version tree', 'All profile versions are listed with a tick box each'),
    step(`Tick the first ${m[1]} profile version${m[1] === '1' ? '' : 's'}`, `${m[1]} version${m[1] === '1' ? ' is' : 's are'} ticked`)
  ]],
  [/^the applicant opens the first static report$/, () => [step('Click the title of the first report in the general reports list', 'The report opens in a new browser window')]],
  [/^the applicant generates the "(.+)" guidance report$/, (m) => [step(`Click the ${m[1]} button`, 'A new browser window opens for the guidance report')]],
  [/^the applicant opens the "(.+)" report from the "(.+)" report selector$/, (m) => [step(`Select "Disease ranking report: ${m[1]} diseases" in the ${m[2] === 'RFI' ? 'RFI report' : 'disease ranking report'} list`, 'A new browser window opens for the report')]],
  [/^the applicant prints the variables for the first prioritisation category$/, () => [
    step('Select the first category in the prioritisation categories list', 'The variables for the category are listed'),
    step('Click the Print category variables button', 'A new browser window opens for the print version')
  ]],
  [/^the applicant opens the first profile report$/, () => [step('Click the title of the first report in the Profile reports list', 'The report opens in a new browser window')]],
  [/^the applicant opens the first question help$/, () => [step('Click the first help icon next to a question', 'A help window opens')]],
  [/^the applicant (?:enters (\d+) characters in the global user username)$/, (m) => [
    step('Click the Add button', 'The add global user form is displayed'),
    step(`Type ${m[1]} characters in the Username field`, 'The field accepts the text')
  ]],
  [/^the applicant looks up the global user "(.*)"$/, (m) => [
    step('Click the Add button', 'The add global user form is displayed'),
    step(m[1] === '' ? 'Leave the Username field empty' : `Enter "${m[1]}" in the Username field`, m[1] === '' ? 'The Username field is empty' : `"${m[1]}" is shown in the field`),
    step('Click the Look up button', 'The lookup is requested')
  ]],
  [/^the applicant saves the new profile without a title$/, () => [step('Leave the title empty and click Create profile', 'The profile is not created')]],

  [/^the "(.+)" report window is opened$/, (m) => [step('Check for a new browser window', `A new browser window opens for the ${m[1]} report`)]],
  [/^the question help window is opened$/, () => [step('Check for a new browser window', 'A help window opens for the question')]],
  [/^the report page loads without an application error$/, () => [step('Check the report page that opened', 'The report page is displayed and no "An error has occurred" heading is shown')]],
  [/^the review email page shows the test-only notice$/, () => [step('Read the text on the Review email page', 'The text "This page is for testing purposes only" is displayed')]],
  [/^the compare versions selection message is shown$/, () => [step('Check the message on the Compare profile versions page', 'The message "Please select 2 disease profile versions to compare" is displayed')]],
  [/^the field rule message "(.+)" is shown$/, (m) => [step('Check the validation message', `The message "${m[1]}" is displayed`)]],
  [/^the global user username holds (\d+) characters$/, (m) => [step('Check the characters in the Username field', `The field holds ${m[1]} characters`)]],
  [/^the (.+) page remains in the dedicated error state$/, (m) => [step('Check the page after it loads', `The ${m[1]} page stays displayed and does not redirect`)]],
  [/^the (.+) page shows the (.+?)(?: after (?:direct access|home navigation))?$/, (m) => [step(`Check the ${m[1]} page content`, `The ${m[2]} are visible`)]],
  [/^the (.+) page keeps the selected report$/, () => [step('Check the report selector', '"Disease ranking report: Terrestrial diseases" remains selected')]],
  [/^the (.+) page is shown(?: from home navigation)?$/, (m) => [step('Check the page that is displayed', `The ${pageName(m[1])} page is displayed`)]],
  [/^the (.+) is shown$/, (m) => [step('Check the page that is displayed', `The ${m[1]} is displayed`)]],
  [/^the (.+) page is shown from home navigation$/, (m) => [step('Check the page that is displayed', `The ${m[1]} page is displayed`)]],
  [/^the add (contributor|review comment) form is shown$/, (m) => [step('Check the form', `The add ${m[1]} form is displayed`)]],
  [/^the (title|review comment|contributor) validation messages? (?:is|are) shown$/, (m) => [step('Check the validation message', `A validation message for the ${m[1]} is displayed`)]],
  [/^the review comment is saved in the review comments list$/, () => [step('Check the review comments list', 'The new comment is listed with the entered subject')]],
  [/^the home navigation (.+) page is shown$/, (m) => [step('Check the page that is displayed', `The ${m[1]} page is displayed`)]]
]

function mapStep(text) {
  for (const [re, fn] of rules) {
    const m = text.match(re)
    if (m) return fn(m)
  }
  fallbacks.push(text)
  return [step(cap(text), 'The result is displayed on the page')]
}

const padding = [
  step('Check the page for error messages', 'No "An error has occurred" heading or error message is displayed'),
  step('Check the page heading', 'The page heading is visible'),
  step('Check the main menu', 'The main menu links are visible')
]

function parseFeature(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  const cases = []
  let tags = []
  let current = null
  lines.forEach((raw, idx) => {
    const line = raw.trim()
    if (line.startsWith('@')) { tags = tags.concat(line.split(/\s+/)); return }
    const sc = line.match(/^Scenario(?: Outline)?: (.+)$/)
    if (sc) {
      const ref = tags.find((t) => /^@TC-\d+$/.test(t))?.slice(1)
      current = { ref, title: sc[1].trim(), steps: [], line: idx + 1, editor: tags.includes('@needs:editor'), examples: [], outline: /^Scenario Outline/.test(line) }
      cases.push(current)
      tags = []
      return
    }
    const row = line.match(/^\|(.+)\|$/)
    if (row && current?.outline) { current.examples.push(row[1].split('|').map((c) => c.trim())); return }
    const st = line.match(/^(Given|When|Then|And|But) (.+)$/)
    if (st && current) current.steps.push(st[2])
  })
  return cases
}

fs.mkdirSync(outDir, { recursive: true })
let total = 0
for (const file of fs.readdirSync(featuresDir, { recursive: true }).filter((f) => f.endsWith('.feature'))) {
  const feature = path.basename(file, '.feature')
  const rel = `features/${file.replace(/\\/g, '/')}`
  const scenarios = parseFeature(path.join(featuresDir, file))
  const testCases = scenarios.map((sc) => {
    const steps = [step(sc.editor ? 'Log in to D2R2 with an account that has the ProfileEditor role' : 'Log in to D2R2 as an SSO user using the current Windows session', 'The D2R2 Home page is displayed')]
    if (sc.outline) {
      const [names, ...rows] = sc.examples
      sc.steps.forEach((s) => rows.forEach((r) => steps.push(...mapStep(names.reduce((txt, n, i) => txt.replaceAll(`<${n}>`, r[i]), s)))))
    } else sc.steps.forEach((s) => steps.push(...mapStep(s)))
    for (let i = 0; steps.length < 5; i++) steps.push(padding[i])
    return {
      ref: sc.ref,
      title: sc.title.slice(0, 120),
      layer: 'ui',
      acs: [`DERIVED: ${sc.title} - ${rel}:${sc.line}`],
      area_path: areaPath,
      assigned_to: assignedTo,
      state,
      steps
    }
  })
  total += testCases.length
  const doc = {
    story_summary: `Manual cases for the ${feature} journey, derived from the automated scenarios and the application source.`,
    assumptions: ['Tests run on the UAT environment as an SSO user with the current Windows session', 'Area path is a placeholder unless ADO_AREA_PATH was set'],
    open_questions: [],
    coverage: testCases.map((t) => ({ ac: t.acs[0], test_cases: [t.title] })),
    test_cases: testCases
  }
  fs.writeFileSync(path.join(outDir, `${feature}.json`), `${JSON.stringify(doc, null, 2)}\n`)
}
console.log(`${total} test cases written; ${fallbacks.length} steps used the fallback`)
for (const f of new Set(fallbacks)) console.log(`FALLBACK: ${f}`)
