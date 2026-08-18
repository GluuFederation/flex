import { reducer } from '../initSlice'
import { handleApiTimeout, handleSessionExpired } from '../initSlice'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('initSlice', () => {
  it('returns the initial state', () => {
    expect(getInitial()).toEqual({ isTimeout: false, isSessionExpired: false })
  })

  it('handleApiTimeout sets isTimeout from the payload', () => {
    expect(reducer(getInitial(), handleApiTimeout({ isTimeout: true })).isTimeout).toBe(true)
    expect(reducer(getInitial(), handleApiTimeout({ isTimeout: false })).isTimeout).toBe(false)
  })
})

describe('initSlice session expiry', () => {
  it('handleSessionExpired sets isSessionExpired from the payload', () => {
    expect(
      reducer(getInitial(), handleSessionExpired({ isSessionExpired: true })).isSessionExpired,
    ).toBe(true)
  })

  // The two states are independent: a dead session and a slow request need different messages.
  it('keeps session expiry separate from request timeout', () => {
    const expired = reducer(getInitial(), handleSessionExpired({ isSessionExpired: true }))
    expect(expired.isTimeout).toBe(false)

    const timedOut = reducer(getInitial(), handleApiTimeout({ isTimeout: true }))
    expect(timedOut.isSessionExpired).toBe(false)
  })
})
