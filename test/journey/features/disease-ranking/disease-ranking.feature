@wip @feature:disease-ranking @ui @smoke
Feature: Disease ranking report
  Users can open the disease ranking page and use the report selectors.

  @role:sso @TC-011
  Scenario: Applicant opens the disease ranking page and sees the report selectors
    Given the applicant is on the disease ranking page
    Then the disease ranking page shows the report selectors

  @role:sso @TC-012
  Scenario: Applicant chooses a disease ranking report option
    Given the applicant is on the disease ranking page
    When the applicant chooses the terrestrial disease ranking report
    Then the disease ranking page keeps the selected report

  @role:sso @TC-033
  Scenario: Applicant reaches the disease ranking page by clicking from home and chooses a report option
    Given the applicant is on the home page
    When the applicant chooses Disease Ranking Report
    Then the disease ranking page is shown
    When the applicant chooses the terrestrial disease ranking report
    Then the disease ranking page keeps the selected report

  @role:sso @TC-131
  Scenario: Applicant opens the disease ranking page directly and confirms the page remains stable after navigation
    Given the applicant is on the disease ranking page
    Then the disease ranking page shows the report selectors
