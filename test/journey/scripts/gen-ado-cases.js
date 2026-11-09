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
    const sc = line.match(/^Scenario: (.+)$/)
    if (sc) {
      const ref = tags.find((t) => /^@TC-\d+$/.test(t))?.slice(1)
      current = { ref, title: sc[1].trim(), steps: [], line: idx + 1 }
      cases.push(current)
      tags = []
      return
    }
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
    const steps = [step('Log in to D2R2 as an SSO user using the current Windows session', 'The D2R2 Home page is displayed')]
    sc.steps.forEach((s) => steps.push(...mapStep(s)))
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
