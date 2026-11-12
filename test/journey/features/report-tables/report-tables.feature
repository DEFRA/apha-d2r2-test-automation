@feature:report-tables @ui @smoke
Feature: Report tables
  The General reports and Help Using D2R2 pages list static reports in a sortable, pageable table with a version history.

  @role:sso @TC-177
  Scenario Outline: Applicant sorts the report table by a column
    Given the applicant opens the "<page>" report table
    When the applicant sorts the report table by "<column>"
    Then the "<column>" column is marked as sorted

    Examples:
      | page            | column          |
      | General reports | Title           |
      | General reports | Version         |
      | General reports | Public?         |
      | General reports | Effective dates |
      | Help Using D2R2 | Title           |
      | Help Using D2R2 | Version         |
      | Help Using D2R2 | Effective dates |

  @role:sso @TC-178
  Scenario Outline: Applicant opens the version history of a report
    Given the applicant opens the "<page>" report table
    When the applicant opens the history of the first report
    Then the report history page is shown

    Examples:
      | page            |
      | General reports |
      | Help Using D2R2 |

  @role:sso @TC-179
  Scenario Outline: Applicant changes the number of reports shown per page
    Given the applicant opens the "<page>" report table
    When the applicant chooses the last items per page option
    Then the items per page option stays selected

    Examples:
      | page            |
      | General reports |
      | Help Using D2R2 |
