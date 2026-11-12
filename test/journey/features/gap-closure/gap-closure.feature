@feature:gap-closure @ui @smoke
Feature: Remaining search, profile and layout behaviour
  Letters, the last page of results, recency sorting, profile reference lists, and the phone-sized menu.

  @role:sso @TC-243
  Scenario Outline: Applicant lists profiles beginning with each remaining letter
    Given the applicant opens the search page with all version types displayed
    When the applicant chooses the letter "<letter>"
    Then the result is either no profiles or only titles beginning with "<letter>"

    Examples:
      | letter |
      | D      |
      | E      |
      | F      |
      | G      |
      | H      |
      | I      |
      | J      |
      | K      |
      | L      |
      | M      |
      | N      |
      | O      |
      | P      |
      | Q      |
      | R      |
      | T      |
      | U      |
      | V      |
      | W      |
      | Y      |
      | Z      |

  @role:sso @TC-244
  Scenario: Applicant finds the letter counts add up to every profile
    Given the applicant opens the search page with all version types displayed
    Then the profile counts for the letters A to Z add up to the count for all letters

  @role:sso @TC-245
  Scenario: Applicant reaches the last page of results
    Given the applicant opens the search page with all version types displayed
    When the applicant chooses the last page of the results
    Then the last page lists only the remaining profiles
    And there is no Next page link

  @role:sso @TC-246
  Scenario: Applicant sorts by recency and the newest comes before the oldest
    Given the applicant opens the search page with all version types displayed
    When the applicant sorts the results by "Least recently updated"
    And the applicant notes the date of the first profile
    And the applicant sorts the results by "Most recently updated"
    Then the date of the first profile is not earlier than the noted date

  @role:sso @TC-247
  Scenario: Applicant reads the reference groups on the References tab
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens Browse profile for the first profile
    And the applicant chooses the tab "References"
    Then the page lists the reference groups "Scientific paper references" and "Legislative references"

  @role:sso @TC-248 @known-defect
  Scenario: Applicant opens the Further information tab without an error
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens Browse profile for the first profile
    And the applicant chooses the tab "Further information"
    Then no error message is shown on the page

  @role:sso @TC-249
  Scenario: Applicant uses the header menu on a phone-sized screen
    Given the applicant uses a phone-sized screen
    And the applicant is on the "home" page
    Then the header menu is closed
    When the applicant opens the header menu
    Then the header menu offers "Search disease profiles", "General reports", "Disease ranking report" and "View species data"
    When the applicant presses Escape
    Then the header menu is closed
