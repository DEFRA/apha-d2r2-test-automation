@feature:help-using-d2r2 @ui @smoke
Feature: Help using D2R2
  Users can open the help documentation page and confirm the manual list is shown.

  @role:sso @TC-017
  Scenario: Applicant opens the Help Using D2R2 page and sees the manuals
    Given the applicant is on the help using D2R2 page
    Then the help using D2R2 page is shown
    And the help using D2R2 page shows the manuals

  @role:sso @TC-034
  Scenario: Applicant reaches the Help Using D2R2 page by clicking from home and sees the manuals
    Given the applicant is on the home page
    When the applicant chooses Help Using D2R2
    Then the help page is shown
    And the help using D2R2 page shows the manuals

  @role:sso @TC-105
  Scenario: Applicant opens the Help Using D2R2 page directly and confirms the manuals remain visible
    Given the applicant is on the help using D2R2 page
    Then the help using D2R2 page is shown
    And the help using D2R2 page shows the manuals after direct access

  @role:sso @TC-127
  Scenario: Applicant opens the Help Using D2R2 page directly and confirms the page remains stable after navigation
    Given the applicant is on the help using D2R2 page
    Then the help using D2R2 page is shown
    And the help using D2R2 page shows the manuals after direct access
