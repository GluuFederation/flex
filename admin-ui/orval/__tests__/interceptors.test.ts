import { AxiosHeaders } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { RootState } from '@/redux/types'

const mockFetchApiTokenWithDefaultScopes = jest.fn()
const mockDeleteAdminUiSession = jest.fn()
const mockCreateAdminUiSession = jest.fn()

jest.mock('@/redux/api/backend-api', () => ({
  fetchApiTokenWithDefaultScopes: mockFetchApiTokenWithDefaultScopes,
  deleteAdminUiSession: mockDeleteAdminUiSession,
  createAdminUiSession: mockCreateAdminUiSession,
}))

jest.mock('@/utils/devLogger', () => ({
  devLogger: {
    error: jest.fn(),
  },
}))

describe('orval interceptors', () => {
  type RequestInterceptorManager = {
    handlers: Array<{
      fulfilled: (value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
    }>
  }

  beforeEach(() => {
    jest.resetModules()
    mockFetchApiTokenWithDefaultScopes.mockReset()
    mockDeleteAdminUiSession.mockReset()
    mockCreateAdminUiSession.mockReset()
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
})
