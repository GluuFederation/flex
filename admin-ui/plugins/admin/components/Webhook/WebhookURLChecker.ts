const NOT_ALLOWED: string[] = [
  'http://',
  'ftp://',
  'file://',
  'telnet://',
  'smb://',
  'ssh://',
  'ldap://',
  'https://192.168',
  'https://127.0',
  'https://172',
  'https://localhost',
]

const PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(:\d+)?(\/([\w\-.]|\$\{[\w]+\})*)*$/i

const isAllowed = (url: string): boolean => {
  for (const blocked of NOT_ALLOWED) {
    if (url.startsWith(blocked)) {
      return false
    }
  }
  return true
}

export const isValid = (url: string | undefined | null): boolean => {
  if (url === undefined || url === null || !isAllowed(url)) {
    return false
  }
  return PATTERN.test(url)
}

export { isAllowed }
