const NO_ROLE_SIGN_OUT_KEY = 'noRoleSignOut'
const FLAG_VALUE = 'true'

const markNoRoleSignOut = (): void => {
  try {
    window.sessionStorage.setItem(NO_ROLE_SIGN_OUT_KEY, FLAG_VALUE)
  } catch {
    return
  }
}

const isNoRoleSignOut = (): boolean => {
  try {
    return window.sessionStorage.getItem(NO_ROLE_SIGN_OUT_KEY) === FLAG_VALUE
  } catch {
    return false
  }
}

const clearNoRoleSignOut = (): void => {
  try {
    window.sessionStorage.removeItem(NO_ROLE_SIGN_OUT_KEY)
  } catch {
    return
  }
}

export { markNoRoleSignOut, isNoRoleSignOut, clearNoRoleSignOut }
