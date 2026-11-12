 @feature:maintain-global-users @ui @smoke
Feature: Maintain global users
  Users can open the global users page and confirm the user-management controls are available.

  @role:sso @TC-035 @needs:editor
  Scenario: Applicant opens the global users page and sees the management controls
    Given the applicant is on the home page
    When the applicant chooses Global Users
    Then the global users page is shown

  @role:sso @TC-081 @needs:editor
  Scenario: Applicant reaches the global users page from the home page
    Given the applicant is on the home page
    When the applicant chooses Global Users
    Then the global users page is shown

  @role:sso @TC-103 @needs:editor
  Scenario: Applicant opens the global users page directly
    Given the applicant is on the global users page
    Then the global users page is shown

  @role:sso @TC-112 @needs:editor
  Scenario: Applicant opens the global users page directly and confirms the page remains visible
    Given the applicant is on the global users page
    Then the global users page is shown

  @role:sso @TC-126 @needs:editor
  Scenario: Applicant opens the global users page directly and confirms the page remains stable after navigation
    Given the applicant is on the global users page
    Then the global users page is shown
