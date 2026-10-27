import { STORAGE_KEYS } from '@/constants'

const loadAuthSync = async () => {
  jest.resetModules()
  return import('../authSync')
}

const signOutEvent = () =>
  new StorageEvent('storage', { key: STORAGE_KEYS.SIGNED_OUT_AT, newValue: String(Date.now()) })

describe('authSync', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-10-21T10:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('isSignedOutSinceSignIn', () => {
    it('is false when no sign-out was recorded', async () => {
      const { markSignedIn, isSignedOutSinceSignIn } = await loadAuthSync()
      markSignedIn()

      expect(isSignedOutSinceSignIn()).toBe(false)
    })

    it('is true when a sign-out was recorded after this tab signed in', async () => {
      const { markSignedIn, markSignedOut, isSignedOutSinceSignIn } = await loadAuthSync()
      markSignedIn()
      jest.advanceTimersByTime(1000)
      markSignedOut()

      expect(isSignedOutSinceSignIn()).toBe(true)
    })

    it('ignores a sign-out recorded before this tab signed in', async () => {
      const { markSignedIn, markSignedOut, isSignedOutSinceSignIn } = await loadAuthSync()
      markSignedOut()
      jest.advanceTimersByTime(1000)
      markSignedIn()

      expect(isSignedOutSinceSignIn()).toBe(false)
    })
  })

  it('asks for the password on the next sign-in after leaving', async () => {
    const { leaveAfterSignOut } = await loadAuthSync()

    leaveAfterSignOut()

    expect(window.sessionStorage.getItem('forceLogin')).toBe('true')
  })

  it('restarts sign-in only once until the next successful sign-in', async () => {
    const { markSignedIn, restartSignInOnce } = await loadAuthSync()

    expect(restartSignInOnce()).toBe(true)
    expect(restartSignInOnce()).toBe(false)

    markSignedIn()

    expect(restartSignInOnce()).toBe(true)
  })

  describe('watchSignOutInOtherTabs', () => {
    const originalVisibility = Object.getOwnPropertyDescriptor(document, 'visibilityState')

    afterEach(() => {
      if (originalVisibility) {
        Object.defineProperty(document, 'visibilityState', originalVisibility)
      } else {
        delete (document as { visibilityState?: DocumentVisibilityState }).visibilityState
      }
    })

    it('reacts when another tab records a sign-out', async () => {
      const { markSignedIn, watchSignOutInOtherTabs } = await loadAuthSync()
      markSignedIn()
      const onSignOut = jest.fn()
      const stop = watchSignOutInOtherTabs(onSignOut)

      jest.advanceTimersByTime(1000)
      window.localStorage.setItem(STORAGE_KEYS.SIGNED_OUT_AT, String(Date.now()))
      window.dispatchEvent(signOutEvent())

      expect(onSignOut).toHaveBeenCalledTimes(1)
      stop()
    })

    it('ignores changes to other keys', async () => {
      const { markSignedIn, watchSignOutInOtherTabs } = await loadAuthSync()
      markSignedIn()
      const onSignOut = jest.fn()
      const stop = watchSignOutInOtherTabs(onSignOut)

      jest.advanceTimersByTime(1000)
      window.localStorage.setItem(STORAGE_KEYS.SIGNED_OUT_AT, String(Date.now()))
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEYS.INIT_THEME }))

      expect(onSignOut).not.toHaveBeenCalled()
      stop()
    })

    it('catches a sign-out it missed once the tab is visible again', async () => {
      const { markSignedIn, watchSignOutInOtherTabs } = await loadAuthSync()
      markSignedIn()
      const onSignOut = jest.fn()
      const stop = watchSignOutInOtherTabs(onSignOut)

      jest.advanceTimersByTime(1000)
      window.localStorage.setItem(STORAGE_KEYS.SIGNED_OUT_AT, String(Date.now()))
      Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
      document.dispatchEvent(new Event('visibilitychange'))

      expect(onSignOut).toHaveBeenCalledTimes(1)
      stop()
    })

    it('stops listening once removed', async () => {
      const { markSignedIn, watchSignOutInOtherTabs } = await loadAuthSync()
      markSignedIn()
      const onSignOut = jest.fn()
      const stop = watchSignOutInOtherTabs(onSignOut)
      stop()

      jest.advanceTimersByTime(1000)
      window.localStorage.setItem(STORAGE_KEYS.SIGNED_OUT_AT, String(Date.now()))
      window.dispatchEvent(signOutEvent())

      expect(onSignOut).not.toHaveBeenCalled()
    })
  })
})
