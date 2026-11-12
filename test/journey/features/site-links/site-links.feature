@feature:site-links @ui @smoke
Feature: Header, footer and help links
  The links shared by every page, and the links on the Help page, lead where they say.

  @role:sso @TC-212
  Scenario Outline: Applicant uses a shared link from a page
    Given the applicant is on the "<start>" page
    When the applicant chooses the shared link "<link>"
    Then the "<destination>" page is displayed

    Examples:
      | start             | link            | destination |
      | Search            | D2R2            | home        |
      | General reports   | D2R2            | home        |
      | View species data | D2R2            | home        |
      | Search            | D2R2 Home       | home        |
      | General reports   | D2R2 Home       | home        |
      | View species data | D2R2 Home       | home        |
      | Search            | Help using D2R2 | help        |
      | General reports   | Help using D2R2 | help        |
      | View species data | Help using D2R2 | help        |

  @role:sso @TC-213
  Scenario: Applicant uses the skip link to reach the main content
    Given the applicant is on the "Search" page
    When the applicant chooses the shared link "Skip to main content"
    Then the address ends with "#main-content"

  @role:sso @TC-214
  Scenario: Applicant uses back to top at the foot of a page
    Given the applicant is on the "General reports" page
    When the applicant chooses the shared link "Back to top"
    Then the address ends with "#top"

  @role:sso @TC-215
  Scenario: Applicant opens the D2R2 quality statement
    Given the applicant is on the "home" page
    When the applicant chooses the quality statement link
    Then a document is downloaded

  @role:sso @TC-216
  Scenario Outline: Applicant chooses a footer link that has no destination yet
    Given the applicant is on the "home" page
    When the applicant chooses the shared link "<link>"
    Then the applicant stays on the "home" page

    Examples:
      | link                         |
      | Cookies                      |
      | Accessibility statement      |
      | Privacy notice               |
      | Open Government Licence v3.0 |

  @role:sso @TC-217
  Scenario: Applicant sees the APHA logo link to the APHA intranet
    Given the applicant is on the "home" page
    Then the APHA logo links to the APHA intranet

  @role:sso @TC-218
  Scenario: Applicant uses the header help icon
    Given the applicant is on the "Search" page
    When the applicant chooses the header help icon
    Then the "help" page is displayed

  @role:sso @TC-219
  Scenario: Applicant opens the header menu and sees every section
    Given the applicant is on the "home" page
    When the applicant opens the header menu
    Then the header menu offers "Search disease profiles", "General reports", "Disease ranking report" and "View species data"

  @role:sso @TC-220
  Scenario Outline: Applicant navigates with the header menu
    Given the applicant is on the "home" page
    When the applicant opens the header menu
    And the applicant chooses the menu link "<link>"
    Then the "<destination>" page is displayed

    Examples:
      | link                    | destination       |
      | Search disease profiles | Search            |
      | General reports         | General reports   |
      | View species data       | View species data |

  @role:sso @TC-221
  Scenario: Applicant downloads a user manual from the help page
    Given the applicant is on the "help" page
    When the applicant chooses the first manual
    Then a document is downloaded

  @role:sso @TC-222
  Scenario Outline: Applicant sees a support contact on the help page
    Given the applicant is on the "help" page
    Then the help page offers the email link "<address>"

    Examples:
      | address                   |
      | D2R2@defra.gov.uk         |
      | aphaservicedesk@apha.gov.uk |

  @role:sso @TC-223
  Scenario: Applicant downloads the disease ranking report from the general reports page
    Given the applicant is on the "General reports" page
    When the applicant chooses the first report
    Then a document is downloaded

  @role:sso @TC-224
  Scenario: Applicant downloads an earlier version from a report history
    Given the applicant is on the "General reports" page
    When the applicant opens the history of the first report
    And the applicant chooses the first version in the history
    Then a document is downloaded
