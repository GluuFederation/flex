import { REGEX_URL_PLACEHOLDER, REGEX_WEBHOOK_URL } from '@/utils/regex'

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
  if (
    hostname === 'localhost' ||
    hostname === '::1' ||
    hostname === '::' ||
    hostname === '0.0.0.0' ||
    hostname === '255.255.255.255' ||
    hostname.startsWith('0.')
  ) {
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
  const cgnatMatch = hostname.match(/^100\.(\d+)\./)
  if (cgnatMatch) {
    const secondOctet = parseInt(cgnatMatch[1], 10)
    if (secondOctet >= 64 && secondOctet <= 127) {
      return true
    }
  }
  const match = hostname.match(/^172\.(\d+)\./)
  if (match) {
    const secondOctet = parseInt(match[1], 10)
    if (secondOctet >= 16 && secondOctet <= 31) {
      return true
    }
  }

  if (hostname.includes(':')) {
    if (hostname.startsWith('::ffff:')) {
      return true
    }
    if (hostname.startsWith('fc') || hostname.startsWith('fd')) {
      return true
    }
    if (
      hostname.startsWith('fe8') ||
      hostname.startsWith('fe9') ||
      hostname.startsWith('fea') ||
      hostname.startsWith('feb')
    ) {
      return true
    }
    if (hostname.startsWith('2001:db8:') || hostname.startsWith('ff')) {
      return true
    }
  }

  return false
}

const normalizeUrlForValidation = (url: string): string =>
  url.replace(REGEX_URL_PLACEHOLDER, (match, offset, fullString) => {
    const beforeMatch = fullString.slice(0, offset)
    const afterMatch = fullString.slice(offset + match.length)
    const isPortPosition = beforeMatch.endsWith(':') && !afterMatch.startsWith('@')
    return isPortPosition ? '8080' : 'x'
  })

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
  if (url === undefined || url === null) {
    return false
  }
  const normalized = normalizeUrlForValidation(url)
  if (!isAllowed(normalized)) {
    return false
  }
  return REGEX_WEBHOOK_URL.test(normalized)
}

export { isAllowed }
