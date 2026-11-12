 @feature:audit-trails @ui @smoke
Feature: Audit trails
  Users can reach the species and reference-table audit trail pages from the maintenance areas.

  @role:sso @TC-052 @needs:editor
  Scenario: Applicant opens the species data audit trail page
    Given the applicant opens the species data audit trail page
    Then the species data audit trail page is shown

  @role:sso @TC-053 @needs:editor
  Scenario: Applicant opens the reference table audit trail page
    Given the applicant opens the reference table audit trail page
    Then the reference table audit trail page is shown

  @role:sso @TC-114 @needs:editor
  Scenario: Applicant opens the species data audit trail page directly and confirms the page remains visible
    Given the applicant opens the species data audit trail page
    Then the species data audit trail page is shown

  @role:sso @TC-115 @needs:editor
  Scenario: Applicant opens the reference table audit trail page directly and confirms the page remains visible
    Given the applicant opens the reference table audit trail page
    Then the reference table audit trail page is shown

  @role:sso @TC-135 @needs:editor
  Scenario: Applicant opens the species data audit trail page directly and confirms the page remains stable after navigation
    Given the applicant opens the species data audit trail page
    Then the species data audit trail page is shown

  @role:sso @TC-136 @needs:editor
  Scenario: Applicant opens the reference table audit trail page directly and confirms the page remains stable after navigation
    Given the applicant opens the reference table audit trail page
    Then the reference table audit trail page is shown
