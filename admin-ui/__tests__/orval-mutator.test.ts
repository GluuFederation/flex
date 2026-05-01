import { AxiosHeaders } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const mockGetRootState = jest.fn()
const mockFetchApiTokenWithDefaultScopes = jest.fn()
const mockDeleteAdminUiSession = jest.fn()

jest.mock('../app/redux/hooks', () => ({
  getRootState: () => mockGetRootState(),
}))

jest.mock('../app/redux/api/backend-api', () => ({
  fetchApiTokenWithDefaultScopes: mockFetchApiTokenWithDefaultScopes,
  deleteAdminUiSession: mockDeleteAdminUiSession,
}))

jest.mock('../app/utils/devLogger', () => ({
  devLogger: {
    error: jest.fn(),
  },
}))

describe('orval-mutator request interceptor', () => {
  type RequestInterceptorManager = {
    handlers: Array<{
      fulfilled: (value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
    }>
  }

  beforeEach(() => {
    jest.resetModules()
    mockGetRootState.mockReset()
    mockFetchApiTokenWithDefaultScopes.mockReset()
    mockDeleteAdminUiSession.mockReset()
  })

  it('attaches session credentials and standard headers when a session exists', async () => {
    mockGetRootState.mockReturnValue({
      authReducer: {
        hasSession: true,
        issuer: 'https://issuer.example.com',
        userInum: '12345',
      },
    })

    const { AXIOS_INSTANCE } = await import('../orval-mutator')
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
    mockGetRootState.mockReturnValue({
      authReducer: {
        hasSession: false,
        issuer: null,
        userInum: '',
      },
    })

    const { AXIOS_INSTANCE } = await import('../orval-mutator')
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
})
