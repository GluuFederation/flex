const NOT_ALLOWED = [
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
const PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(:\d+)?(\/[\w-.]*)*$/i

export const isValid = (url) => {
  if (url === undefined || url === null || !isAllowed(url)) {
    return false
  } else {
    return PATTERN.test(url)
  }
}

const isAllowed = (url) => {
  let result = true
  for (const extention in NOT_ALLOWED) {
    if (url.startsWith(NOT_ALLOWED[extention])) {
      result = false
      break
    }
  }
  return result
}
