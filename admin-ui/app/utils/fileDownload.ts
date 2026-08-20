const downloadTextFile = (content: string, fileName: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType })
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = fileName

  try {
    document.body.appendChild(link)
    link.click()
  } finally {
    link.remove()
    URL.revokeObjectURL(objectUrl)
  }
}

export { downloadTextFile }
