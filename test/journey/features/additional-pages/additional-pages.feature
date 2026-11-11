@wip @feature:additional-pages @ui @smoke
Feature: Review email, question help and profile version comparison
  Test-only and pop-up pages, and the compare profile versions selection rules.

  @role:sso @TC-164
  Scenario: Applicant opens the review email page and sees the test-only notice without sending emails
    Given the applicant is on the review email page
    Then the review email page shows the test-only notice

  @role:sso @TC-165
  Scenario: Applicant opens the question help window from the browse profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the browse profile page for an editable draft version
    And the applicant opens the first question help
    Then the question help window is opened

  @role:sso @TC-166
  Scenario: Applicant opens the question help page without a question and sees the application error
    When the applicant opens the question help page without a question
    Then the application error page is shown

  @role:sso @TC-167
  Scenario: Applicant compares versions without selecting any
    Given the applicant is on the compare profile versions page
    When the applicant compares the selected versions
    Then the compare versions selection message is shown

  @role:sso @TC-168
  Scenario: Applicant compares versions after selecting only one
    Given the applicant is on the compare profile versions page
    When the applicant selects 1 profile versions to compare
    And the applicant compares the selected versions
    Then the compare versions selection message is shown

  @role:sso @TC-169
  Scenario: Applicant compares two profile versions
    Given the applicant is on the compare profile versions page
    When the applicant selects 2 profile versions to compare
    And the applicant compares the selected versions
    Then the "ShowProfileVersionComparisonReport" report window is opened
