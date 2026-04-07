import { spawnSync } from 'node:child_process'

type StepResult = {
  label: string
  exitCode: number
}

const run = (label: string, command: string, args: string[]): StepResult => {
  console.log(`\n\u001b[36m▶ ${label}\u001b[0m`)
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true })
  if (result.error) {
    console.error(`Failed to spawn process for ${label}:`, result.error.message)
    return { label, exitCode: 1 }
  }
  if (result.status === null) {
    console.error(`Process for ${label} terminated by signal: ${result.signal ?? 'unknown'}`)
    return { label, exitCode: 1 }
  }
  return { label, exitCode: result.status }
}

const formatStatus = (exitCode: number): string =>
  exitCode === 0 ? '\u001b[32mPASS\u001b[0m' : `\u001b[31mFAIL (${exitCode})\u001b[0m`

const lint = run('Lint check (eslint)', 'npm', ['run', 'lint:check', '--silent'])
const typeCheck = run('Type check (tsc)', 'npm', ['run', 'type-check', '--silent'])

console.log('\n\u001b[36m▶ Summary\u001b[0m')
console.log(`  Lint:       ${formatStatus(lint.exitCode)}`)
console.log(`  Type check: ${formatStatus(typeCheck.exitCode)}`)

process.exit(lint.exitCode || typeCheck.exitCode)
