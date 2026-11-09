@feature:questions-and-guidance-reports @ui @smoke
Feature: Questions and guidance reports
  Users can open the questions and guidance reports page and confirm the report-generation controls are available.

  @role:sso @TC-016
  Scenario: Applicant opens the questions and guidance reports page and sees the report buttons
    Given the applicant is on the home page
    When the applicant opens the questions and guidance reports page directly
    Then the questions and guidance reports page is shown
    And the questions and guidance reports page shows the report buttons
  @role:sso @TC-083
  Scenario: Applicant reaches the questions and guidance reports page from the home page
    Given the applicant is on the home page
    When the applicant chooses Questions and Guidance Reports
    Then the questions and guidance reports page is shown from home navigation

  @role:sso @TC-091
  Scenario: Applicant opens the questions and guidance reports page directly and confirms the report buttons remain visible
    Given the applicant is on the questions and guidance reports page
    Then the questions and guidance reports page is shown
    And the questions and guidance reports page shows the report buttons after direct access

  @role:sso @TC-119
  Scenario: Applicant opens the questions and guidance reports page directly and confirms the page remains stable after navigation
    Given the applicant is on the questions and guidance reports page
    Then the questions and guidance reports page is shown
    And the questions and guidance reports page shows the report buttons after direct access
