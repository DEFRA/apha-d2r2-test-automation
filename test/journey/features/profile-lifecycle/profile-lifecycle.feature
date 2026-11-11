@wip @feature:profile-lifecycle @ui @smoke
Feature: Profile lifecycle
  Users can continue from a live search result into the profile-management screens for title, property and contributor maintenance.

  @role:sso @TC-047
  Scenario: Applicant reaches the profile properties screen from a live search result
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the manage page for the first result
    Then the manage profile page is shown
    When the applicant opens the profile properties page from the manage page
    Then the profile properties page is shown

  @role:sso @TC-048
  Scenario: Applicant reaches the edit title screen from a live search result
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the edit profile title page from the search results
    Then the edit profile title page is shown

  @role:sso @TC-049
  Scenario: Applicant continues from a live search result to the contributors maintenance screen
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the manage page for the first result
    Then the manage profile page is shown
    When the applicant opens the maintain contributors page from the manage page
    Then the maintain contributors page is shown

  @role:sso @TC-101
  Scenario: Applicant reaches the profile properties screen from the search results and confirms the route
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the manage page for the first result
    Then the manage profile page is shown
    When the applicant opens the profile properties page from the manage page
    Then the profile properties page is shown

  @role:sso @TC-118
  Scenario: Applicant opens the manage profile page directly and confirms the lifecycle route remains available
    Given the applicant is on the manage profile page
    Then the manage profile page is shown

  @role:sso @TC-138
  Scenario: Applicant opens the manage profile page directly and confirms the lifecycle route remains stable after navigation
    Given the applicant is on the manage profile page
    Then the manage profile page is shown

  @role:sso @TC-102
  Scenario: Applicant reaches the edit title screen from the manage page and confirms the title form loads
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the manage page for the first result
    Then the manage profile page is shown
    When the applicant opens the edit profile title page from the search results
    Then the edit profile title page is shown

  @role:sso @TC-139
  Scenario: Applicant opens the profile properties page directly and confirms the route remains stable
    Given the applicant is on the profile properties page
    Then the profile properties page is shown

  @role:sso @TC-140
  Scenario: Applicant opens the edit profile title page directly and confirms the route remains stable
    Given the applicant is on the edit profile title page
    Then the edit profile title page is shown
