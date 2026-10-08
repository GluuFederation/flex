import { reducer, handleSessionExpired } from '../initSlice'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('initSlice', () => {
  it('returns the initial state', () => {
    expect(getInitial()).toEqual({ isSessionExpired: false })
  })

  it('handleSessionExpired sets isSessionExpired from the payload', () => {
    expect(
      reducer(getInitial(), handleSessionExpired({ isSessionExpired: true })).isSessionExpired,
    ).toBe(true)
    expect(
      reducer(getInitial(), handleSessionExpired({ isSessionExpired: false })).isSessionExpired,
    ).toBe(false)
  })
})
