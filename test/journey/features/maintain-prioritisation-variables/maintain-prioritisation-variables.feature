@wip @feature:maintain-prioritisation-variables @ui @smoke
Feature: Maintain profile prioritisation variables
  Users can open the maintain prioritisation variables page and confirm the prioritisation controls are available.

  @role:sso @TC-020
  Scenario: Applicant opens the maintain profile prioritisation variables page and sees the controls
    Given the applicant is on the maintain profile prioritisation variables page
    Then the maintain profile prioritisation variables page is shown
    And the maintain profile prioritisation variables page shows the controls

  @role:sso @TC-085
  Scenario: Applicant reaches the maintain prioritisation variables page from the home page
    Given the applicant is on the home page
    When the applicant chooses Maintain Prioritisation Variables
    Then the maintain prioritisation variables page is shown

  @role:sso @TC-093
  Scenario: Applicant opens the maintain profile prioritisation variables page directly and confirms the controls remain visible
    Given the applicant is on the maintain profile prioritisation variables page
    Then the maintain profile prioritisation variables page is shown
    And the maintain profile prioritisation variables page shows the controls after direct access

  @role:sso @TC-094
  Scenario: Applicant reaches the maintain prioritisation variables page from the home page and confirms the controls are visible
    Given the applicant is on the home page
    When the applicant chooses Maintain Prioritisation Variables
    Then the maintain profile prioritisation variables page shows the controls after home navigation

  @role:sso @TC-121
  Scenario: Applicant opens the maintain prioritisation variables page directly and confirms the page remains stable after navigation
    Given the applicant is on the maintain profile prioritisation variables page
    Then the maintain profile prioritisation variables page is shown
    And the maintain profile prioritisation variables page shows the controls after direct access
