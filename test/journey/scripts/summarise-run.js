import fs from 'node:fs'

const t = fs.readFileSync(new URL(`../${process.argv[2] ?? 'run-gds-wip.log'}`, import.meta.url), 'utf8')
const r = JSON.parse(t.slice(t.indexOf('{\n  "config"')))
console.log(JSON.stringify(r.stats))
const rows = []
const walk = (s) => {
  for (const x of s.suites || []) walk(x)
  for (const sp of s.specs || []) {
    const res = sp.tests[0].results.slice(-1)[0]
// eslint-disable-next-line no-control-regex -- strips ANSI colour codes from Playwright errors
    rows.push({ ok: sp.ok, tags: sp.tags || [], file: s.file, title: sp.title, err: ((res.error && res.error.message) || '').replace(/\u001b\[[0-9;]*m/g, '').split('\n')[0].slice(0, 120) })
  }
}
walk({ suites: r.suites })
console.log('pass', rows.filter((x) => x.ok).length, 'fail', rows.filter((x) => !x.ok).length)
for (const x of rows.filter((y) => !y.ok)) console.log(`${x.tags.filter((g) => /TC-/.test(g)).join(',')} | ${x.file} | ${x.title.slice(0, 60)} | ${x.err}`)
