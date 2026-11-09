@feature:field-rules @ui @smoke
Feature: Field rules
  Required, format and length rules on forms, checked without saving any data.

  @role:sso @TC-170
  Scenario: Applicant tries to save a new profile without a title
    Given the applicant is on the create profile page
    When the applicant saves the new profile without a title
    Then the field rule message "You must enter a title" is shown

  @role:sso @TC-171
  Scenario: Applicant looks up a global user without a username
    Given the applicant is on the global users page
    When the applicant looks up the global user ""
    Then the field rule message "Please enter a username" is shown

  @role:sso @TC-172
  Scenario: Applicant looks up a global user with a username in the wrong format
    Given the applicant is on the global users page
    When the applicant looks up the global user "not-a-domain-user"
    Then the field rule message "Please enter a username in the following format: Domain\UserId" is shown

  @role:sso @TC-173
  Scenario: Applicant cannot enter more than 50 characters in the global user username
    Given the applicant is on the global users page
    When the applicant enters 51 characters in the global user username
    Then the global user username holds 50 characters

