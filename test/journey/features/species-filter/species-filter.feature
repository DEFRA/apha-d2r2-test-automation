@feature:species-filter @ui @smoke
Feature: Filter profiles by affected species
  Search results can be limited to one or several affected species chosen from a tree.

  @role:sso @TC-202
  Scenario Outline: Applicant filters the search by one species
    Given the applicant opens the search page with all version types displayed
    When the applicant shows the affected species filter
    And the applicant ticks the species "<species>"
    Then the species status reads "Currently selected: <species>"
    When the applicant submits the search form
    Then the species status reads "Currently selected: <species>"
    And exactly 1 species is ticked
    And the result count is not greater than that of a blank search

    Examples:
      | species        |
      | Frogs and toads |
      | Newts          |
      | Birds          |

  @role:sso @TC-203
  Scenario: Applicant filters the search by three species and sees the union of their results
    Given the applicant opens the search page with all version types displayed
    When the applicant shows the affected species filter
    And the applicant ticks the species "Frogs and toads"
    And the applicant ticks the species "Birds - native and introduced - captive"
    And the applicant ticks the species "Carp"
    Then the species status reads "Currently selected: Frogs and toads, Birds - native and introduced - captive, Carp"
    When the applicant submits the search form
    Then exactly 3 species are ticked
    And the result count is the union of the three single species results

  @role:sso @TC-204
  Scenario: Applicant picks a species inside a group already ticked and only the species stays ticked
    Given the applicant opens the search page with all version types displayed
    When the applicant shows the affected species filter
    And the applicant ticks the species "Amphibians"
    And the applicant ticks the species "Newts"
    Then the species "Amphibians" is not ticked
    And the species "Newts" is ticked
    And the species status reads "Currently selected: Newts"

  @role:sso @TC-205
  Scenario: Applicant clears the only chosen species and the filter returns to any species
    Given the applicant opens the search page with all version types displayed
    When the applicant shows the affected species filter
    And the applicant ticks the species "Newts"
    And the applicant unticks the species "Newts"
    Then the species status reads "Currently selected: Any species"

  @role:sso @TC-206
  Scenario: Applicant closes and opens all branches of the species tree
    Given the applicant opens the search page with all version types displayed
    When the applicant shows the affected species filter
    And the applicant chooses the tree toggle named "Close all"
    Then the tree toggle is named "Open all"
    When the applicant chooses the tree toggle named "Open all"
    Then the tree toggle is named "Close all"

  @role:sso @TC-207
  Scenario: Applicant combines a species with search text and gets no more than the species alone
    Given the applicant opens the search page with all version types displayed
    When the applicant shows the affected species filter
    And the applicant ticks the species "Birds"
    And the applicant submits the search form
    And the applicant notes the result count
    And the applicant searches for "Virus"
    Then the result count is not greater than the noted count
    And exactly 1 species is ticked

  @role:sso @TC-208
  Scenario: Applicant hides the species filter again
    Given the applicant opens the search page with all version types displayed
    When the applicant shows the affected species filter
    And the applicant hides the affected species filter
    Then the affected species tree is not shown

  @role:sso @TC-209
  Scenario: Applicant chooses a species on the view species data page and opens its data
    Given the applicant is on the view species data page
    When the applicant chooses the species "Amphibians" on the view species data page
    Then the view species data page reports "Selected: Amphibians"
    When the applicant opens the data for the chosen species
    Then the species data page for "Amphibians" is shown

  @role:sso @TC-210
  Scenario: Applicant chooses a second species and only the second is kept
    Given the applicant is on the view species data page
    When the applicant chooses the species "Amphibians" on the view species data page
    And the applicant chooses the species "Newts" on the view species data page
    Then the view species data page reports "Selected: Newts"

  @role:sso @TC-211
  Scenario: Applicant removes the chosen species on the view species data page
    Given the applicant is on the view species data page
    When the applicant chooses the species "Amphibians" on the view species data page
    And the applicant removes the species selection
    Then the view species data page does not report "Amphibians"
