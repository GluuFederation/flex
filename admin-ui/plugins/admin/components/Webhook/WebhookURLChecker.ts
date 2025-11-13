const BLOCKED_PROTOCOLS: string[] = [
  'http://',
  'ftp://',
  'file://',
  'telnet://',
  'smb://',
  'ssh://',
  'ldap://',
  'gopher://',
  'dict://',
  'data://',
  'javascript:',
]

const PRIVATE_IP_PATTERNS: RegExp[] = [
  /^https?:\/\/(10\.\d{1,3}\.\d{1,3}\.\d{1,3})/i,
  /^https?:\/\/(192\.168\.\d{1,3}\.\d{1,3})/i,
  /^https?:\/\/(172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3})/i,
  /^https?:\/\/(127\.\d{1,3}\.\d{1,3}\.\d{1,3})/i,
  /^https?:\/\/(localhost|0\.0\.0\.0)/i,
  /^https?:\/\/\[::1\]/i,
  /^https?:\/\/\[fe80:/i,
  /^https?:\/\/\[fc00:/i,
  /^https?:\/\/\[fd00:/i,
]

const DANGEROUS_PORTS: number[] = [
  22, 23, 25, 110, 143, 445, 3306, 5432, 6379, 27017, 3389, 5900, 21, 69, 514, 873,
]

export const isValid = (url: string | undefined | null): boolean => {
  if (!url) return false

  const normalizedUrl = url.trim()
  if (!normalizedUrl) return false

  const lowerUrl = normalizedUrl.toLowerCase()

  if (!hasValidProtocol(lowerUrl)) return false

  if (hasBlockedProtocol(lowerUrl)) return false

  if (hasPrivateIP(normalizedUrl)) return false

  if (hasCredentials(normalizedUrl)) return false

  try {
    const urlObj = new URL(normalizedUrl)

    if (urlObj.protocol !== 'https:') return false

    if (hasDangerousPort(urlObj)) return false

    if (isIPAddress(urlObj.hostname)) return false

    if (!hasValidHostname(urlObj.hostname)) return false

    return true
  } catch {
    return false
  }
}

const hasValidProtocol = (url: string): boolean => {
  return url.startsWith('https://')
}

const hasBlockedProtocol = (url: string): boolean => {
  return BLOCKED_PROTOCOLS.some((protocol) => url.startsWith(protocol))
}

const hasPrivateIP = (url: string): boolean => {
  return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(url))
}

const hasCredentials = (url: string): boolean => {
  try {
    const urlWithoutProtocol = url.split('//')[1] || ''
    const hostPart = urlWithoutProtocol.split('/')[0] || ''
    return hostPart.includes('@')
  } catch {
    return false
  }
}

const hasDangerousPort = (urlObj: URL): boolean => {
  if (!urlObj.port) return false

  const port = parseInt(urlObj.port, 10)
  return DANGEROUS_PORTS.includes(port)
}

const isIPAddress = (hostname: string): boolean => {
  const ipv4Pattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  const ipv6Pattern = /^\[?[0-9a-f:]+\]?$/i
  return ipv4Pattern.test(hostname) || ipv6Pattern.test(hostname)
}

const hasValidHostname = (hostname: string): boolean => {
  if (!hostname || hostname.length > 253) return false

  if (hostname === 'localhost' || hostname === '0.0.0.0') return false

  const domainPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i
  return domainPattern.test(hostname)
}
