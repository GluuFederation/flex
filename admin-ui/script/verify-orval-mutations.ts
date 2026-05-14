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
const filePath = path.join(rootDir, 'jans_config_api_orval', 'src', 'JansConfigApi.ts')
if (!fs.existsSync(filePath)) {
  console.error(`\n✗ Orval verification FAILED — generated client not found at ${filePath}.`)
  console.error(`Run \`npm run api:orval\` first to generate the client.\n`)
  process.exit(1)
}

const content = fs.readFileSync(filePath, 'utf8')

if (!REGEX_ORVAL_HAS_USE_MUTATION_IMPORT.test(content)) {
  console.error(
    `\n✗ Orval verification FAILED — generated file does not import useMutation from @tanstack/react-query.`,
  )
  console.error(
    `\nThis indicates the installed orval version emits all hooks as useQuery (regression in 8.10.0).`,
  )
  console.error(`Pin orval to a known-good version (e.g. 8.9.1 exact) in package.json.\n`)
  process.exit(1)
}

const lines = content.split('\n')

const writeOps: Array<{ name: string; method: string; line: number }> = []
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
      writeOps.push({ name: currentFnName, method: methodMatch[1], line: currentFnStartLine })
      currentFnName = null
    } else if (REGEX_CLOSING_BRACE_LINE.test(line.trim())) {
      currentFnName = null
    }
  }
}

const failures: string[] = []
for (const op of writeOps) {
  const hookName = `use${op.name.charAt(0).toUpperCase()}${op.name.slice(1)}`
  const mutationPattern = regexForOrvalMutationHook(hookName)
  const queryPattern = regexForOrvalQueryHook(hookName)
  if (queryPattern.test(content) && !mutationPattern.test(content)) {
    failures.push(
      `  ✗ ${hookName} (${op.method} from line ${op.line}) uses useQuery — should use useMutation`,
    )
  } else if (!mutationPattern.test(content)) {
    if (!regexForOrvalHookDecl(hookName).test(content)) {
      failures.push(
        `  ✗ ${hookName} (${op.method} from line ${op.line}) — no write hook declaration found; orval did not emit a hook for this write endpoint`,
      )
      continue
    }
    failures.push(
      `  ✗ ${hookName} (${op.method} from line ${op.line}) found but missing useMutation()`,
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
  `✓ Orval verification passed: ${writeOps.length} write-method endpoints use useMutation`,
)
