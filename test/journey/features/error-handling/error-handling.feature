@feature:error-handling @ui @smoke
Feature: Error and session handling
  Users who reach a time-out or an application error see the dedicated handling page.

  @role:sso @TC-050
  Scenario: Applicant sees the session timeout page
    Given the applicant opens the session timeout page
    Then the session timeout page is shown

  @role:sso @TC-051
  Scenario: Applicant sees the application error page
    Given the applicant opens the application error page
    Then the application error page is shown

  @role:sso @TC-099
  Scenario: Applicant opens the session timeout page and confirms the dedicated error state is visible
    Given the applicant opens the session timeout page
    Then the session timeout page is shown
    And the session timeout page remains in the dedicated error state

  @role:sso @TC-100
  Scenario: Applicant opens the application error page and confirms the error state is visible
    Given the applicant opens the application error page
    Then the application error page is shown
    And the application error page remains in the dedicated error state

  @role:sso @TC-133
  Scenario: Applicant opens the session timeout page directly and confirms the error page remains stable after navigation
    Given the applicant opens the session timeout page
    Then the session timeout page is shown
    And the session timeout page remains in the dedicated error state

  @role:sso @TC-134
  Scenario: Applicant opens the application error page directly and confirms the error page remains stable after navigation
    Given the applicant opens the application error page
    Then the application error page is shown
    And the application error page remains in the dedicated error state
