import { rmSync } from 'node:fs'

const paths = process.argv.slice(2)
if (paths.length === 0) {
  console.error('Usage: ts-node script/clean.ts <path> [<path> ...]')
  process.exit(1)
}

for (const p of paths) {
  rmSync(p, { recursive: true, force: true })
}
