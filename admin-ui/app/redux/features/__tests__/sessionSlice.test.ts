import reducer, { auditLogoutLogs, setLandingPath } from '../sessionSlice'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('sessionSlice', () => {
  it('returns the initial state', () => {
    expect(getInitial()).toEqual({ landingPath: null, logoutRequested: false })
  })

  it('auditLogoutLogs flags that a logout was requested', () => {
    const state = reducer(
      { landingPath: '/home/dashboard', logoutRequested: false },
      auditLogoutLogs({ message: 'm' }),
    )
    expect(state.logoutRequested).toBe(true)
    expect(state.landingPath).toBe('/home/dashboard')
  })

  it('setLandingPath stores the resolved landing route', () => {
    expect(reducer(getInitial(), setLandingPath('/home/dashboard')).landingPath).toBe(
      '/home/dashboard',
    )
  })
})
