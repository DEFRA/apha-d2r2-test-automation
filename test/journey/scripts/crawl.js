import fs from 'node:fs'
import { chromium } from '@playwright/test'
import { uiBaseUrl } from '../support/env.js'

// Read-only GET crawl using the saved session. Nothing is submitted.
const base = uiBaseUrl()
const origin = new URL(base).origin
const seen = new Map()
const queue = [base]
const guid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi
const template = (u) => { const x = new URL(u); return x.pathname.replace(guid, '{id}').replace(/\/\d+(?=\/|$)/g, '/{n}') + (x.search ? '?' + [...x.searchParams.keys()].sort().join('&') : '') }

const browser = await chromium.launch()
const context = await browser.newContext({ storageState: '.auth/user.json' })
const page = await context.newPage()
const skip = /logout|signout|sign-out|session\/|\.pdf|\.docx?|\.xlsx?|\/document$|download/i

while (queue.length && seen.size < 150) {
  const url = queue.shift()
  const key = template(url)
  if (seen.has(key)) continue
  const rec = { key, url: url.replace(guid, '{id}'), status: null, h1: null, links: [], buttons: [], forms: [], inputs: [], tables: 0, nav: [] }
  seen.set(key, rec)
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    rec.status = resp ? resp.status() : null
  } catch (e) {
    rec.error = String(e.message).split('\n')[0].slice(0, 120)
    continue
  }
  rec.h1 = (await page.locator('h1').first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim()
  rec.denied = /do not have permission/i.test(await page.locator('main, body').first().innerText().catch(() => ''))
  rec.links = await page.$$eval('a[href]', (as) => as.map((a) => ({ t: a.innerText.replace(/\s+/g, ' ').trim().slice(0, 60), h: a.href })))
  rec.buttons = await page.$$eval('button, input[type=submit], [role=button]', (bs) => [...new Set(bs.map((b) => (b.innerText || b.value || b.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 50)).filter(Boolean))])
  rec.inputs = await page.$$eval('input:not([type=hidden]), select, textarea', (is) => is.map((i) => ({ n: i.name || i.id, ty: i.type || i.tagName.toLowerCase(), req: i.required || i.getAttribute('aria-required') === 'true', max: i.maxLength > 0 ? i.maxLength : undefined })))
  rec.forms = await page.$$eval('form', (fs) => fs.map((f) => ({ m: (f.method || 'get').toLowerCase(), a: f.getAttribute('action') || '' })))
  rec.tables = await page.locator('table').count()
  for (const l of rec.links) {
    if (!l.h.startsWith(origin) || skip.test(l.h) || l.h.includes('#')) continue
    if (!seen.has(template(l.h))) queue.push(l.h)
  }
}
await browser.close()
fs.mkdirSync('docs/discovery', { recursive: true })
const out = [...seen.values()].map((r) => ({ ...r, links: r.links.length, linkList: undefined }))
fs.writeFileSync('docs/discovery/crawl.json', JSON.stringify({ base, when: new Date().toISOString(), pages: [...seen.values()].map((r) => ({ ...r, links: [...new Set(r.links.map((l) => `${l.t} -> ${template(l.h)}`))] })) }, null, 1))
console.log('pages', seen.size)
for (const r of out) console.log(`${r.status} ${r.denied ? 'DENIED' : ''} ${r.key} | ${r.h1} | inputs ${r.inputs.length} forms ${r.forms.length} btn ${r.buttons.length}`)
