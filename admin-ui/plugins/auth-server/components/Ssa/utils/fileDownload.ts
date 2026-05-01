import { REGEX_DATE_SEPARATOR_CHARS, REGEX_WHITESPACE_CHAR } from '@/utils/regex'

export const downloadJwtFile = (jwtString: string, softwareId: string): void => {
  const blob = new Blob([jwtString], { type: 'text/plain' })
  const link = document.createElement('a')
  const objectUrl = URL.createObjectURL(blob)
  link.href = objectUrl
  const dateStr = new Date()
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(REGEX_DATE_SEPARATOR_CHARS, '-')
    .replace(REGEX_WHITESPACE_CHAR, '_')
  link.download = `ssa-${softwareId}-${dateStr}.jwt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(objectUrl)
}

export const downloadJSONFile = (data: object, filename: string = 'ssa.json'): void => {
  let jsonData: string
  try {
    jsonData = JSON.stringify(data, null, 2)
  } catch (error) {
    throw new Error(
      `Failed to serialize data to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { cause: error },
    )
  }

  const blob = new Blob([jsonData], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
