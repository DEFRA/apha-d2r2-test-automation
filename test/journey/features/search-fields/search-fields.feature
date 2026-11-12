@feature:search-fields @ui @smoke
Feature: Search disease profiles input fields
  Every field on the Search Disease Profiles form can be used, alone and combined, and the results reflect it.

  @role:sso @TC-180
  Scenario: Applicant searches with every field left at its default
    Given the applicant opens the search page with all version types displayed
    When the applicant submits the search form
    Then profiles are listed with a result count

  @role:sso @TC-181
  Scenario Outline: Applicant searches for part or all of a profile title
    Given the applicant opens the search page with all version types displayed
    When the applicant searches for "<text>"
    Then every listed profile title contains "<expected>" ignoring case

    Examples:
      | text                   | expected               |
      | African Horse Sickness | African Horse Sickness |
      | african horse sickness | African Horse Sickness |
      | AFRICAN HORSE SICKNESS | African Horse Sickness |
      | Horse                  | Horse                  |
      | Sickness               | Sickness               |
      | Afric                  | Afric                  |
      | ickness                | ickness                |

  @role:sso @TC-182
  Scenario Outline: Applicant searches for text that matches no profile
    Given the applicant opens the search page with all version types displayed
    When the applicant searches for "<text>"
    Then no disease profiles match the search

    Examples:
      | text               |
      | zzzzqqqq           |
      | 123                |
      | 2024               |
      | !@#$%              |
      | O'Brien            |
      | %                  |
      | *                  |
      | <b>x</b>           |
      | semi;colon         |
      | African Sickness   |

  @role:sso @TC-183
  Scenario: Applicant searches with whitespace only and sees the same as a blank search
    Given the applicant opens the search page with all version types displayed
    When the applicant searches for "   "
    Then the result count equals that of a blank search

  @role:sso @TC-184
  Scenario: Applicant cannot type more than 255 characters in the search box
    Given the applicant opens the search page with all version types displayed
    When the applicant types 300 characters in the search box
    Then the search box holds 255 characters

  @role:sso @TC-185
  Scenario: Applicant searches with the maximum 255 characters
    Given the applicant opens the search page with all version types displayed
    When the applicant searches for 255 repeated characters
    Then no disease profiles match the search

  @role:sso @TC-186
  Scenario Outline: Applicant searches for text containing a script or SQL pattern and the request is blocked
    Given the applicant opens the search page with all version types displayed
    When the applicant searches for "<text>"
    Then the request is refused with a forbidden page

    Examples:
      | text                      |
      | <script>alert(1)</script> |
      | ' OR 1=1 --               |

  @role:sso @TC-187
  Scenario Outline: Applicant chooses how the words are matched
    Given the applicant opens the search page with all version types displayed
    And the applicant shows the more filters
    When the applicant searches for "<text>" using the "<mode>" option
    Then <outcome>

    Examples:
      | text             | mode                   | outcome                                    |
      | African Sickness | this exact word or phrase | no disease profiles match the search       |
      | African Sickness | all these words        | profiles are listed with a result count    |
      | Sickness African | all these words        | profiles are listed with a result count    |
      | horse sickness   | all these words        | profiles are listed with a result count    |

  @role:sso @TC-188
  Scenario Outline: Applicant chooses where the text must appear
    Given the applicant opens the search page with all version types displayed
    And the applicant shows the more filters
    When the applicant searches for "Horse" appearing in "<area>"
    Then the "Appears in" list shows "<area>" selected

    Examples:
      | area                |
      | Profile titles      |
      | All                 |
      | Profile answers     |
      | References          |
      | Further information |

  @role:sso @TC-189
  Scenario Outline: Applicant filters by the version status
    Given the applicant opens the search page with all version types displayed
    When the applicant displays only "<status>" versions
    Then the status checkboxes show only "<status>" ticked

    Examples:
      | status                |
      | published             |
      | draft                 |
      | scenarios             |

  @role:sso @TC-190
  Scenario: Applicant restricts results to published versions and gets fewer or equal results
    Given the applicant opens the search page with all version types displayed
    When the applicant displays all version types
    And the applicant notes the result count
    And the applicant displays only "published" versions
    Then the result count is not greater than the noted count

  @role:sso @TC-191
  Scenario: Applicant clears every version status
    Given the applicant opens the search page with all version types displayed
    When the applicant displays no version types
    Then no disease profiles match the search

  @role:sso @TC-192
  Scenario Outline: Applicant sorts the results
    Given the applicant opens the search page with all version types displayed
    When the applicant sorts the results by "<sort>"
    Then the "Sort by:" list shows "<sort>" selected
    And profiles are listed with a result count

    Examples:
      | sort                  |
      | A-Z                   |
      | Z-A                   |
      | Most recently updated |
      | Least recently updated|

  @role:sso @TC-193
  Scenario: Applicant sorts A-Z and Z-A and the order reverses
    Given the applicant opens the search page with all version types displayed
    When the applicant sorts the results by "A-Z"
    Then the listed titles are in ascending order
    When the applicant sorts the results by "Z-A"
    Then the listed titles are in descending order

  @role:sso @TC-194
  Scenario Outline: Applicant changes the number of profiles per page
    Given the applicant opens the search page with all version types displayed
    When the applicant shows "<size>" profiles per page
    Then at most "<size>" profiles are listed

    Examples:
      | size |
      | 10   |
      | 15   |
      | 20   |
      | 30   |
      | All  |

  @role:sso @TC-195
  Scenario: Applicant moves to the next page of results
    Given the applicant opens the search page with all version types displayed
    When the applicant notes the first listed profile
    And the applicant opens the next page of results
    Then the first listed profile is different from the noted one

  @role:sso @TC-196
  Scenario Outline: Applicant lists profiles beginning with a letter
    Given the applicant opens the search page with all version types displayed
    When the applicant chooses the letter "<letter>"
    Then every listed profile title begins with "<letter>"

    Examples:
      | letter |
      | A      |
      | B      |
      | C      |
      | S      |

  @role:sso @TC-197
  Scenario: Applicant chooses a letter with no profiles
    Given the applicant opens the search page with all version types displayed
    When the applicant chooses the letter "X"
    Then the result is either no profiles or only titles beginning with "X"

  @role:sso @TC-198
  Scenario: Applicant returns to all letters
    Given the applicant opens the search page with all version types displayed
    When the applicant chooses the letter "B"
    And the applicant chooses the letter "All"
    Then the result count equals that of a blank search

  @role:sso @TC-199
  Scenario: Applicant combines a letter with search text
    Given the applicant opens the search page with all version types displayed
    When the applicant chooses the letter "A"
    And the applicant searches for "Horse"
    Then every listed profile title begins with "A"
    And every listed profile title contains "Horse" ignoring case

  @role:sso @TC-200
  Scenario: Applicant filters by affected species
    Given the applicant opens the search page with all version types displayed
    When the applicant shows the affected species filter
    And the applicant selects the first affected species
    And the applicant submits the search form
    Then the selected species is reported as currently selected
    And the result count is not greater than that of a blank search

  @role:sso @TC-201
  Scenario: Applicant combines text, status, mode, sort and page size
    Given the applicant opens the search page with all version types displayed
    When the applicant searches with text "a", only "published" versions, sorted by "Z-A", "15" per page
    Then at most "15" profiles are listed
    And the listed titles are in descending order
