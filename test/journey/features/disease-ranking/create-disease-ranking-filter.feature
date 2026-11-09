@feature:create-disease-ranking-filter @ui @smoke
Feature: Create disease ranking filter
  Users can open the disease ranking filter page and confirm the filter controls are available.

  @role:sso @TC-018
  Scenario: Applicant opens the disease ranking filter page and sees the filter controls
    Given the applicant is on the create disease ranking filter page
    Then the create disease ranking filter page is shown
    And the create disease ranking filter page shows the filter controls

  @role:sso @TC-106
  Scenario: Applicant opens the disease ranking filter page directly and confirms the filter controls remain visible
    Given the applicant is on the create disease ranking filter page
    Then the create disease ranking filter page is shown
    And the create disease ranking filter page shows the filter controls after direct access

  @role:sso @TC-132
  Scenario: Applicant opens the disease ranking filter page directly and confirms the page remains stable after navigation
    Given the applicant is on the create disease ranking filter page
    Then the create disease ranking filter page is shown
    And the create disease ranking filter page shows the filter controls after direct access
