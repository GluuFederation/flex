import { rmSync } from 'node:fs'
import { execSync } from 'node:child_process'

const PATHS: readonly string[] = [
  'dist',
  'node_modules',
  'package-lock.json',
  'jans_config_api_orval',
  '.eslintcache',
  '.vite',
  'coverage',
]

for (const p of PATHS) {
  rmSync(p, { recursive: true, force: true })
  console.log(`removed ${p}`)
}

execSync('npm cache clean --force', { stdio: 'inherit' })
