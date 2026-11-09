@feature:general-reports @ui @smoke
Feature: General reports
  Users can open the general reports page and confirm the report list is available.

  @role:sso @TC-087
  Scenario: Applicant opens the general reports page and sees the report list
    Given the applicant is on the general reports page
    Then the general reports page is shown
    And the general reports page shows the report links

  @role:sso @TC-088
  Scenario: Applicant reaches the general reports page from the home page
    Given the applicant is on the home page
    When the applicant chooses General Reports
    Then the general reports page is shown

  @role:sso @TC-108
  Scenario: Applicant opens the general reports page directly and confirms the report list remains visible
    Given the applicant is on the general reports page
    Then the general reports page is shown
    And the general reports page shows the report links

  @role:sso @TC-143
  Scenario: Applicant opens the general reports page directly and confirms the page remains stable after navigation
    Given the applicant is on the general reports page
    Then the general reports page is shown
    And the general reports page shows the report links
