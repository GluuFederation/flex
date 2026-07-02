// Mock the shared axios instance so endpoint/URL/header/branch behavior can be
// asserted without a live server. The mock methods are created inside the
// factory (avoiding the hoisting TDZ) and pulled back out via the default export.
jest.mock('../axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), put: jest.fn(), post: jest.fn(), delete: jest.fn() },
}))
jest.mock('@/utils/logger', () => ({ logger: { error: jest.fn() } }))
jest.mock('@/utils/apiErrorMessage', () => ({ resolveApiErrorMessage: (e: Error) => e.message }))

import mockAxiosDefault from '../axios'

import {
  fetchServerConfiguration,
  putServerConfiguration,
  fetchUserInformation,
  postUserAction,
  fetchApiTokenWithDefaultScopes,
  fetchPolicyStore,
  createAdminUiSession,
  deleteAdminUiSession,
  SESSION_ENDPOINT,
} from '../backend-api'

type MockedAxios = { get: jest.Mock; put: jest.Mock; post: jest.Mock; delete: jest.Mock }
const ax = mockAxiosDefault as object as MockedAxios

beforeEach(() => Object.values(ax).forEach((m) => m.mockReset()))

describe('backend-api auth config', () => {
  it('uses a bearer header when a token is supplied', async () => {
    ax.get.mockResolvedValue({ data: { ok: true } })
    await fetchServerConfiguration('tok')
    expect(ax.get).toHaveBeenCalledWith('/admin-ui/config', {
      headers: { Authorization: 'Bearer tok' },
    })
  })

  it('falls back to credentialed cookies when no token is supplied', async () => {
    ax.get.mockResolvedValue({ data: {} })
    await fetchServerConfiguration()
    expect(ax.get).toHaveBeenCalledWith('/admin-ui/config', { withCredentials: true })
  })
})

describe('fetchServerConfiguration', () => {
  it('returns response data on success', async () => {
    ax.get.mockResolvedValue({ data: { issuer: 'x' } })
    await expect(fetchServerConfiguration()).resolves.toEqual({ issuer: 'x' })
  })

  it('rethrows on failure', async () => {
    ax.get.mockRejectedValue(new Error('down'))
    await expect(fetchServerConfiguration()).rejects.toThrow('down')
  })
})

describe('putServerConfiguration', () => {
  it('puts the props with the token-derived auth config', async () => {
    ax.put.mockResolvedValue({ data: { saved: true } })
    await putServerConfiguration({ props: { a: 1 }, token: 'tok' } as never)
    expect(ax.put).toHaveBeenCalledWith(
      '/admin-ui/config',
      { a: 1 },
      {
        headers: { Authorization: 'Bearer tok' },
      },
    )
  })
})

describe('fetchUserInformation', () => {
  it('sends the token_type + access_token authorization header', async () => {
    ax.get.mockResolvedValue({ data: 'userinfo' })
    const result = await fetchUserInformation({
      userInfoEndpoint: 'https://idp/userinfo',
      token_type: 'Bearer',
      access_token: 'abc',
    } as never)
    expect(ax.get).toHaveBeenCalledWith('https://idp/userinfo', {
      headers: { Authorization: 'Bearer abc' },
    })
    expect(result).toBe('userinfo')
  })

  it('returns -1 instead of throwing on failure', async () => {
    ax.get.mockRejectedValue(new Error('bad code'))
    await expect(
      fetchUserInformation({
        userInfoEndpoint: 'u',
        token_type: 'Bearer',
        access_token: 'x',
      } as never),
    ).resolves.toBe(-1)
  })
})

describe('postUserAction', () => {
  it('strips headers from the action payload and returns status + data', async () => {
    ax.post.mockResolvedValue({ status: 201, data: { id: 1 } })
    const result = await postUserAction({ action: 'PATCH', headers: { secret: 'x' } } as never)
    const [, body] = ax.post.mock.calls[0]
    expect(body.userAction).toEqual({ action: 'PATCH' })
    expect(body.userAction.headers).toBeUndefined()
    expect(result).toEqual({ status: 201, data: { id: 1 } })
  })

  it('rethrows on failure', async () => {
    ax.post.mockRejectedValue(new Error('audit down'))
    await expect(postUserAction({ action: 'X' } as never)).rejects.toThrow('audit down')
  })
})

describe('fetchApiTokenWithDefaultScopes', () => {
  it('posts to the api-protection-token endpoint without credentials', async () => {
    ax.post.mockResolvedValue({ data: { access_token: 't' } })
    await fetchApiTokenWithDefaultScopes()
    expect(ax.post).toHaveBeenCalledWith(
      '/app/admin-ui/oauth2/api-protection-token',
      {},
      { withCredentials: false },
    )
  })
})

describe('fetchPolicyStore', () => {
  it('returns status + data on success', async () => {
    ax.get.mockResolvedValue({ status: 200, data: { policies: [] } })
    await expect(fetchPolicyStore('tok')).resolves.toEqual({ status: 200, data: { policies: [] } })
  })
})

describe('session endpoints', () => {
  it('exposes the session endpoint constant', () => {
    expect(SESSION_ENDPOINT).toBe('/app/admin-ui/oauth2/session')
  })

  it('creates a session with a bearer-authorized post', async () => {
    ax.post.mockResolvedValue({ data: { created: true } })
    await createAdminUiSession('the-ujwt', 'prot-token')
    expect(ax.post).toHaveBeenCalledWith(
      '/app/admin-ui/oauth2/session',
      { ujwt: 'the-ujwt' },
      { headers: { Authorization: 'Bearer prot-token' }, withCredentials: true },
    )
  })

  it('deletes the session using the token-derived auth config', async () => {
    ax.delete.mockResolvedValue({ data: {} })
    await deleteAdminUiSession()
    expect(ax.delete).toHaveBeenCalledWith('/app/admin-ui/oauth2/session', {
      withCredentials: true,
    })
  })

  it('rethrows when session deletion fails', async () => {
    ax.delete.mockRejectedValue(new Error('nope'))
    await expect(deleteAdminUiSession()).rejects.toThrow('nope')
  })
})
