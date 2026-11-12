@feature:permission-boundaries @ui @smoke
Feature: Permission boundaries
  A signed-in user without the ProfileEditor role cannot open editor-only pages, and the pages are not offered to them.

  @role:sso @TC-174
  Scenario Outline: Applicant without the editor role cannot open an editor page by address
    When the applicant opens the "<page>" page by address
    Then the permission denied page is shown

    Examples:
      | page                                  |
      | Maintain global users                 |
      | Maintain external users               |
      | Maintain reference data               |
      | Reference data audit trail            |
      | Maintain prioritisation variables     |
      | Maintain cross-cutting issue scores   |
      | Maintain species data                 |
      | Compare profile versions              |
      | Create profile                        |
      | Review timings                        |
      | Edit questions and guidance           |
      | Edit disease ranking filters          |
      | Report editor disease ranking filters |

  @role:sso @TC-175
  Scenario: Applicant without the editor role can return home from the permission denied page
    When the applicant opens the "Maintain global users" page by address
    And the applicant chooses to go to the D2R2 home page
    Then the home page shows the popular links

  @role:sso @TC-176
  Scenario: Applicant without the editor role is not offered editor links on the home page
    Given the applicant is on the home page
    Then the home page does not offer the editor links
