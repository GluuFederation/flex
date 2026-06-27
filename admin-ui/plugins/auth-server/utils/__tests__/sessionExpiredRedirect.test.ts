import { redirectSessionExpired } from '../sessionExpiredRedirect'
import store from '@/redux/store'
import { auditLogoutLogs } from '@/redux/features/sessionSlice'
import { fetchApiTokenWithDefaultScopes, deleteAdminUiSession } from '@/redux/api/backend-api'
import { SESSION_EXPIRED } from '@/audit/messages'

jest.mock('@/redux/api/backend-api')

const mockedFetchToken = fetchApiTokenWithDefaultScopes as jest.MockedFunction<
  typeof fetchApiTokenWithDefaultScopes
>
const mockedDeleteSession = deleteAdminUiSession as jest.MockedFunction<typeof deleteAdminUiSession>

describe('redirectSessionExpired', () => {
  let dispatchSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    dispatchSpy = jest.spyOn(store, 'dispatch')
  })

  afterEach(() => dispatchSpy.mockRestore())

  it('dispatches the audit log and cleans up the session', async () => {
    mockedFetchToken.mockResolvedValue({ access_token: 'tok' } as never)
    mockedDeleteSession.mockResolvedValue({} as never)

    await redirectSessionExpired()

    expect(dispatchSpy).toHaveBeenCalledWith(auditLogoutLogs({ message: SESSION_EXPIRED }))
    expect(mockedFetchToken).toHaveBeenCalled()
    expect(mockedDeleteSession).toHaveBeenCalledWith('tok')
  })

  it('dispatches with a custom message and swallows a session cleanup failure', async () => {
    mockedFetchToken.mockResolvedValue({ access_token: 'tok' } as never)
    mockedDeleteSession.mockRejectedValue(new Error('delete failed'))

    await expect(redirectSessionExpired('custom message')).resolves.toBeUndefined()

    expect(dispatchSpy).toHaveBeenCalledWith(auditLogoutLogs({ message: 'custom message' }))
    expect(mockedDeleteSession).toHaveBeenCalledWith('tok')
  })
})
