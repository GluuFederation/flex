import * as fs from 'node:fs'
import * as path from 'node:path'
import {
  REGEX_ORVAL_VALUE_DECL,
  REGEX_ORVAL_TYPE_DECL,
  REGEX_ORVAL_EXPORT_LIST,
  REGEX_ORVAL_EXPORT_TYPE_LIST,
  REGEX_ORVAL_INLINE_TYPE_PREFIX,
  REGEX_ORVAL_AS_SEPARATOR,
} from '../app/utils/regex'

const rootDir = process.cwd()
const orvalDir = path.join(rootDir, 'jans_config_api_orval', 'src')

if (!fs.existsSync(orvalDir)) {
  console.error(
    `\n✗ Orval barrel generation FAILED — generated client dir not found at ${orvalDir}.`,
  )
  console.error(`Run \`npm run api:orval\` first to generate the client.\n`)
  process.exit(1)
}

type Exports = { values: string[]; types: string[] }

const extractExports = (content: string): Exports => {
  const values = new Set<string>()
  const types = new Set<string>()
  for (const m of content.matchAll(REGEX_ORVAL_VALUE_DECL)) values.add(m[1])
  for (const m of content.matchAll(REGEX_ORVAL_TYPE_DECL)) types.add(m[1])
  for (const m of content.matchAll(REGEX_ORVAL_EXPORT_TYPE_LIST)) {
    for (const part of m[1].split(',')) {
      const trimmed = part.trim()
      if (!trimmed) continue
      const name = trimmed.split(REGEX_ORVAL_AS_SEPARATOR).pop()?.trim()
      if (name) types.add(name)
    }
  }
  for (const m of content.matchAll(REGEX_ORVAL_EXPORT_LIST)) {
    for (const part of m[1].split(',')) {
      const trimmed = part.trim()
      if (!trimmed) continue
      const isInlineType = REGEX_ORVAL_INLINE_TYPE_PREFIX.test(trimmed)
      const name = trimmed
        .replace(REGEX_ORVAL_INLINE_TYPE_PREFIX, '')
        .split(REGEX_ORVAL_AS_SEPARATOR)
        .pop()
        ?.trim()
      if (!name) continue
      if (isInlineType) types.add(name)
      else values.add(name)
    }
  }
  return { values: [...values].sort(), types: [...types].sort() }
}

const tagDirs = fs
  .readdirSync(orvalDir, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name !== 'schemas')
  .map((e) => e.name)
  .sort()

const lines: string[] = ["export * from './schemas'"]
for (const dir of tagDirs) {
  const file = path.join(orvalDir, dir, `${dir}.ts`)
  if (!fs.existsSync(file)) continue
  const { values, types } = extractExports(fs.readFileSync(file, 'utf8'))
  if (values.length > 0) {
    lines.push(`export { ${values.join(', ')} } from './${dir}/${dir}'`)
  }
  if (types.length > 0) {
    lines.push(`export type { ${types.join(', ')} } from './${dir}/${dir}'`)
  }
}

fs.writeFileSync(path.join(orvalDir, 'index.ts'), lines.join('\n') + '\n')
console.log(`✓ Generated orval barrel with ${lines.length - 1} tag re-exports`)
