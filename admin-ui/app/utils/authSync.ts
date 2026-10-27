import { APP_BASE_URL } from '@/helpers/navigation'
import { STORAGE_KEYS } from '@/constants'
import { markForceLogin } from '@/utils/forceLogin'
import { sessionStore, storage } from '@/utils/storage'

let signedInAt = 0

const goToStart = (): void => {
  window.location.replace(APP_BASE_URL)
}

export const markSignedIn = (): void => {
  signedInAt = Date.now()
  sessionStore.remove(STORAGE_KEYS.SIGN_IN_RESTARTED)
}

export const markSignedOut = (): void => {
  storage.set(STORAGE_KEYS.SIGNED_OUT_AT, String(Date.now()))
}

export const isSignedOutSinceSignIn = (): boolean =>
  Number(storage.get(STORAGE_KEYS.SIGNED_OUT_AT)) > signedInAt

export const leaveAfterSignOut = (): void => {
  markForceLogin()
  goToStart()
}

export const restartSignInOnce = (): boolean => {
  if (sessionStore.get(STORAGE_KEYS.SIGN_IN_RESTARTED)) return false
  sessionStore.set(STORAGE_KEYS.SIGN_IN_RESTARTED, 'true')
  goToStart()
  return true
}

export const watchSignOutInOtherTabs = (onSignOut: () => void): (() => void) => {
  const checkSignedOut = () => {
    if (isSignedOutSinceSignIn()) onSignOut()
  }
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.SIGNED_OUT_AT) checkSignedOut()
  }
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') checkSignedOut()
  }
  window.addEventListener('storage', handleStorage)
  document.addEventListener('visibilitychange', handleVisibility)
  return () => {
    window.removeEventListener('storage', handleStorage)
    document.removeEventListener('visibilitychange', handleVisibility)
  }
}
