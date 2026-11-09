@feature:maintain-reference-data @ui @smoke
Feature: Maintain reference data
  Users can open the maintain reference data page and confirm the reference table controls are available.

  @role:sso @TC-019
  Scenario: Applicant opens the maintain reference data page and sees the reference table controls
    Given the applicant is on the maintain reference data page
    Then the maintain reference data page is shown
    And the maintain reference data page shows the reference table controls

  @role:sso @TC-027
  Scenario: Applicant selects a reference table from the maintain reference data page
    Given the applicant is on the maintain reference data page
    When the applicant selects the Surveillance outcome reference table
    Then the maintain reference data page shows the selected reference table

  @role:sso @TC-055
  Scenario: Applicant opens the reference table audit trail from the maintain reference data page
    Given the applicant is on the maintain reference data page
    When the applicant selects the Surveillance outcome reference table
    And the applicant clicks View Audit Trail
    Then the reference table audit trail page is shown

  @role:sso @TC-032
  Scenario: Applicant reaches the maintain reference data page by clicking from home and selects a reference table
    Given the applicant is on the home page
    When the applicant chooses Maintain Reference Data
    Then the home navigation maintain reference data page is shown
    When the applicant selects the Surveillance outcome reference table
    Then the maintain reference data page shows the selected reference table

  @role:sso @TC-110
  Scenario: Applicant opens the maintain reference data page directly and confirms the reference table controls remain visible
    Given the applicant is on the maintain reference data page
    Then the maintain reference data page is shown
    And the maintain reference data page shows the reference table controls

  @role:sso @TC-123
  Scenario: Applicant opens the maintain reference data page directly and confirms the page remains stable after navigation
    Given the applicant is on the maintain reference data page
    Then the maintain reference data page is shown
    And the maintain reference data page shows the reference table controls
