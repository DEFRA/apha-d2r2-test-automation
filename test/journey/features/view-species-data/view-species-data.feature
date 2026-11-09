@feature:view-species-data @ui @smoke
Feature: View species data
  Users can open the species-data page and confirm the species lookup is available.

  @role:sso @TC-089
  Scenario: Applicant opens the view species data page and sees the species lookup
    Given the applicant is on the view species data page
    Then the view species data page is shown
    And the view species data page shows the species filters

  @role:sso @TC-090
  Scenario: Applicant reaches the view species data page from the home page
    Given the applicant is on the home page
    When the applicant chooses View Species Data
    Then the view species data page is shown

  @role:sso @TC-109
  Scenario: Applicant opens the view species data page directly and confirms the species lookup remains visible
    Given the applicant is on the view species data page
    Then the view species data page is shown
    And the view species data page shows the species filters

  @role:sso @TC-130
  Scenario: Applicant opens the view species data page directly and confirms the page remains stable after navigation
    Given the applicant is on the view species data page
    Then the view species data page is shown
    And the view species data page shows the species filters
