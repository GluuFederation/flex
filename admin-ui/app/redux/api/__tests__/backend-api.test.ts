// Mock the shared axios instance so endpoint/URL/header/branch behavior can be
// asserted without a live server. The mock methods are created inside the
// factory (avoiding the hoisting TDZ) and pulled back out via the default export.
jest.mock('../axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), put: jest.fn(), post: jest.fn(), delete: jest.fn() },
}))
jest.mock('@/utils/logger', () => ({ logger: { error: jest.fn(), warn: jest.fn() } }))
jest.mock('@/utils/apiErrorMessage', () => ({ resolveApiErrorMessage: (e: Error) => e.message }))

import mockAxiosDefault from '../axios'

import {
  fetchServerConfiguration,
  putServerConfiguration,
  fetchUserInformation,
  postUserAction,
  fetchApiTokenWithDefaultScopes,
  fetchPolicyStores,
  fetchActivePolicyStoreBytes,
  createAdminUiSession,
  deleteAdminUiSession,
  SESSION_ENDPOINT,
} from '../backend-api'
import { setHasSessionReader } from '../sessionState'
import { POLICY_STORE_PATH } from '@/constants/policyStore'

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

describe('once a session cookie exists', () => {
  beforeEach(() => setHasSessionReader(() => true))
  afterEach(() => setHasSessionReader(() => false))

  it.each([
    [
      'fetchServerConfiguration',
      () => fetchServerConfiguration('tok'),
      () => ax.get,
      '/admin-ui/config',
    ],
    [
      'fetchPolicyStores',
      () => fetchPolicyStores(undefined, 'tok'),
      () => ax.get,
      POLICY_STORE_PATH,
    ],
    ['deleteAdminUiSession', () => deleteAdminUiSession('tok'), () => ax.delete, SESSION_ENDPOINT],
  ])('ignores the token %s was given and sends the cookie', async (_label, call, method, url) => {
    method().mockResolvedValue({ data: {} })
    await call()
    expect(method()).toHaveBeenCalledWith(url, { withCredentials: true })
  })

  it('ignores the token putServerConfiguration was given and sends the cookie', async () => {
    ax.put.mockResolvedValue({ data: {} })
    await putServerConfiguration({ props: { a: 1 }, token: 'tok' } as never)
    expect(ax.put).toHaveBeenCalledWith('/admin-ui/config', { a: 1 }, { withCredentials: true })
  })

  it('keeps the bearer on createAdminUiSession, which mints the cookie', async () => {
    ax.post.mockResolvedValue({ data: {} })
    await createAdminUiSession('ujwt', 'api-token')
    expect(ax.post).toHaveBeenCalledWith(
      SESSION_ENDPOINT,
      { ujwt: 'ujwt' },
      { headers: { Authorization: 'Bearer api-token' }, withCredentials: true },
    )
  })

  it('keeps the bearer on fetchUserInformation, which calls the auth server', async () => {
    ax.get.mockResolvedValue({ data: 'jwt' })
    await fetchUserInformation({
      userInfoEndpoint: 'https://as.example.com/userinfo',
      token_type: 'Bearer',
      access_token: 'oauth-token',
    } as never)
    expect(ax.get).toHaveBeenCalledWith('https://as.example.com/userinfo', {
      headers: { Authorization: 'Bearer oauth-token' },
    })
  })

  it('keeps fetchApiTokenWithDefaultScopes uncredentialed', async () => {
    ax.post.mockResolvedValue({ data: {} })
    await fetchApiTokenWithDefaultScopes()
    expect(ax.post).toHaveBeenCalledWith(
      '/app/admin-ui/oauth2/api-protection-token',
      {},
      { withCredentials: false },
    )
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

describe('fetchPolicyStores', () => {
  it('returns status + data on success', async () => {
    ax.get.mockResolvedValue({ status: 200, data: { entries: [] } })
    await expect(fetchPolicyStores(undefined, 'tok')).resolves.toEqual({
      status: 200,
      data: { entries: [] },
    })
  })

  it('forwards paging params to the policy-store path', async () => {
    ax.get.mockResolvedValue({ status: 200, data: { entries: [] } })
    await fetchPolicyStores({ limit: 10, startIndex: 0 }, 'tok')
    expect(ax.get).toHaveBeenCalledWith(
      POLICY_STORE_PATH,
      expect.objectContaining({ params: { limit: 10, startIndex: 0 } }),
    )
  })
})

describe('fetchActivePolicyStoreBytes', () => {
  it('returns the archive of the active entry from the paged envelope', async () => {
    ax.get.mockResolvedValue({
      status: 200,
      data: {
        entries: [
          { inum: 'a', jansStatus: 'inactive', policyStore: 'aW5hY3RpdmU=' },
          { inum: 'b', jansStatus: 'active', policyStore: 'YWN0aXZl' },
        ],
      },
    })
    await expect(fetchActivePolicyStoreBytes()).resolves.toBe('YWN0aXZl')
  })

  it('asks the server for only the active store rather than every archive', async () => {
    ax.get.mockResolvedValue({
      status: 200,
      data: { entries: [{ inum: 'b', jansStatus: 'active', policyStore: 'YWN0aXZl' }] },
    })
    await fetchActivePolicyStoreBytes()
    expect(ax.get).toHaveBeenNthCalledWith(
      1,
      POLICY_STORE_PATH,
      expect.objectContaining({ params: { fieldValuePair: 'jansStatus=active' } }),
    )
  })

  it('never boots from a deactivated store when the status filter is ignored', async () => {
    ax.get
      .mockResolvedValueOnce({
        status: 200,
        data: { entries: [{ inum: 'a', jansStatus: 'inactive', policyStore: 'aW5hY3RpdmU=' }] },
      })
      .mockResolvedValueOnce({ status: 200, data: { success: true, responseBytes: 'bGVnYWN5' } })
    await expect(fetchActivePolicyStoreBytes()).resolves.toBe('bGVnYWN5')
  })

  it('reads a bare array response too', async () => {
    ax.get.mockResolvedValue({
      status: 200,
      data: [{ inum: 'b', jansStatus: 'active', policyStore: 'YWN0aXZl' }],
    })
    await expect(fetchActivePolicyStoreBytes()).resolves.toBe('YWN0aXZl')
  })

  it('falls back to the legacy endpoint when the list endpoint fails', async () => {
    ax.get
      .mockRejectedValueOnce(new Error('404'))
      .mockResolvedValueOnce({ status: 200, data: { success: true, responseBytes: 'bGVnYWN5' } })
    await expect(fetchActivePolicyStoreBytes()).resolves.toBe('bGVnYWN5')
    expect(ax.get).toHaveBeenNthCalledWith(2, POLICY_STORE_PATH, expect.anything())
  })

  it('falls back when the list endpoint returns no usable archive', async () => {
    ax.get
      .mockResolvedValueOnce({ status: 200, data: { entries: [] } })
      .mockResolvedValueOnce({ status: 200, data: { success: true, responseBytes: 'bGVnYWN5' } })
    await expect(fetchActivePolicyStoreBytes()).resolves.toBe('bGVnYWN5')
  })

  it('resolves undefined when neither endpoint yields an archive', async () => {
    ax.get
      .mockResolvedValueOnce({ status: 200, data: { entries: [] } })
      .mockResolvedValueOnce({ status: 200, data: { success: false } })
    await expect(fetchActivePolicyStoreBytes()).resolves.toBeUndefined()
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
