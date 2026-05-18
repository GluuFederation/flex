import * as fs from 'node:fs'
import * as path from 'node:path'
import {
  REGEX_ORVAL_EXPORT_CONST_FN,
  REGEX_ORVAL_WRITE_METHOD_LINE,
  REGEX_CLOSING_BRACE_LINE,
  REGEX_ORVAL_HAS_USE_MUTATION_IMPORT,
  regexForOrvalMutationHook,
  regexForOrvalQueryHook,
  regexForOrvalHookDecl,
} from '../app/utils/regex'

const rootDir = process.cwd()
const orvalDir = path.join(rootDir, 'jans_config_api_orval', 'src')

if (!fs.existsSync(orvalDir)) {
  console.error(`\n✗ Orval verification FAILED — generated client dir not found at ${orvalDir}.`)
  console.error(`Run \`npm run api:orval\` first to generate the client.\n`)
  process.exit(1)
}

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.isFile() && entry.name.endsWith('.ts')) out.push(full)
  }
  return out
}

const tagFiles = walk(orvalDir).filter((p) => !p.includes(`${path.sep}schemas${path.sep}`))

if (tagFiles.length === 0) {
  console.error(`\n✗ Orval verification FAILED — no tag files found under ${orvalDir}.\n`)
  process.exit(1)
}

const hookImportSeen = tagFiles.some((p) =>
  REGEX_ORVAL_HAS_USE_MUTATION_IMPORT.test(fs.readFileSync(p, 'utf8')),
)

if (!hookImportSeen) {
  console.error(
    `\n✗ Orval verification FAILED — no generated file imports useMutation from @tanstack/react-query.`,
  )
  console.error(
    `\nThis indicates the installed orval version emits all hooks as useQuery (regression in 8.10.0).`,
  )
  console.error(`Pin orval to a known-good version (e.g. 8.9.1 exact) in package.json.\n`)
  process.exit(1)
}

type WriteOp = { name: string; method: string; line: number; file: string }

const writeOps: WriteOp[] = []
const allContent: string[] = []

for (const filePath of tagFiles) {
  const content = fs.readFileSync(filePath, 'utf8')
  allContent.push(content)
  const lines = content.split('\n')
  let currentFnName: string | null = null
  let currentFnStartLine = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = REGEX_ORVAL_EXPORT_CONST_FN.exec(line)
    if (match) {
      currentFnName = match[1]
      currentFnStartLine = i + 1
      continue
    }
    if (currentFnName) {
      const methodMatch = REGEX_ORVAL_WRITE_METHOD_LINE.exec(line)
      if (methodMatch) {
        writeOps.push({
          name: currentFnName,
          method: methodMatch[1],
          line: currentFnStartLine,
          file: path.relative(rootDir, filePath),
        })
        currentFnName = null
      } else if (REGEX_CLOSING_BRACE_LINE.test(line.trim())) {
        currentFnName = null
      }
    }
  }
}

const combinedContent = allContent.join('\n')

const failures: string[] = []
for (const op of writeOps) {
  const hookName = `use${op.name.charAt(0).toUpperCase()}${op.name.slice(1)}`
  const mutationPattern = regexForOrvalMutationHook(hookName)
  const queryPattern = regexForOrvalQueryHook(hookName)
  if (queryPattern.test(combinedContent) && !mutationPattern.test(combinedContent)) {
    failures.push(
      `  ✗ ${hookName} (${op.method} in ${op.file}:${op.line}) uses useQuery — should use useMutation`,
    )
  } else if (!mutationPattern.test(combinedContent)) {
    if (!regexForOrvalHookDecl(hookName).test(combinedContent)) {
      failures.push(
        `  ✗ ${hookName} (${op.method} in ${op.file}:${op.line}) — no write hook declaration found; orval did not emit a hook for this write endpoint`,
      )
      continue
    }
    failures.push(
      `  ✗ ${hookName} (${op.method} in ${op.file}:${op.line}) found but missing useMutation()`,
    )
  }
}

if (failures.length > 0) {
  console.error(
    `\n✗ Orval verification FAILED — ${failures.length} write-method endpoint(s) generated as useQuery:`,
  )
  for (const f of failures) console.error(f)
  console.error(
    `\nThis is the bug that caused DELETE /admin-ui/license/deleteConfig to auto-fire after login.\nRegenerate with: npm run api:orval (ensure pinned orval version in package.json).\n`,
  )
  process.exit(1)
}

console.log(
  `✓ Orval verification passed: ${writeOps.length} write-method endpoints use useMutation across ${tagFiles.length} files`,
)
