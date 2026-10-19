import { combineReducers, configureStore, type Reducer } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer, { getUserInfoResponse } from '@/redux/features/authSlice'
import { persistConfig } from '@/redux/store'
import { authTokensTransform } from '@/redux/store/authTokensTransform'
import { STORAGE_KEYS } from '@/constants'

const PERSIST_KEY = 'persist:auth-test'
const TOKENS = { ujwt: 'userinfo-jwt', idToken: 'id-token', jwtToken: 'access-token' }

const buildStore = async () => {
  const store = configureStore({
    reducer: persistReducer(
      { key: 'auth-test', storage, transforms: [authTokensTransform] },
      combineReducers({ authReducer }) as Reducer<{ authReducer: ReturnType<typeof authReducer> }>,
    ),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  })
  const persistor = persistStore(store)
  await new Promise<void>((resolve) => {
    if (persistor.getState().bootstrapped) return resolve()
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        unsubscribe()
        resolve()
      }
    })
  })
  return { store, persistor }
}

const persistedAuth = () => {
  const root = JSON.parse(window.localStorage.getItem(PERSIST_KEY) ?? '{}')
  return root.authReducer ? JSON.parse(root.authReducer) : {}
}

const sessionTokens = () =>
  JSON.parse(window.sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKENS) ?? 'null')

describe('auth token persistence with redux-persist', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('is wired into the app store', () => {
    expect(persistConfig.transforms).toContain(authTokensTransform)
  })

  it('saves the auth state to localStorage without the tokens', async () => {
    const { store, persistor } = await buildStore()

    store.dispatch(getUserInfoResponse({ userinfo: { inum: 'u-1' }, ...TOKENS }))
    await persistor.flush()

    expect(persistedAuth()).toMatchObject({ userinfo: { inum: 'u-1' } })
    expect(persistedAuth()).not.toHaveProperty('userinfo_jwt')
    expect(persistedAuth()).not.toHaveProperty('idToken')
    expect(persistedAuth()).not.toHaveProperty('jwtToken')
    expect(window.localStorage.getItem(PERSIST_KEY)).not.toContain('access-token')
  })

  it('saves the tokens to sessionStorage', async () => {
    const { store, persistor } = await buildStore()

    store.dispatch(getUserInfoResponse({ userinfo: { inum: 'u-1' }, ...TOKENS }))
    await persistor.flush()

    expect(sessionTokens()).toEqual({
      userinfo_jwt: 'userinfo-jwt',
      idToken: 'id-token',
      jwtToken: 'access-token',
    })
  })

  it('keeps the tokens in the live store for the app to use', async () => {
    const { store } = await buildStore()

    store.dispatch(getUserInfoResponse({ userinfo: { inum: 'u-1' }, ...TOKENS }))

    expect(store.getState().authReducer).toMatchObject({
      userinfo_jwt: 'userinfo-jwt',
      idToken: 'id-token',
      jwtToken: 'access-token',
    })
  })

  it('restores profile and tokens on reload in the same tab', async () => {
    const first = await buildStore()
    first.store.dispatch(getUserInfoResponse({ userinfo: { inum: 'u-1' }, ...TOKENS }))
    await first.persistor.flush()

    const { store } = await buildStore()

    expect(store.getState().authReducer).toMatchObject({
      userinfo: { inum: 'u-1' },
      userinfo_jwt: 'userinfo-jwt',
      idToken: 'id-token',
      jwtToken: 'access-token',
    })
  })

  it('opens a new tab with the profile but without tokens', async () => {
    const first = await buildStore()
    first.store.dispatch(getUserInfoResponse({ userinfo: { inum: 'u-1' }, ...TOKENS }))
    await first.persistor.flush()
    window.sessionStorage.clear()

    const { store } = await buildStore()

    expect(store.getState().authReducer).toMatchObject({
      userinfo: { inum: 'u-1' },
      userinfo_jwt: null,
      idToken: null,
      jwtToken: null,
    })
  })

  it('ignores tokens an older build left in localStorage and removes them on the next save', async () => {
    window.localStorage.setItem(
      PERSIST_KEY,
      JSON.stringify({
        authReducer: JSON.stringify({
          userinfo: { inum: 'u-1' },
          userinfo_jwt: 'old-userinfo-jwt',
          idToken: 'old-id-token',
          jwtToken: 'old-access-token',
          hasSession: true,
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      }),
    )

    const { store, persistor } = await buildStore()

    expect(store.getState().authReducer).toMatchObject({
      hasSession: true,
      userinfo_jwt: null,
      idToken: null,
      jwtToken: null,
    })

    store.dispatch(getUserInfoResponse({ userinfo: { inum: 'u-1' }, ...TOKENS }))
    await persistor.flush()
    expect(window.localStorage.getItem(PERSIST_KEY)).not.toContain('old-access-token')
  })

  it('clears the session tokens on sign-out', async () => {
    const { store, persistor } = await buildStore()
    store.dispatch(getUserInfoResponse({ userinfo: { inum: 'u-1' }, ...TOKENS }))
    await persistor.flush()
    expect(sessionTokens()).not.toBeNull()

    store.dispatch({ type: 'logout/logoutUser' })
    await persistor.flush()

    expect(sessionTokens()).toBeNull()
  })
})
