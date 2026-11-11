@wip @feature:maintain-species-data @ui @smoke
Feature: Maintain species data
  Users can open the maintain species data page and confirm the maintenance actions are available.

  @role:sso @TC-015
  Scenario: Applicant opens the maintain species data page and sees the maintenance actions
    Given the applicant is on the maintain species data page
    Then the maintain species data page shows the maintenance actions

  @role:sso @TC-054
  Scenario: Applicant opens the species data audit trail from the maintain species data page
    Given the applicant is on the maintain species data page
    When the applicant clicks View Audit Trail
    Then the species data audit trail page is shown

  @role:sso @TC-061
  Scenario: Applicant opens the edit species page from the species maintenance screen
    Given the applicant is on the maintain species data page
    When the applicant opens the edit species page
    Then the edit species data page is shown

  @role:sso @TC-111
  Scenario: Applicant opens the maintain species data page directly and confirms the maintenance actions remain visible
    Given the applicant is on the maintain species data page
    Then the maintain species data page shows the maintenance actions

  @role:sso @TC-124
  Scenario: Applicant opens the maintain species data page directly and confirms the page remains stable after navigation
    Given the applicant is on the maintain species data page
    Then the maintain species data page shows the maintenance actions
