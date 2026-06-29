import reducer, {
  setBackendStatus,
  getOAuth2ConfigResponse,
  setAuthState,
  getUserInfoResponse,
  getAPIAccessTokenResponse,
  setApiDefaultToken,
  putConfigWorker,
  putConfigWorkerResponse,
  createAdminUiSessionResponse,
} from '../authSlice'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('authSlice', () => {
  it('returns the initial state', () => {
    const state = getInitial()
    expect(state.isAuthenticated).toBe(false)
    expect(state.backendStatus.active).toBe(true)
    expect(state.permissions).toEqual([])
  })

  it('setBackendStatus replaces all backend status fields', () => {
    const state = reducer(
      getInitial(),
      setBackendStatus({ active: false, errorMessage: 'down', statusCode: 503 }),
    )
    expect(state.backendStatus).toEqual({ active: false, errorMessage: 'down', statusCode: 503 })
  })

  it('getOAuth2ConfigResponse merges config when provided', () => {
    const state = reducer(getInitial(), getOAuth2ConfigResponse({ config: { issuer: 'x' } }))
    expect(state.config).toMatchObject({ issuer: 'x' })
  })

  it('getOAuth2ConfigResponse leaves config untouched when no config', () => {
    const state = reducer(getInitial(), getOAuth2ConfigResponse({}))
    expect(state.config).toEqual({})
  })

  it('setAuthState toggles isAuthenticated', () => {
    expect(reducer(getInitial(), setAuthState({ state: true })).isAuthenticated).toBe(true)
    expect(reducer(getInitial(), setAuthState({ state: false })).isAuthenticated).toBe(false)
  })

  it('getUserInfoResponse with ujwt populates user fields and authenticates', () => {
    const state = reducer(
      getInitial(),
      getUserInfoResponse({
        ujwt: 'jwt',
        userinfo: { inum: 'inum-1' },
        idToken: 'id',
        jwtToken: 'jt',
        isUserInfoFetched: true,
      }),
    )
    expect(state.userinfo_jwt).toBe('jwt')
    expect(state.userInum).toBe('inum-1')
    expect(state.idToken).toBe('id')
    expect(state.isUserInfoFetched).toBe(true)
    expect(state.isAuthenticated).toBe(true)
  })

  it('getUserInfoResponse without ujwt only authenticates', () => {
    const state = reducer(getInitial(), getUserInfoResponse({}))
    expect(state.isAuthenticated).toBe(true)
    expect(state.userinfo).toBeNull()
  })

  it('getAPIAccessTokenResponse sets issuer, permissions and authenticates', () => {
    const state = reducer(
      getInitial(),
      getAPIAccessTokenResponse({ issuer: 'iss', scopes: ['a', 'b'] }),
    )
    expect(state.issuer).toBe('iss')
    expect(state.permissions).toEqual(['a', 'b'])
    expect(state.isAuthenticated).toBe(true)
  })

  it('setApiDefaultToken only updates issuer when present', () => {
    expect(reducer(getInitial(), setApiDefaultToken({ issuer: 'iss' })).issuer).toBe('iss')
    expect(reducer(getInitial(), setApiDefaultToken({})).issuer).toBeNull()
  })

  it('putConfigWorker / putConfigWorkerResponse toggle loadingConfig', () => {
    const loading = reducer(getInitial(), putConfigWorker({}))
    expect(loading.loadingConfig).toBe(true)
    expect(reducer(loading, putConfigWorkerResponse()).loadingConfig).toBe(false)
  })

  it('createAdminUiSessionResponse sets hasSession only on success', () => {
    expect(reducer(getInitial(), createAdminUiSessionResponse({ success: true })).hasSession).toBe(
      true,
    )
    expect(reducer(getInitial(), createAdminUiSessionResponse({ success: false })).hasSession).toBe(
      false,
    )
  })
})
