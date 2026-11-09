@feature:home-navigation @ui @smoke
Feature: Home navigation
  Users can open the D2R2 home page and see the key journeys available from there.

  @role:sso @TC-001
  Scenario: Applicant opens the home page and sees primary links
    Given the applicant is on the home page
    Then the home page shows the popular links

  @role:sso @TC-002
  Scenario: Applicant moves from the home page to the search page
    Given the applicant is on the home page
    When the applicant chooses Search Disease Profiles
    Then the search page is shown

  @role:sso @TC-003
  Scenario: Applicant moves from the home page to the disease ranking report
    Given the applicant is on the home page
    When the applicant chooses Disease Ranking Report
    Then the disease ranking page is shown

  @role:sso @TC-004
  Scenario: Applicant moves from the home page to the general reports page
    Given the applicant is on the home page
    When the applicant chooses General Reports
    Then the general reports page is shown

  @role:sso @TC-005
  Scenario: Applicant moves from the home page to the view species data page
    Given the applicant is on the home page
    When the applicant chooses View Species Data
    Then the view species data page is shown

  @role:sso @TC-008
  Scenario: Applicant moves from the home page to the help page
    Given the applicant is on the home page
    When the applicant chooses Help Using D2R2
    Then the help page is shown

  @role:sso @TC-021
  Scenario: Applicant moves from the home page to the global users page
    Given the applicant is on the home page
    When the applicant chooses Global Users
    Then the global users page is shown

  @role:sso @TC-022
  Scenario: Applicant moves from the home page to the external users page
    Given the applicant is on the home page
    When the applicant chooses External Users
    Then the external users page is shown

  @role:sso @TC-023
  Scenario: Applicant moves from the home page to the maintain reference data page
    Given the applicant is on the home page
    When the applicant chooses Maintain Reference Data
    Then the home navigation maintain reference data page is shown

  @role:sso @TC-024
  Scenario: Applicant moves from the home page to the maintain prioritisation variables page
    Given the applicant is on the home page
    When the applicant chooses Maintain Prioritisation Variables
    Then the maintain prioritisation variables page is shown

  @role:sso @TC-026
  Scenario: Applicant checks the home page does not offer the maintain species data link
    Given the applicant is on the home page
    Then the home page does not show the maintain species data link

  @role:sso @TC-029
  Scenario: Applicant checks the home page does not offer the questions and guidance reports link
    Given the applicant is on the home page
    Then the home page does not show the questions and guidance reports link

  @role:sso @TC-031
  Scenario: Applicant moves from the home page to the maintain cross-cutting issue scores page
    Given the applicant is on the home page
    When the applicant chooses Maintain Cross-Cutting Issue Scores
    Then the maintain cross-cutting issue scores page is shown from home navigation

  @role:sso @TC-009
  Scenario: Applicant moves from the home page to the compare profile versions page
    Given the applicant is on the home page
    When the applicant chooses Compare Profile Versions
    Then the compare profile versions page is shown

  @role:sso @TC-010
  Scenario: Applicant moves from the home page to the create disease ranking filter page
    Given the applicant is on the home page
    When the applicant chooses Create Disease Ranking Filter
    Then the create disease ranking filter page is shown

  @role:sso @TC-145
  Scenario: Applicant opens the create profile page directly and confirms the form remains stable after navigation
    Given the applicant is on the create profile page
    Then the create profile page is shown
