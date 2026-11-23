const SESSION_ENDED_KEY = 'sessionEnded'
const FLAG_VALUE = 'true'

const markSessionEnded = (): void => {
  try {
    window.sessionStorage.setItem(SESSION_ENDED_KEY, FLAG_VALUE)
  } catch {
    return
  }
}

const isSessionEnded = (): boolean => {
  try {
    return window.sessionStorage.getItem(SESSION_ENDED_KEY) === FLAG_VALUE
  } catch {
    return false
  }
}

const clearSessionEnded = (): void => {
  try {
    window.sessionStorage.removeItem(SESSION_ENDED_KEY)
  } catch {
    return
  }
}

export { markSessionEnded, isSessionEnded, clearSessionEnded }
