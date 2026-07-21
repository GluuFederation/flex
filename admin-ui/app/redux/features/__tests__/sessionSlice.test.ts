import reducer, { auditLogoutLogs, auditLogoutLogsResponse, setLandingPath } from '../sessionSlice'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('sessionSlice', () => {
  it('returns the initial state', () => {
    expect(getInitial()).toEqual({ logoutAuditSucceeded: null, landingPath: null })
  })

  it('auditLogoutLogs resets the audit result to null', () => {
    const state = reducer(
      { logoutAuditSucceeded: true, landingPath: null },
      auditLogoutLogs({ message: 'm' }),
    )
    expect(state.logoutAuditSucceeded).toBeNull()
  })

  it('setLandingPath stores the resolved landing route', () => {
    expect(reducer(getInitial(), setLandingPath('/home/dashboard')).landingPath).toBe(
      '/home/dashboard',
    )
  })

  it('auditLogoutLogsResponse stores the boolean result', () => {
    expect(reducer(getInitial(), auditLogoutLogsResponse(true)).logoutAuditSucceeded).toBe(true)
    expect(reducer(getInitial(), auditLogoutLogsResponse(false)).logoutAuditSucceeded).toBe(false)
  })
})
