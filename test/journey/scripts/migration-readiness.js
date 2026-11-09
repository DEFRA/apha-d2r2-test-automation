import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const registerPath = path.join(root, 'docs', '05-migration-register.md')
const registerText = fs.existsSync(registerPath) ? fs.readFileSync(registerPath, 'utf8') : ''

const walk = (dir) => {
  if (!fs.existsSync(dir)) return []
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walk(filePath))
    } else if (entry.isFile() && filePath.endsWith('.js')) {
      results.push(filePath)
    }
  }
  return results
}

const tracked = []
for (const filePath of walk(path.join(root, 'components'))) {
  const rel = path.relative(root, filePath).split(path.sep).join('/')
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    const hit = lines[i].match(/\/\/\s*legacy-only:\s*(.*)$/)
    if (hit) tracked.push({ file: rel, line: i + 1, detail: hit[1].trim() })
  }
}

const registerEntries = new Set()
for (const line of registerText.split(/\r?\n/)) {
  const match = line.match(/^[-*]\s*([^|]+)\s*\|/) || line.match(/^\d+\.\s*([^|]+)\s*\|/)
  if (match) registerEntries.add(match[1].trim())
}

const missingFromRegister = tracked.filter(({ file, line }) => !registerEntries.has(`${file}:${line}`))
const registerWithoutMarker = [...registerEntries].filter((header) => !tracked.some(({ file, line }) => `${file}:${line}` === header))

if (missingFromRegister.length || registerWithoutMarker.length) {
  console.log(`Migration readiness failed: ${missingFromRegister.length} marker(s) missing from docs/05-migration-register.md`) 
  for (const item of missingFromRegister) {
    console.log(`- ${item.file}:${item.line} | ${item.detail}`)
  }
  if (registerWithoutMarker.length) {
    console.log('Stale register entries:')
    for (const item of registerWithoutMarker) console.log(`- ${item}`)
  }
  process.exit(1)
}

console.log(`Migration readiness passed: ${tracked.length} legacy-only marker(s) are recorded in docs/05-migration-register.md.`)
