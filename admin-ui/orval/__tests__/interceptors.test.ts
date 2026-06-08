import { AxiosHeaders } from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { RootState } from '@/redux/types'
import { auditLogoutLogs } from '@/redux/features/sessionSlice'
import { SESSION_EXPIRED } from '@/audit/messages'

const mockFetchApiTokenWithDefaultScopes = jest.fn()
const mockDeleteAdminUiSession = jest.fn()
const mockCreateAdminUiSession = jest.fn()

jest.mock('@/redux/api/backend-api', () => ({
  fetchApiTokenWithDefaultScopes: mockFetchApiTokenWithDefaultScopes,
  deleteAdminUiSession: mockDeleteAdminUiSession,
  createAdminUiSession: mockCreateAdminUiSession,
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}))

describe('orval interceptors', () => {
  type RequestInterceptorManager = {
    handlers: Array<{
      fulfilled: (value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
    }>
  }

  type ResponseRejection = {
    config: Partial<InternalAxiosRequestConfig>
    response?: { status?: number }
  }

  type ResponseInterceptorManager = {
    handlers: Array<{
      fulfilled: (value: AxiosResponse) => AxiosResponse
      rejected: (error: ResponseRejection) => Promise<AxiosResponse>
    }>
  }

  const noopDispatch = jest.fn()

  beforeEach(() => {
    jest.resetModules()
    mockFetchApiTokenWithDefaultScopes.mockReset()
    mockDeleteAdminUiSession.mockReset()
    mockCreateAdminUiSession.mockReset()
    noopDispatch.mockReset()
  })

  it('attaches session credentials and standard headers when a session exists', async () => {
    const { AXIOS_INSTANCE, installInterceptors } = await import('../index')

    installInterceptors(
      () =>
        ({
          authReducer: {
            hasSession: true,
            issuer: 'https://issuer.example.com',
            userInum: '12345',
          },
        }) as object as RootState,
      noopDispatch,
    )

    const requestHandler = (AXIOS_INSTANCE.interceptors.request as RequestInterceptorManager)
      .handlers[0]?.fulfilled

    const config = requestHandler?.({ headers: new AxiosHeaders() }) as {
      withCredentials?: boolean
      headers: AxiosHeaders
    }

    expect(config.withCredentials).toBe(true)
    expect(config.headers.get('issuer')).toBe('https://issuer.example.com')
    expect(config.headers.get('jans-client')).toBe('admin-ui')
    expect(config.headers.get('User-inum')).toBe('12345')
  })

  it('disables session credentials when no Admin UI session exists', async () => {
    const { AXIOS_INSTANCE, installInterceptors } = await import('../index')

    installInterceptors(
      () =>
        ({
          authReducer: {
            hasSession: false,
            issuer: null,
            userInum: '',
          },
        }) as object as RootState,
      noopDispatch,
    )

    const requestHandler = (AXIOS_INSTANCE.interceptors.request as RequestInterceptorManager)
      .handlers[0]?.fulfilled

    const config = requestHandler?.({ headers: new AxiosHeaders() }) as {
      withCredentials?: boolean
      headers: AxiosHeaders
    }

    expect(config.withCredentials).toBe(false)
    expect(config.headers.get('jans-client')).toBe('admin-ui')
    expect(config.headers.get('issuer')).toBeUndefined()
    expect(config.headers.get('User-inum')).toBeUndefined()
  })

  it('audits the forced logout and cleans up the session on a 403 response', async () => {
    mockFetchApiTokenWithDefaultScopes.mockResolvedValue({ access_token: 'token-403' })
    mockDeleteAdminUiSession.mockResolvedValue(undefined)

    const dispatch = jest.fn()
    const { AXIOS_INSTANCE, installInterceptors } = await import('../index')

    installInterceptors(() => ({ authReducer: {} }) as object as RootState, dispatch)

    const rejected = (AXIOS_INSTANCE.interceptors.response as ResponseInterceptorManager)
      .handlers[0]?.rejected

    const error = { config: {}, response: { status: 403 } }
    await expect(rejected?.(error)).rejects.toBe(error)

    expect(dispatch).toHaveBeenCalledWith(auditLogoutLogs({ message: SESSION_EXPIRED }))
    expect(mockFetchApiTokenWithDefaultScopes).toHaveBeenCalled()
    expect(mockDeleteAdminUiSession).toHaveBeenCalledWith('token-403')
  })
})
