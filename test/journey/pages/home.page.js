import { BasePage } from './base.page.js'
import { routes } from '../content/routes.js'

// source: app/Profiles.Web/Home.aspx:1-89
/**
 * Home page navigation targets on the legacy D2R2 landing page.
 * @extends BasePage
 */
export class HomePage extends BasePage {
  constructor(page) {
    super(page, routes.home)
  }

  get searchLink() {
    return this.page.locator('a:visible').filter({ hasText: /search disease profiles/i }).first()
  }

  get diseaseRankingLink() {
    return this.page.locator('a:visible').filter({ hasText: /disease ranking report/i }).first()
  }

  get generalReportsLink() {
    return this.page.locator('a:visible').filter({ hasText: /general reports/i }).first()
  }

  get viewSpeciesDataLink() {
    return this.page.locator('a:visible').filter({ hasText: /view species data/i }).first()
  }

  get helpLink() {
    return this.page.locator('a:visible').filter({ hasText: /help using d2r2/i }).first()
  }

  get createProfileLink() {
    return this.page.locator('a:visible').filter({ hasText: /create profile/i }).first()
  }

  get globalUsersLink() {
    return this.page.locator('a:visible').filter({ hasText: /global users/i }).first()
  }

  get externalUsersLink() {
    return this.page.locator('a:visible').filter({ hasText: /external users/i }).first()
  }

  get compareProfileVersionsLink() {
    return this.page.locator('a:visible').filter({ hasText: /compare profile versions/i }).first()
  }

  get reviewTimingsLink() {
    return this.page.locator('a:visible').filter({ hasText: /review timings/i }).first()
  }

  get maintainReferenceDataLink() {
    return this.page.locator('a:visible').filter({ hasText: /maintain reference data/i }).first()
  }

  get maintainSpeciesDataLink() {
    return this.page.locator('a[href*="MaintainSpeciesData.aspx"]').first()
  }

  get maintainPrioritisationVariablesLink() {
    return this.page.locator('a:visible').filter({ hasText: /maintain prioritisation variables/i }).first()
  }

  get maintainCrossCuttingIssueScoresLink() {
    return this.page.locator('a:visible').filter({ hasText: /maintain cross-cutting issue scores/i }).first()
  }

  get questionsAndGuidanceReportsLink() {
    return this.page.locator('a[href*="EditUserGuidance.aspx"]').first()
  }

  get createDiseaseRankingFilterLink() {
    return this.page.locator('a:visible').filter({ hasText: /create disease ranking filter/i }).first()
  }

  async openSearchPage() {
    await this.searchLink.click()
  }

  async openDiseaseRankingPage() {
    await this.diseaseRankingLink.click()
  }

  async openGeneralReportsPage() {
    await this.generalReportsLink.click()
  }

  async openViewSpeciesDataPage() {
    await this.viewSpeciesDataLink.click()
  }

  async openHelpPage() {
    await this.helpLink.click()
  }

  async openCreateProfilePage() {
    await this.createProfileLink.click()
  }

  async openGlobalUsersPage() {
    await this.globalUsersLink.click()
  }

  async openExternalUsersPage() {
    await this.externalUsersLink.click()
  }

  async openCompareProfileVersionsPage() {
    await this.compareProfileVersionsLink.click()
  }

  async openReviewTimingsPage() {
    const reviewTimingsLink = this.reviewTimingsLink
    if (await reviewTimingsLink.count() && await reviewTimingsLink.isVisible().catch(() => false)) {
      await reviewTimingsLink.click()
      return
    }

    await this.page.goto(routes.reviewTimings)
  }

  async openMaintainReferenceDataPage() {
    await this.maintainReferenceDataLink.click()
  }

  async openMaintainSpeciesDataPage() {
    await this.maintainSpeciesDataLink.click()
  }

  async openMaintainPrioritisationVariablesPage() {
    await this.maintainPrioritisationVariablesLink.click()
  }

  async openMaintainCrossCuttingIssueScoresPage() {
    await this.maintainCrossCuttingIssueScoresLink.click()
  }

  async openQuestionsAndGuidanceReportsPage() {
    const questionsAndGuidanceReportsLink = this.questionsAndGuidanceReportsLink
    if (await questionsAndGuidanceReportsLink.count() && await questionsAndGuidanceReportsLink.isVisible().catch(() => false)) {
      await questionsAndGuidanceReportsLink.click()
      return
    }

    await this.page.goto(routes.questionsAndGuidanceReports)
  }

  async openCreateDiseaseRankingFilterPage() {
    await this.createDiseaseRankingFilterLink.click()
  }
}
