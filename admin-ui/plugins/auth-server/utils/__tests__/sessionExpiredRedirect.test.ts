import { redirectSessionExpired } from '../sessionExpiredRedirect'
import store from '@/redux/store'
import { auditLogoutLogs } from '@/redux/features/sessionSlice'
import { SESSION_EXPIRED } from '@/audit/messages'

describe('redirectSessionExpired', () => {
  let dispatchSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    dispatchSpy = jest.spyOn(store, 'dispatch')
  })

  afterEach(() => dispatchSpy.mockRestore())

  it('dispatches the logout audit with the default message', () => {
    redirectSessionExpired()

    expect(dispatchSpy).toHaveBeenCalledWith(auditLogoutLogs({ message: SESSION_EXPIRED }))
  })

  it('dispatches the logout audit with a custom message', () => {
    redirectSessionExpired('custom message')

    expect(dispatchSpy).toHaveBeenCalledWith(auditLogoutLogs({ message: 'custom message' }))
  })
})
