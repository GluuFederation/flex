export function downloadJSONFile(data: unknown, filename: string = 'ssa.json'): void {
  let jsonData: string
  try {
    jsonData = JSON.stringify(data, null, 2)
  } catch (error) {
    throw new Error(
      `Failed to serialize data to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
