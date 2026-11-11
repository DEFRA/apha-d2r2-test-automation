@wip @feature:maintain-cross-cutting-issue-scores @ui @smoke
Feature: Maintain cross-cutting issue scores
  Users can open the maintain cross-cutting issue scores page and confirm the controls are available.

  @role:sso @TC-025
  Scenario: Applicant opens the maintain cross-cutting issue scores page and sees the controls
    Given the applicant is on the maintain cross-cutting issue scores page
    Then the maintain cross-cutting issue scores page is shown
    And the maintain cross-cutting issue scores page shows the controls

  @role:sso @TC-086
  Scenario: Applicant reaches the maintain cross-cutting issue scores page from the home page
    Given the applicant is on the home page
    When the applicant chooses Maintain Cross-Cutting Issue Scores
    Then the maintain cross-cutting issue scores page is shown from home navigation

  @role:sso @TC-095
  Scenario: Applicant opens the maintain cross-cutting issue scores page directly and confirms the controls remain visible
    Given the applicant is on the maintain cross-cutting issue scores page
    Then the maintain cross-cutting issue scores page is shown
    And the maintain cross-cutting issue scores page shows the controls after direct access

  @role:sso @TC-096
  Scenario: Applicant reaches the maintain cross-cutting issue scores page from the home page and confirms the controls are visible
    Given the applicant is on the home page
    When the applicant chooses Maintain Cross-Cutting Issue Scores
    Then the maintain cross-cutting issue scores page shows the controls after home navigation

  @role:sso @TC-122
  Scenario: Applicant opens the maintain cross-cutting issue scores page directly and confirms the page remains stable after navigation
    Given the applicant is on the maintain cross-cutting issue scores page
    Then the maintain cross-cutting issue scores page is shown
    And the maintain cross-cutting issue scores page shows the controls after direct access
