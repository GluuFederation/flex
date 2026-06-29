import reducer, { auditLogoutLogs, auditLogoutLogsResponse } from '../sessionSlice'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('sessionSlice', () => {
  it('returns the initial state', () => {
    expect(getInitial()).toEqual({ logoutAuditSucceeded: null })
  })

  it('auditLogoutLogs resets the audit result to null', () => {
    const state = reducer({ logoutAuditSucceeded: true }, auditLogoutLogs({ message: 'm' }))
    expect(state.logoutAuditSucceeded).toBeNull()
  })

  it('auditLogoutLogsResponse stores the boolean result', () => {
    expect(reducer(getInitial(), auditLogoutLogsResponse(true)).logoutAuditSucceeded).toBe(true)
    expect(reducer(getInitial(), auditLogoutLogsResponse(false)).logoutAuditSucceeded).toBe(false)
  })
})
