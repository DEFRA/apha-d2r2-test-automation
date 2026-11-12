@feature:profile-browse @ui @smoke
Feature: Find, browse and report on a disease profile
  A signed-in user can reach a profile from the search results, read its sections and download its reports.

  @role:sso @TC-225
  Scenario: Applicant sees the current version and the actions on a search result
    Given the applicant opens the search results for "African Horse Sickness"
    Then the first profile shows its current published version, its status and the View reports and Browse profile links

  @role:sso @TC-226
  Scenario: Applicant shows and hides the previous versions of a profile
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant shows the previous versions of the first profile
    Then the previous versions are listed with their View reports and Browse profile links
    When the applicant hides the previous versions of the first profile
    Then the previous versions are not listed

  @role:sso @TC-227
  Scenario: Applicant opens the reports for a profile from the search results
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens View reports for the first profile
    Then the profile reports page is shown for "African Horse Sickness (AHS)"

  @role:sso @TC-228
  Scenario: Applicant browses a profile from the search results
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens Browse profile for the first profile
    Then the browse page is shown for "African Horse Sickness (AHS)"

  @role:sso @TC-229
  Scenario: Applicant moves between pages of search results
    Given the applicant opens the search results for ""
    When the applicant chooses Next page of the results
    Then page "2" of the results is current
    When the applicant chooses Previous page of the results
    Then page "1" of the results is current

  @role:sso @TC-230
  Scenario: Applicant sees the three reports and the access note on the profile reports page
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens View reports for the first profile
    Then the profile reports page lists "Summary prioritisation report", "Summary profile" and "Question and answer sheet"
    And the profile reports page explains how to request access with the email link "D2R2@defra.gov.uk"

  @role:sso @TC-231
  Scenario Outline: Applicant downloads a profile report
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens View reports for the first profile
    And the applicant downloads the "<report>" report
    Then the downloaded file is named "<file>"

    Examples:
      | report                       | file                                                      |
      | Summary prioritisation report | African Horse Sickness (AHS)_Summary prioritisation report.pdf |
      | Summary profile              | African Horse Sickness (AHS)_Summary profile.pdf          |
      | Question and answer sheet    | African Horse Sickness (AHS)_Question and answer sheet.pdf |

  @role:sso @TC-232
  Scenario: Applicant goes from the profile reports to the profile itself
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens View reports for the first profile
    And the applicant chooses Browse disease profile
    Then the browse page is shown for "African Horse Sickness (AHS)"

  @role:sso @TC-233
  Scenario: Applicant sees the version, the tabs and the sections on a browse page
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens Browse profile for the first profile
    Then the browse page shows the version, the tabs "Summary", "References" and "Further information" and Show all sections

  @role:sso @TC-234
  Scenario: Applicant opens and closes one section
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens Browse profile for the first profile
    And the applicant shows the section "1.1 Summary description"
    Then the section "1.1 Summary description" is open
    When the applicant hides the section "1.1 Summary description"
    Then the section "1.1 Summary description" is closed

  @role:sso @TC-235
  Scenario: Applicant opens every section at once
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens Browse profile for the first profile
    And the applicant chooses Show all sections
    Then every section is open

  @role:sso @TC-236
  Scenario: Applicant jumps to another section from the contents
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens Browse profile for the first profile
    And the applicant chooses the contents link "2."
    Then the section "2.1" is listed

  @role:sso @TC-237
  Scenario Outline: Applicant switches tab on a browse page
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens Browse profile for the first profile
    And the applicant chooses the tab "<tab>"
    Then the tab "<tab>" is the current tab

    Examples:
      | tab                 |
      | References          |
      | Further information |
      | Summary             |

  @role:sso @TC-238
  Scenario: Applicant moves to the next section with the Next page link
    Given the applicant opens the search results for "African Horse Sickness"
    When the applicant opens Browse profile for the first profile
    And the applicant chooses the Next page link of the profile
    Then the section "2.1" is listed

  @role:sso @TC-239
  Scenario: Applicant reads the chapters of the species data
    Given the applicant is on the view species data page
    When the applicant chooses the species "Amphibians" on the view species data page
    And the applicant opens the data for the chosen species
    Then the species data lists the chapters "1. Animal identification", "2. Movements", "3. Animal locations and number", "4. Bio-security", "5. Surveillance" and "6. International trade"

  @role:sso @TC-240
  Scenario: Applicant moves through the species data chapters
    Given the applicant is on the view species data page
    When the applicant chooses the species "Amphibians" on the view species data page
    And the applicant opens the data for the chosen species
    And the applicant chooses the chapter "2. Movements"
    Then the question "2.1" is listed
    When the applicant chooses the Next page link of the species data
    Then the question "3.1" is listed

  @role:sso @TC-241
  Scenario: Applicant opens and closes a species data question
    Given the applicant is on the view species data page
    When the applicant chooses the species "Amphibians" on the view species data page
    And the applicant opens the data for the chosen species
    And the applicant shows the first species data question
    Then the first species data question is open
    When the applicant hides the first species data question
    Then the first species data question is closed

  @role:sso @TC-242
  Scenario Outline: Applicant opens an address that does not exist
    When the applicant requests the address "<address>"
    Then the response status is 404

    Examples:
      | address                                              |
      | /NoSuchPage                                          |
      | /SurveillanceProfiles/EditProfileQuestions/not-a-guid |
      | /EditSpecies/00000000-0000-0000-0000-000000000000    |
