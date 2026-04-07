import { spawnSync } from 'node:child_process'

type StepResult = {
  label: string
  exitCode: number
}

const run = (label: string, command: string, args: string[]): StepResult => {
  console.log(`\n\u001b[36m▶ ${label}\u001b[0m`)
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true })
  return { label, exitCode: result.status ?? 0 }
}

const formatStatus = (exitCode: number): string =>
  exitCode === 0 ? '\u001b[32mPASS\u001b[0m' : `\u001b[31mFAIL (${exitCode})\u001b[0m`

const lint = run('Lint check (eslint)', 'npm', ['run', 'lint:check', '--silent'])
const typeCheck = run('Type check (tsc)', 'npm', ['run', 'type-check', '--silent'])

console.log('\n\u001b[36m▶ Summary\u001b[0m')
console.log(`  Lint:       ${formatStatus(lint.exitCode)}`)
console.log(`  Type check: ${formatStatus(typeCheck.exitCode)}`)

process.exit(lint.exitCode || typeCheck.exitCode)
