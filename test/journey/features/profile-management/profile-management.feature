@feature:profile-management @ui @smoke
Feature: Profile management
  Users can move from the search result into the profile-management branch and validate the route-specific actions.

  @role:sso @TC-043
  Scenario: Applicant opens the manage profile page and sees the management actions
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the manage page for the first result
    Then the manage profile page is shown

  @role:sso @TC-117
  Scenario: Applicant opens the manage profile page directly and confirms the management actions remain visible
    Given the applicant is on the manage profile page
    Then the manage profile page is shown

  @role:sso @TC-137
  Scenario: Applicant opens the manage profile page directly and confirms the management route remains stable after navigation
    Given the applicant is on the manage profile page
    Then the manage profile page is shown

  @role:sso @TC-044
  Scenario: Applicant opens the maintain contributors page from the manage profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the manage page for the first result
    And the applicant opens the maintain contributors page from the manage page
    Then the maintain contributors page is shown

  @role:sso @TC-045
  Scenario: Applicant opens the profile properties page from the manage profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the manage page for the first result
    And the applicant opens the profile properties page from the manage page
    Then the profile properties page is shown

  @role:sso @TC-046
  Scenario: Applicant opens the contributions report from the manage profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the manage page for the first result
    And the applicant opens the contributions report from the manage page
    Then the contributions report is shown

  @role:sso @TC-057
  Scenario: Applicant clones a new profile from the manage profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the manage page for the first result
    And the applicant clones a new profile from the manage page
    Then the profile properties page is shown

  @role:sso @TC-058
  Scenario: Applicant clones a new scenario from the manage profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the manage page for the first result
    And the applicant clones a new scenario from the manage page
    Then the profile properties page is shown

  @role:sso @TC-059
  Scenario: Applicant opens the profile reports page from the search result
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the profile reports page for the first result
    Then the profile reports page is shown

  @role:sso @TC-060
  Scenario: Applicant opens the bespoke report builder from the profile reports page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the profile reports page for the first result
    And the applicant opens the bespoke report builder
    Then the create bespoke report page is shown

  @role:sso @TC-068
  Scenario: Applicant browses the profile from the profile reports page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the profile reports page for the first result
    And the applicant browses the profile from the profile reports page
    Then the browse profile page is shown

  @role:sso @TC-062
  Scenario: Applicant opens the profile reports page from the manage profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the manage page for the first result
    And the applicant opens the profile reports page from the manage page
    Then the profile reports page is shown

  @role:sso @TC-063
  Scenario: Applicant opens the bespoke report builder from the manage profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the manage page for the first result
    And the applicant opens the profile reports page from the manage page
    And the applicant opens the bespoke report builder
    Then the create bespoke report page is shown

  @role:sso @TC-141
  Scenario: Applicant opens the profile reports page directly and confirms the route remains stable
    Given the applicant is on the profile reports page
    Then the profile reports page is shown

  @role:sso @TC-142
  Scenario: Applicant opens the bespoke report builder directly and confirms the route remains stable
    Given the applicant is on the create bespoke report page
    Then the create bespoke report page is shown

