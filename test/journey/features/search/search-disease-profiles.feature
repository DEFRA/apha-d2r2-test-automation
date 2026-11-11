@feature:search-disease-profiles @ui @smoke
Feature: Search disease profiles
  Users can open the search page and find matching disease profiles by title.

  @role:sso @TC-006
  Scenario: Applicant opens the search page and sees the disease profile filters
    Given the applicant is on the search page
    Then the search page shows the disease profile filters

  @role:sso @TC-007
  Scenario: Applicant searches for a disease profile by title
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"

  @role:sso @TC-030
  Scenario: Applicant reaches the search page by clicking from home and searches for a disease profile
    Given the applicant is on the home page
    When the applicant chooses Search Disease Profiles
    Then the search page is shown
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"

  @role:sso @TC-116
  Scenario: Applicant opens the search page directly and confirms the disease profile filters remain visible
    Given the applicant is on the search page
    Then the search page shows the disease profile filters

  @role:sso @TC-129
  Scenario: Applicant opens the search page directly and confirms the page remains stable after navigation
    Given the applicant is on the search page
    Then the search page shows the disease profile filters

  @wip @role:sso @TC-038
  Scenario: Applicant searches for a disease profile and opens the manage page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the manage page for the first result
    Then the manage profile page is shown

  @wip @role:sso @TC-039
  Scenario: Applicant opens the maintain contributors page from a profile manage page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the manage page for the first result
    Then the manage profile page is shown
    When the applicant opens the maintain contributors page from the manage page
    Then the maintain contributors page is shown

  @wip @role:sso @TC-040
  Scenario: Applicant opens the profile properties page from a profile manage page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the manage page for the first result
    Then the manage profile page is shown
    When the applicant opens the profile properties page from the manage page
    Then the profile properties page is shown

  @wip @role:sso @TC-041
  Scenario: Applicant opens the contributions report from a profile manage page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the manage page for the first result
    Then the manage profile page is shown
    When the applicant opens the contributions report from the manage page
    Then the contributions report is shown

  @wip @role:sso @TC-042
  Scenario: Applicant opens the edit profile title page from the search results
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the edit profile title page from the search results
    Then the edit profile title page is shown

  @wip @role:sso @TC-073
  Scenario: Applicant tries to save a profile title without entering any text
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the edit profile title page from the search results
    And the applicant submits the empty profile title form
    Then the title validation message is shown

  @role:sso @TC-067
  Scenario: Applicant opens the browse profile page from the search results
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the browse profile page from the search results
    Then the browse profile page is shown

  @wip @role:sso @TC-069
  Scenario: Applicant opens the review comments page from the browse profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the browse profile page from the search results
    And the applicant opens the review comments page from the browse profile page
    Then the review comments page is shown

  @wip @role:sso @TC-070
  Scenario: Applicant tries to add a review comment without the required details
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the browse profile page from the search results
    And the applicant opens the review comments page from the browse profile page
    And the applicant clicks add review comment
    Then the add review comment form is shown
    When the applicant saves an empty review comment
    Then the review comment validation message is shown

  @wip @role:sso @TC-071
  Scenario: Applicant adds a valid review comment to a profile section
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the browse profile page from the search results
    And the applicant opens the review comments page from the browse profile page
    And the applicant adds a review comment with subject "TC-071 subject", reference "TC-071 reference", and comment "TC-071 test comment"
    Then the review comment is saved in the review comments list

  @wip @role:sso @TC-072
  Scenario: Applicant tries to add a contributor without the required details
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant opens the manage page for the first result
    And the applicant opens the maintain contributors page from the manage page
    And the applicant clicks add a contributor
    Then the add contributor form is shown
    When the applicant saves the contributor without required details
    Then the contributor validation messages are shown

  @wip @role:sso @TC-065
  Scenario: Applicant clones a profile from the search results
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant clones a new profile from the search results
    Then the profile properties page is shown

  @wip @role:sso @TC-066
  Scenario: Applicant clones a scenario from the search results
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    Then the search results show "African Horse Sickness (AHS)"
    When the applicant clones a new scenario from the search results
    Then the profile properties page is shown
