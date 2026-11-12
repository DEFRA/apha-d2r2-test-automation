 @feature:review-timings @ui @smoke
Feature: Review timings
  Users can open the review timings page and confirm the report filters are available.

  @role:sso @TC-028 @needs:editor
  Scenario: Applicant opens the review timings page and sees the filters
    Given the applicant is on the review timings page
    Then the review timings page is shown
    And the review timings page shows the filters

  @role:sso @TC-082 @needs:editor
  Scenario: Applicant reaches the review timings page from the home page
    Given the applicant is on the home page
    When the applicant chooses Review Timings
    Then the review timings page is shown from home navigation

  @role:sso @TC-092 @needs:editor
  Scenario: Applicant reaches the review timings page from the home page and confirms the filters are visible
    Given the applicant is on the home page
    When the applicant chooses Review Timings
    Then the review timings page shows the filters after home navigation

  @role:sso @TC-107 @needs:editor
  Scenario: Applicant opens the review timings page directly and confirms the filters remain visible
    Given the applicant is on the review timings page
    Then the review timings page is shown
    And the review timings page shows the filters

  @role:sso @TC-128 @needs:editor
  Scenario: Applicant opens the review timings page directly and confirms the page remains stable after navigation
    Given the applicant is on the review timings page
    Then the review timings page is shown
    And the review timings page shows the filters
