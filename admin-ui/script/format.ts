import { readFileSync } from 'node:fs'
import { spawn, ChildProcess } from 'node:child_process'
import { REGEX_PRETTIER_TIMESTAMP, REGEX_PRETTIER_FILE_PATH } from '../app/utils/regex'

type FormatStats = {
  total: number
  formatted: number
  reformattedFiles: Array<{ path: string; lines: number }>
}

const ESC = '\x1b'
const cyan = (s: string): string => `${ESC}[36m${s}${ESC}[0m`
const yellow = (s: string): string => `${ESC}[33m${s}${ESC}[0m`

const prettierCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'

const proc: ChildProcess = spawn(
  prettierCommand,
  ['prettier', '--write', '**/*.{js,jsx,ts,tsx,json,css,scss}'],
  {
    shell: false,
    stdio: ['inherit', 'pipe', 'pipe'],
  },
)

const stats: FormatStats = { total: 0, formatted: 0, reformattedFiles: [] }

const countLines = (filePath: string): number => {
  const content = readFileSync(filePath, 'utf8')
  return content === '' ? 0 : content.split('\n').length - (content.endsWith('\n') ? 1 : 0)
}

const processLine = (line: string): void => {
  if (!line.trim()) return
  process.stdout.write(line + '\n')
  if (line.startsWith('[')) return
  const hasTimestamp = REGEX_PRETTIER_TIMESTAMP.test(line)
  if (!hasTimestamp) return
  stats.total++
  if (!line.includes('(unchanged)') && !line.includes('(cached)')) {
    stats.formatted++
    const match = REGEX_PRETTIER_FILE_PATH.exec(line)
    if (match) {
      const filePath = match[1]
      stats.reformattedFiles.push({ path: filePath, lines: countLines(filePath) })
    }
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
    if (stats.reformattedFiles.length > 0) {
      console.log(cyan('\n▶ Reformatted files'))
      stats.reformattedFiles.forEach(({ path, lines }) => {
        console.log(`  ${yellow(path)} (${lines} lines)`)
      })
    }
  } else {
    console.error(cyan('▶ Prettier failed — see errors above'))
  }

  process.exit(code ?? 1)
})
