import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const allowListPath = path.join(root, 'docs', 'grounding-allow.json')
const allowed = fs.existsSync(allowListPath)
  ? JSON.parse(fs.readFileSync(allowListPath, 'utf8'))
  : []

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

const targets = ['content', 'pages', 'api', 'data']
  .flatMap((dir) => walk(path.join(root, dir)))
  .filter((filePath) => {
    const rel = path.relative(root, filePath).split(path.sep).join('/')
    return !allowed.includes(rel)
  })

const missing = []
for (const filePath of targets) {
  const rel = path.relative(root, filePath).split(path.sep).join('/')
  const text = fs.readFileSync(filePath, 'utf8')
  if (!/\/\/\s*source:/m.test(text)) missing.push(rel)
}

if (missing.length) {
  console.log(`Grounding check failed: ${missing.length} file(s) missing // source: comments`)
  for (const file of missing) console.log(`- ${file}`)
  process.exit(1)
}

console.log(`Grounding check passed: ${targets.length} tracked files checked; ${allowed.length} allow-listed file(s).`)
