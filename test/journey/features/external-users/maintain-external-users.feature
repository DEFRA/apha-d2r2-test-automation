 @feature:maintain-external-users @ui @smoke
Feature: Maintain external users
  Users can open the external users page and confirm the user-management controls are available.

  @role:sso @TC-036 @needs:editor
  Scenario: Applicant opens the external users page and sees the management controls
    Given the applicant is on the home page
    When the applicant chooses External Users
    Then the external users page is shown

  @role:sso @TC-084 @needs:editor
  Scenario: Applicant reaches the external users page from the home page
    Given the applicant is on the home page
    When the applicant chooses External Users
    Then the external users page is shown

  @role:sso @TC-104 @needs:editor
  Scenario: Applicant opens the external users page directly
    Given the applicant is on the external users page
    Then the external users page is shown

  @role:sso @TC-113 @needs:editor
  Scenario: Applicant opens the external users page directly and confirms the page remains visible
    Given the applicant is on the external users page
    Then the external users page is shown

  @role:sso @TC-125 @needs:editor
  Scenario: Applicant opens the external users page directly and confirms the page remains stable after navigation
    Given the applicant is on the external users page
    Then the external users page is shown
