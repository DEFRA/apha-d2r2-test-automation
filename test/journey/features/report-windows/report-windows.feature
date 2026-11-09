@feature:report-windows @ui @smoke
Feature: Report windows
  Report buttons and links open the generated report in a new window.

  @role:sso @TC-153
  Scenario: Applicant opens the terrestrial disease ranking report
    Given the applicant is on the disease ranking page
    When the applicant opens the "Terrestrial" report from the "ranking" report selector
    Then the "ShowDiseaseRankingReport" report window is opened

  @role:sso @TC-154
  Scenario: Applicant opens the aquatic disease ranking report
    Given the applicant is on the disease ranking page
    When the applicant opens the "Aquatic" report from the "ranking" report selector
    Then the "ShowDiseaseRankingReport" report window is opened

  @role:sso @TC-155
  Scenario: Applicant opens the terrestrial disease ranking RFI report
    Given the applicant is on the disease ranking page
    When the applicant opens the "Terrestrial" report from the "RFI" report selector
    Then the "ShowDiseaseRankingRFIReport" report window is opened

  @role:sso @TC-156
  Scenario: Applicant opens the aquatic disease ranking RFI report
    Given the applicant is on the disease ranking page
    When the applicant opens the "Aquatic" report from the "RFI" report selector
    Then the "ShowDiseaseRankingRFIReport" report window is opened

  @role:sso @TC-157
  Scenario: Applicant generates the full profile guidance report
    Given the applicant is on the questions and guidance reports page
    When the applicant generates the "Full profile guidance report" guidance report
    Then the "ShowProfileGuidanceReport" report window is opened

  @role:sso @TC-158
  Scenario: Applicant generates the summary profile guidance report
    Given the applicant is on the questions and guidance reports page
    When the applicant generates the "Summary profile guidance report" guidance report
    Then the "ShowProfileGuidanceReport" report window is opened

  @role:sso @TC-159
  Scenario: Applicant generates the SPR guidance report
    Given the applicant is on the questions and guidance reports page
    When the applicant generates the "SPR guidance report" guidance report
    Then the "ShowProfileGuidanceReport" report window is opened

  @role:sso @TC-160
  Scenario: Applicant generates the Q and A sheet guidance report
    Given the applicant is on the questions and guidance reports page
    When the applicant generates the "Q&A sheet guidance report" guidance report
    Then the "ShowProfileGuidanceReport" report window is opened

  @role:sso @TC-161
  Scenario: Applicant opens a static report from the general reports page
    Given the applicant is on the general reports page
    When the applicant opens the first static report
    Then the "ShowStaticReport" report window is opened

  @role:sso @TC-162
  Scenario: Applicant prints the category variables for a prioritisation category
    Given the applicant is on the maintain profile prioritisation variables page
    When the applicant prints the variables for the first prioritisation category
    Then the "PrintPrioritisationVariables" report window is opened

  @role:sso @TC-163
  Scenario: Applicant opens a published profile report from the profile reports page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the profile reports page for the first result
    And the applicant opens the first profile report
    Then the "ShowPublishedProfile" report window is opened
