import { spawn, ChildProcess } from 'node:child_process'

type TaskResult = {
  label: string
  output: string
  exitCode: number
}

const runTask = (label: string, command: string, args: string[]): Promise<TaskResult> => {
  return new Promise((resolve) => {
    const resolvedCommand = process.platform === 'win32' && command === 'npm' ? 'npm.cmd' : command
    const proc: ChildProcess = spawn(resolvedCommand, args, {
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let output = ''
    proc.stdout!.on('data', (chunk: Buffer) => {
      output += chunk.toString()
    })
    proc.stderr!.on('data', (chunk: Buffer) => {
      output += chunk.toString()
    })

    proc.on('error', (err: Error) => {
      resolve({ label, output: err.message, exitCode: 1 })
    })

    proc.on('close', (code: number | null) => {
      resolve({ label, output, exitCode: code ?? 1 })
    })
  })
}

const ESC = '\x1b'
const cyan = (s: string): string => `${ESC}[36m${s}${ESC}[0m`
const green = (s: string): string => `${ESC}[32m${s}${ESC}[0m`
const red = (s: string): string => `${ESC}[31m${s}${ESC}[0m`

const formatStatus = (exitCode: number): string =>
  exitCode === 0 ? green('PASS') : red(`FAIL (${exitCode})`)

void (async () => {
  console.log(cyan('▶ Running lint and type-check in parallel...') + '\n')

  const [lint, typeCheck] = await Promise.all([
    runTask('Lint check (eslint)', 'npm', ['run', 'lint:check', '--silent']),
    runTask('Type check (tsc)', 'npm', ['run', 'type-check', '--silent']),
  ])

  for (const result of [lint, typeCheck]) {
    console.log(cyan(`▶ ${result.label}`))
    if (result.output.trim()) {
      console.log(result.output.trimEnd())
    }
    console.log()
  }

  console.log(cyan('▶ Summary'))
  console.log(`  Lint:       ${formatStatus(lint.exitCode)}`)
  console.log(`  Type check: ${formatStatus(typeCheck.exitCode)}`)

  process.exit(lint.exitCode || typeCheck.exitCode)
})()
