// Node replacement for json_to_ado_csv.py: writes the ADO test-case import CSV next to each JSON in docs/test-cases.
// Usage: node scripts/json-to-csv.js
import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve(import.meta.dirname, '..', 'docs', 'test-cases')
const esc = (v) => { const s = String(v ?? ''); return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
const header = ['ID', 'Work Item Type', 'Title', 'Test Step', 'Step Action', 'Step Expected', 'Area Path', 'Assigned To', 'State']

let written = 0
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const doc = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8').replace(/^\uFEFF/, ''))
  const rows = [header]
  for (const tc of doc.test_cases) {
    tc.steps.forEach((s, i) => {
      rows.push(i === 0
        ? ['', 'Test Case', tc.title, `Step ${i + 1}`, s.action, s.expected, tc.area_path, tc.assigned_to, tc.state]
        : ['', '', '', `Step ${i + 1}`, s.action, s.expected, '', '', ''])
    })
  }
  fs.writeFileSync(path.join(dir, f.replace(/\.json$/, '.csv')), `${rows.map((r) => r.map(esc).join(',')).join('\r\n')}\r\n`)
  written++
}
console.log(`${written} CSV files written`)
