import { spawn, ChildProcess } from 'node:child_process'

type FormatStats = {
  total: number
  formatted: number
}

const ESC = '\x1b'
const cyan = (s: string): string => `${ESC}[36m${s}${ESC}[0m`

const proc: ChildProcess = spawn('npx prettier --write "**/*.{js,jsx,ts,tsx,json,css,scss}"', [], {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe'],
})

const stats: FormatStats = { total: 0, formatted: 0 }

function processLine(line: string): void {
  if (!line.trim()) return
  process.stdout.write(line + '\n')
  if (line.startsWith('[')) return
  if (!line.includes('(unchanged)') && !line.includes('(changed)') && !line.includes('(cached)'))
    return
  stats.total++
  if (line.includes('(changed)')) {
    stats.formatted++
  }
}

let stdoutBuffer = ''
proc.stdout!.on('data', (chunk: Buffer) => {
  stdoutBuffer += chunk.toString()
  const lines = stdoutBuffer.split('\n')
  stdoutBuffer = lines.pop() ?? ''
  lines.forEach(processLine)
})

let stderrBuffer = ''
proc.stderr!.on('data', (chunk: Buffer) => {
  stderrBuffer += chunk.toString()
  const lines = stderrBuffer.split('\n')
  stderrBuffer = lines.pop() ?? ''
  lines.forEach((line) => {
    if (line.trim()) process.stderr.write(line + '\n')
  })
})

proc.on('close', (code: number | null) => {
  if (stdoutBuffer.trim()) processLine(stdoutBuffer)
  if (stderrBuffer.trim()) process.stderr.write(stderrBuffer + '\n')

  if (code === 0) {
    console.log(cyan('▶ Prettier summary'))
    console.log(`  Total files checked : ${stats.total}`)
    console.log(`  Files reformatted   : ${stats.formatted}`)
    console.log(`  Already formatted   : ${stats.total - stats.formatted}`)
  } else {
    console.error(cyan('▶ Prettier failed — see errors above'))
  }

  process.exit(code ?? 1)
})
