import { rmSync } from 'node:fs'
import * as path from 'node:path'

const repoRoot = path.resolve(__dirname, '..')
const paths = process.argv.slice(2)

if (paths.length === 0) {
  console.error('Usage: ts-node script/clean.ts <path> [<path> ...]')
  process.exit(1)
}

for (const p of paths) {
  const resolved = path.resolve(repoRoot, p)
  const rel = path.relative(repoRoot, resolved)
  if (resolved === repoRoot || rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) {
    console.error(`✗ refusing to delete outside repo root: ${p}`)
    process.exit(1)
  }
  rmSync(resolved, { recursive: true, force: true })
}
