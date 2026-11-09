@feature:compare-profile-versions @ui @smoke
Feature: Compare profile versions
  Users can open the compare profile versions page and confirm the comparison controls are available.

  @role:sso @TC-013
  Scenario: Applicant opens the compare profile versions page and sees the comparison controls
    Given the applicant is on the compare profile versions page
    Then the compare profile versions page shows the comparison controls

  @role:sso @TC-097
  Scenario: Applicant reaches the compare profile versions page from the home page
    Given the applicant is on the home page
    When the applicant chooses Compare Profile Versions
    Then the compare profile versions page is shown

  @role:sso @TC-098
  Scenario: Applicant opens the compare profile versions page directly and confirms the comparison controls remain visible
    Given the applicant is on the compare profile versions page
    Then the compare profile versions page shows the comparison controls after direct access

  @role:sso @TC-120
  Scenario: Applicant opens the compare profile versions page directly and confirms the page remains stable after navigation
    Given the applicant is on the compare profile versions page
    Then the compare profile versions page shows the comparison controls after direct access
