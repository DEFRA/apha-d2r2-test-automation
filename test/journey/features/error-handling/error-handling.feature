 @feature:error-handling @ui @smoke
Feature: Error and session handling
  Users who reach a time-out or an application error see the dedicated handling page.

  @role:sso @TC-050
  Scenario: Applicant's signed-in session reports the time it has left
    Given the applicant is on the home page
    When the applicant asks the application for the session status
    Then the session is reported as active with time remaining

  @role:sso @TC-051
  Scenario: Applicant sees the application error page
    Given the applicant opens the application error page
    Then the application error page is shown

  @role:sso @TC-099
  Scenario: Applicant's page carries the session warning and expiry dialogs without showing them
    Given the applicant is on the home page
    Then the session warning dialog is not shown
    And the session expired dialog is not shown

  @role:sso @TC-100
  Scenario: Applicant opens the application error page and confirms the error state is visible
    Given the applicant opens the application error page
    Then the application error page is shown
    And the application error page remains in the dedicated error state

  @role:sso @TC-133
  Scenario: Applicant's session cannot be extended without an antiforgery token
    Given the applicant is on the home page
    When the applicant asks to extend the session without a token
    Then the application rejects the request as invalid

  @role:sso @TC-134
  Scenario: Applicant opens the application error page directly and confirms the error page remains stable after navigation
    Given the applicant opens the application error page
    Then the application error page is shown
    And the application error page remains in the dedicated error state
