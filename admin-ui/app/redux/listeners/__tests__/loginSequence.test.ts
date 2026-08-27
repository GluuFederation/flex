jest.mock('../../api/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), put: jest.fn(), post: jest.fn(), delete: jest.fn() },
}))
jest.mock('Orval', () => ({ setApiToken: jest.fn() }))
jest.mock('@/utils/logger', () => ({ logger: { error: jest.fn(), info: jest.fn() } }))

import { configureStore } from '@reduxjs/toolkit'
import mockAxiosDefault from '../../api/axios'
import { listenerMiddleware } from '../index'
import '../authListener'
import authReducer, { getAPIAccessToken } from '../../features/authSlice'
import { setHasSessionReader } from '../../api/sessionState'
import type { RootState } from '../../types'

type MockedAxios = { get: jest.Mock; put: jest.Mock; post: jest.Mock; delete: jest.Mock }
const ax = mockAxiosDefault as object as MockedAxios

const CONFIG_URL = '/admin-ui/config'
const TOKEN_URL = '/app/admin-ui/oauth2/api-protection-token'
const SESSION_URL = '/app/admin-ui/oauth2/session'

const buildStore = () =>
  configureStore({
    reducer: { authReducer },
    middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware),
  })

const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

const configRequest = () => ax.get.mock.calls.find(([url]) => url === CONFIG_URL)

describe('the login sequence decides credentials the way the browser sees them', () => {
  let store: ReturnType<typeof buildStore>

  beforeEach(() => {
    Object.values(ax).forEach((m) => m.mockReset())
    store = buildStore()
    setHasSessionReader(
      () => (store.getState() as object as RootState).authReducer?.hasSession ?? false,
    )
    ax.post.mockImplementation((url: string) => {
      if (url === TOKEN_URL) {
        return Promise.resolve({
          data: { access_token: 'api-token', scopes: ['read'], issuer: 'https://issuer.test' },
        })
      }
      return Promise.resolve({ data: {} })
    })
    ax.get.mockResolvedValue({ data: { postLogoutRedirectUri: 'https://app.test/logout' } })
  })

  afterEach(() => setHasSessionReader(() => false))

  it('sends the session cookie on /config, never the api protection token', async () => {
    store.dispatch(getAPIAccessToken('user-jwt'))
    await settle()
    await settle()

    expect(configRequest()).toBeDefined()
    expect(configRequest()?.[1]).toEqual({ withCredentials: true })
    expect(JSON.stringify(configRequest()?.[1])).not.toContain('api-token')
  })

  it('creates the session before it ever asks for the config', async () => {
    store.dispatch(getAPIAccessToken('user-jwt'))
    await settle()
    await settle()

    const sessionCall =
      ax.post.mock.invocationCallOrder[ax.post.mock.calls.findIndex(([url]) => url === SESSION_URL)]
    const configCall =
      ax.get.mock.invocationCallOrder[ax.get.mock.calls.findIndex(([url]) => url === CONFIG_URL)]

    expect(sessionCall).toBeLessThan(configCall)
    expect(store.getState().authReducer.hasSession).toBe(true)
  })

  it('falls back to the bearer token when the session cannot be created', async () => {
    ax.post.mockImplementation((url: string) => {
      if (url === TOKEN_URL) {
        return Promise.resolve({
          data: { access_token: 'api-token', scopes: ['read'], issuer: 'https://issuer.test' },
        })
      }
      return Promise.reject(new Error('session refused'))
    })

    store.dispatch(getAPIAccessToken('user-jwt'))
    await settle()
    await settle()

    expect(store.getState().authReducer.hasSession).toBe(false)
    expect(configRequest()?.[1]).toEqual({ headers: { Authorization: 'Bearer api-token' } })
  })
})
