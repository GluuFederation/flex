const FORCE_LOGIN_KEY = 'forceLogin'
const FLAG_VALUE = 'true'

const markForceLogin = (): void => {
  try {
    window.sessionStorage.setItem(FORCE_LOGIN_KEY, FLAG_VALUE)
  } catch {
    return
  }
}

const isForceLogin = (): boolean => {
  try {
    return window.sessionStorage.getItem(FORCE_LOGIN_KEY) === FLAG_VALUE
  } catch {
    return false
  }
}

const clearForceLogin = (): void => {
  try {
    window.sessionStorage.removeItem(FORCE_LOGIN_KEY)
  } catch {
    return
  }
}

export { markForceLogin, isForceLogin, clearForceLogin }
