export function downloadJSONFile(data: unknown, filename: string = 'ssa.json'): () => void {
  const jsonData = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonData], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  return () => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
