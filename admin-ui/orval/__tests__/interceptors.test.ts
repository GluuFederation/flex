import { AxiosHeaders } from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { RootState } from '@/redux/types'
import { handleSessionExpired } from '@/redux/features/initSlice'

const mockFetchApiTokenWithDefaultScopes = jest.fn()
const mockDeleteAdminUiSession = jest.fn()
const mockCreateAdminUiSession = jest.fn()

jest.mock('@/redux/api/backend-api', () => ({
  SESSION_ENDPOINT: '/app/admin-ui/oauth2/session',
  API_PROTECTION_TOKEN_ENDPOINT: '/app/admin-ui/oauth2/api-protection-token',
  fetchApiTokenWithDefaultScopes: mockFetchApiTokenWithDefaultScopes,
  deleteAdminUiSession: mockDeleteAdminUiSession,
  createAdminUiSession: mockCreateAdminUiSession,
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
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

  it('never sends the api protection token alongside the session cookie', async () => {
    const { AXIOS_INSTANCE, installInterceptors, setApiToken } = await import('../index')

    setApiToken('api-protection-token')
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
    expect(config.headers.get('Authorization')).toBeUndefined()
  })

  it('strips an Authorization header a caller set explicitly once a session exists', async () => {
    const { AXIOS_INSTANCE, installInterceptors } = await import('../index')

    installInterceptors(
      () => ({ authReducer: { hasSession: true } }) as object as RootState,
      noopDispatch,
    )

    const requestHandler = (AXIOS_INSTANCE.interceptors.request as RequestInterceptorManager)
      .handlers[0]?.fulfilled

    const config = requestHandler?.({
      headers: new AxiosHeaders({ Authorization: 'Bearer leaked' }),
    }) as { headers: AxiosHeaders }

    expect(config.headers.get('Authorization')).toBeUndefined()
  })

  it('falls back to the api protection token when there is no session yet', async () => {
    const { AXIOS_INSTANCE, installInterceptors, setApiToken } = await import('../index')

    setApiToken('api-protection-token')
    installInterceptors(
      () =>
        ({ authReducer: { hasSession: false, issuer: null, userInum: '' } }) as object as RootState,
      noopDispatch,
    )

    const requestHandler = (AXIOS_INSTANCE.interceptors.request as RequestInterceptorManager)
      .handlers[0]?.fulfilled

    const config = requestHandler?.({ headers: new AxiosHeaders() }) as {
      withCredentials?: boolean
      headers: AxiosHeaders
    }

    expect(config.withCredentials).toBe(false)
    expect(config.headers.get('Authorization')).toBe('Bearer api-protection-token')
  })

  it('sends no Authorization at all when there is neither a session nor a token', async () => {
    const { AXIOS_INSTANCE, installInterceptors, setApiToken } = await import('../index')

    setApiToken(null)
    installInterceptors(
      () => ({ authReducer: { hasSession: false } }) as object as RootState,
      noopDispatch,
    )

    const requestHandler = (AXIOS_INSTANCE.interceptors.request as RequestInterceptorManager)
      .handlers[0]?.fulfilled

    const config = requestHandler?.({ headers: new AxiosHeaders() }) as { headers: AxiosHeaders }

    expect(config.headers.get('Authorization')).toBeUndefined()
  })

  it('opens the session-expired modal on a 403 response instead of signing out', async () => {
    const dispatch = jest.fn()
    const { AXIOS_INSTANCE, installInterceptors } = await import('../index')

    installInterceptors(() => ({ authReducer: {} }) as object as RootState, dispatch)

    const rejected = (AXIOS_INSTANCE.interceptors.response as ResponseInterceptorManager)
      .handlers[0]?.rejected

    const error = { config: {}, response: { status: 403 } }
    await expect(rejected?.(error)).rejects.toBe(error)

    expect(dispatch).toHaveBeenCalledWith(handleSessionExpired({ isSessionExpired: true }))
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(mockDeleteAdminUiSession).not.toHaveBeenCalled()
  })

  describe('backend client', () => {
    const signedInState = () =>
      ({
        authReducer: {
          issuer: 'https://issuer.example.com',
          userInum: '12345',
          userinfo_jwt: 'ujwt',
        },
      }) as object as RootState

    const loadBackendRejection = async () => {
      const { installInterceptors } = await import('../index')
      const { default: backendAxios } = await import('@/redux/api/axios')
      installInterceptors(signedInState, noopDispatch)
      return (backendAxios.interceptors.response as ResponseInterceptorManager).handlers[0]
        ?.rejected
    }

    it('renews the session on a 401 and retries with the session cookie', async () => {
      mockFetchApiTokenWithDefaultScopes.mockResolvedValue({ access_token: 'fresh-token' })
      mockCreateAdminUiSession.mockResolvedValue({})
      const adapter = jest.fn().mockResolvedValue({ status: 200, data: { ok: true }, headers: {} })
      const rejected = await loadBackendRejection()

      const error = {
        config: {
          url: '/admin-ui/config',
          headers: new AxiosHeaders({ Authorization: 'Bearer stale' }),
          adapter,
        },
        response: { status: 401 },
      }
      const response = await rejected?.(error)

      expect(mockCreateAdminUiSession).toHaveBeenCalledWith('ujwt', 'fresh-token')
      expect(response?.data).toEqual({ ok: true })
      const retried = adapter.mock.calls[0][0] as InternalAxiosRequestConfig
      expect(retried.withCredentials).toBe(true)
      expect(retried.headers.get('Authorization')).toBeUndefined()
    })

    it.each([
      '/app/admin-ui/oauth2/session',
      '/app/admin-ui/oauth2/api-protection-token',
      'https://issuer.example.com/jans-auth/restv1/userinfo',
    ])('does not try to renew the session when %s returns 401', async (url) => {
      const rejected = await loadBackendRejection()

      const error = { config: { url }, response: { status: 401 } }
      await expect(rejected?.(error)).rejects.toBe(error)
      expect(mockCreateAdminUiSession).not.toHaveBeenCalled()
    })
  })
})
