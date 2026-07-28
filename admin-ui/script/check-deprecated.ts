import { spawnSync } from 'node:child_process'

type LintMessage = {
  ruleId: string | null
  message: string
  line: number
  column: number
}

type LintResult = {
  filePath: string
  messages: LintMessage[]
}

const ESC = '\x1b'
const cyan = (s: string): string => `${ESC}[36m${s}${ESC}[0m`
const green = (s: string): string => `${ESC}[32m${s}${ESC}[0m`
const red = (s: string): string => `${ESC}[31m${s}${ESC}[0m`
const dim = (s: string): string => `${ESC}[2m${s}${ESC}[0m`

const SYMBOL_PATTERN = /`([^`]+)` is deprecated/

const relative = (filePath: string): string => filePath.replace(`${process.cwd()}/`, '')

const symbolOf = (message: string): string => SYMBOL_PATTERN.exec(message)?.[1] ?? message

void (() => {
  console.log(cyan('▶ Scanning app/ and plugins/ for deprecated APIs...') + '\n')

  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  const proc = spawnSync(
    command,
    ['eslint', '--no-config-lookup', '-c', 'eslint.deprecation.cjs', '-f', 'json', '.'],
    { encoding: 'utf8', shell: false, maxBuffer: 64 * 1024 * 1024 },
  )

  const stdout = proc.stdout?.trim()
  if (!stdout) {
    console.log(red('Could not run the deprecation scan.'))
    console.log(proc.stderr ?? '')
    process.exit(1)
  }

  const results = JSON.parse(stdout) as LintResult[]
  const findings = results.flatMap((result) =>
    result.messages.map((message) => ({
      file: relative(result.filePath),
      line: message.line,
      symbol: symbolOf(message.message),
      message: message.message.split('\n')[0],
    })),
  )

  if (findings.length === 0) {
    console.log(green('No deprecated APIs in use.'))
    return
  }

  const bySymbol = new Map<string, typeof findings>()
  findings.forEach((finding) => {
    bySymbol.set(finding.symbol, [...(bySymbol.get(finding.symbol) ?? []), finding])
  })

  const sorted = [...bySymbol.entries()].sort((a, b) => b[1].length - a[1].length)
  sorted.forEach(([symbol, group]) => {
    console.log(`${red(symbol)} ${dim(`(${group.length})`)}`)
    group.forEach((finding) => {
      console.log(`  ${finding.file}:${finding.line}`)
    })
    console.log(`  ${dim(group[0]!.message)}\n`)
  })

  console.log(red(`${findings.length} deprecated usage(s) across ${sorted.length} symbol(s).`))
  process.exit(1)
})()
