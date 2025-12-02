const BLOCKED_SCHEMES = [
  'http',
  'ftp',
  'file',
  'telnet',
  'smb',
  'ssh',
  'ldap',
  'gopher',
  'dict',
  'tftp',
]

const isPrivateOrLocalhost = (hostname: string): boolean => {
  if (hostname === 'localhost' || hostname === '::1' || hostname === '0.0.0.0') {
    return true
  }
  if (
    hostname.startsWith('127.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('169.254.')
  ) {
    return true
  }
  const match = hostname.match(/^172\.(\d+)\./)
  if (match) {
    const secondOctet = parseInt(match[1], 10)
    if (secondOctet >= 16 && secondOctet <= 31) {
      return true
    }
  }
  if (hostname.startsWith('fc') || hostname.startsWith('fd')) {
    return true
  }
  if (hostname.startsWith('fe80:')) {
    return true
  }
  return false
}

const PATTERN = /^https:\/\/([\w-]+\.)+[\w-]+(:\d+)?(\/([\w\-.]|\$\{[\w]+\})*)*$/i

const isAllowed = (url: string): boolean => {
  try {
    const parsed = new URL(url)

    if (BLOCKED_SCHEMES.includes(parsed.protocol.replace(':', ''))) {
      return false
    }

    if (isPrivateOrLocalhost(parsed.hostname)) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export const isValid = (url: string | undefined | null): boolean => {
  if (url === undefined || url === null || !isAllowed(url)) {
    return false
  }
  return PATTERN.test(url)
}

export { isAllowed }
