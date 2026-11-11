@wip ﻿@feature:profile-editing @ui @smoke
Feature: Profile editing
  Users can move between the profile editing tabs and the section links from the browse profile page.

  @role:sso @TC-151
  Scenario: Applicant opens the references tab from the browse profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the browse profile page for an editable draft version
    And the applicant opens the "References" tab of the browse profile page
    Then the edit page for the "References" tab is shown

  @role:sso @TC-144
  Scenario: Applicant opens the further information tab from the browse profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the browse profile page for an editable draft version
    And the applicant opens the "Further information" tab of the browse profile page
    Then the edit page for the "Further information" tab is shown

  @role:sso @TC-152
  Scenario: Applicant opens the all revision dates tab from the browse profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the browse profile page for an editable draft version
    And the applicant opens the "All Revision dates" tab of the browse profile page
    Then the edit page for the "All Revision dates" tab is shown

  @role:sso @TC-146
  Scenario: Applicant opens the contributions tab from the browse profile page
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the browse profile page for an editable draft version
    And the applicant opens the "Contributions" tab of the browse profile page
    Then the edit page for the "Contributions" tab is shown

  @role:sso @TC-147
  Scenario: Applicant opens the profile references page from the section links
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the browse profile page for an editable draft version
    And the applicant opens the "Profile references" section link
    Then the profile references page is shown

  @role:sso @TC-148
  Scenario: Applicant opens the summary profile report from the section links
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the browse profile page for an editable draft version
    And the applicant opens the "Summary profile report" section link
    Then the report page loads without an application error

  @role:sso @TC-149
  Scenario: Applicant opens the summary prioritisation report from the section links
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the browse profile page for an editable draft version
    And the applicant opens the "Summary prioritisation report" section link
    Then the report page loads without an application error

  @role:sso @TC-150
  Scenario: Applicant opens the full profile print version from the section links
    Given the applicant is on the search page
    When the applicant searches for "African Horse Sickness"
    And the applicant opens the browse profile page for an editable draft version
    And the applicant opens the full profile print version
    Then the print version opens in a new window


