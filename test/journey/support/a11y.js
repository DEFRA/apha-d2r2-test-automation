import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { analyse, collectAxeAccessibilityIssues, wcagResult } from 'wcag-js-v2'
import { PROFILE } from './profiles.js'
import { fingerprint, hash, normaliseRoute } from './page-key.js'
import { lighthouseEnabled, lighthouseOptions } from './a11y-lighthouse.js'

const DIR = path.resolve(process.env.A11Y_DIR ?? 'reports/a11y')
const KEEP_PARAMS = (process.env.A11Y_KEEP_PARAMS ?? '').split(',').filter(Boolean)
const BY_TEMPLATE = process.env.A11Y_DEDUPE_BY_TEMPLATE !== 'false'
const ENABLED = process.env.A11Y_SCAN !== 'false'
const ENFORCE = (process.env.A11Y_ENFORCE ?? 'false') === 'true'
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

/** Remove results from the previous run. Call once from global setup. */
export function resetA11y() {
  fs.rmSync(DIR, { recursive: true, force: true })
}

/** Claim a key across all workers. Exclusive file creation is atomic, so only one worker wins. */
function claim(kind, key) {
  const dir = path.join(DIR, '.seen')
  fs.mkdirSync(dir, { recursive: true })
  try {
    fs.writeFileSync(path.join(dir, `${kind}-${hash(key)}`), key, { flag: 'wx' })
    return true
  } catch (error) {
    if (error.code === 'EEXIST') return false
    throw error
  }
}

function record(folder, data) {
  const dir = path.join(DIR, folder)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, `${randomUUID()}.json`), JSON.stringify(data))
}

/**
 * Read back what the library recorded for one page. `analyse()` owns the run state, so the
 * per-page JSON this pack writes is derived from it instead of being collected separately.
 * @param {string} reportUrl
 */
function readLibraryScan(reportUrl) {
  const violationsEntry = [...wcagResult.axeViolations].reverse().find((entry) => entry[reportUrl])
  const statistics = [...wcagResult.axeStatistics].reverse().find((entry) => entry.url === reportUrl)
  return {
    raw: violationsEntry?.[reportUrl] ?? [],
    checked: Number(statistics?.totalElements ?? 0)
  }
}

/**
 * Scan the current page with axe-core once per unique route + variant, and once per page template.
 * Duplicates are skipped and logged for the report.
 * @param {import('@playwright/test').Page} page
 * @param {{ variant?: string, role?: string }} [options]
 * @returns {Promise<{ scanned: boolean, violations: object[] }>}
 */
export async function scanPage(page, { variant = 'default', role = 'anonymous' } = {}) {
  if (!ENABLED) return { scanned: false, violations: [] }
  const url = page.url()
  const route = normaliseRoute(url, { keepParams: KEEP_PARAMS })

  if (!claim('route', [PROFILE, route, variant].join('|'))) {
    record('skipped', { url, route, variant, reason: 'duplicate route' })
    return { scanned: false, violations: [] }
  }

  const facts = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector('h1')?.textContent ?? '',
    landmarks: [...document.querySelectorAll('main,nav,header,footer,aside,form')].map((e) => e.tagName.toLowerCase()),
    controls: [...document.querySelectorAll('input,select,textarea,button')].map((e) => `${e.tagName.toLowerCase()}:${e.type ?? ''}`)
  }))
  if (BY_TEMPLATE && !claim('template', [PROFILE, variant, fingerprint(facts)].join('|'))) {
    record('skipped', { url, route, variant, reason: 'duplicate template' })
    return { scanned: false, violations: [] }
  }

  // The library keys a repeated audit of the same URL with the variant, and skips the page
  // entirely when it is already in its run state.
  const pageKey = variant === 'default' && role === 'anonymous' ? '' : `${variant}, ${role}`
  const reportUrl = pageKey ? `${url}[${pageKey}]` : url

  if (wcagResult.visitedPageUrls.has(reportUrl)) {
    record('skipped', { url, route, variant, reason: 'duplicate page' })
    return { scanned: false, violations: [] }
  }

  page.setDefaultTimeout(120000)
  try {
    // One call per navigation: `analyse()` runs Lighthouse and axe and records both in the
    // run state the end-of-run reports read. Lighthouse is skipped only when switched off or
    // the page is not http(s), in which case the library's axe-only collector is used.
    if (lighthouseEnabled() && /^https?:/i.test(url)) {
      try {
        await analyse(page, pageKey, {
          settleTimeMs: 0,
          tags: TAGS,
          lighthouse: await lighthouseOptions(page, url)
        })
      } catch (error) {
        // `analyse()` runs Lighthouse first, so a failure there must not cost the axe scan.
        console.warn(`a11y: analyse failed on ${route}: ${error instanceof Error ? error.message : String(error)}; scanning with axe only`)
        await collectAxeAccessibilityIssues(page, reportUrl, TAGS)
      }
    } else {
      await collectAxeAccessibilityIssues(page, reportUrl, TAGS)
    }
  } finally {
    page.setDefaultTimeout(30000)
  }

  const { raw, checked } = readLibraryScan(reportUrl)
  // Element snippets can contain page text. Run only against synthetic data.
  const violations = raw.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    helpUrl: v.helpUrl,
    tags: v.tags.filter((tag) => tag.startsWith('wcag')),
    nodeCount: v.nodes.length,
    nodes: v.nodes.slice(0, 5).map((n) => ({ target: n.target, html: n.html.slice(0, 200) }))
  }))

  record('results', {
    route, url, variant, role, profile: PROFILE, title: facts.title, h1: facts.h1,
    scannedAt: new Date().toISOString(),
    checked, violations
  })

  if (ENFORCE && violations.length) {
    throw new Error(`Accessibility violations on ${route}: ${violations.map((v) => v.id).join(', ')}`)
  }
  return { scanned: true, violations }
}
