export const formatExpirationDate = (expirationTimestamp: number): string => {
  if (!expirationTimestamp) {
    return 'Never'
  }

  return new Date(expirationTimestamp * 1000).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
}
