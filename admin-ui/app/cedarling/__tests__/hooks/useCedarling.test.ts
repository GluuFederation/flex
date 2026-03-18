import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import type { CedarPermissionsState } from '@/cedarling'

jest.mock('@/cedarling/client', () => ({
  cedarlingClient: {
    initialize: jest.fn().mockResolvedValue(undefined),
    token_authorize: jest.fn().mockResolvedValue({ decision: true }),
  },
}))

const createStore = (
  overrides: {
    authState?: Record<string, string | string[] | undefined>
    cedarState?: Partial<CedarPermissionsState>
  } = {},
) => {
  const defaultAuth = {
    userinfo_jwt: 'test-userinfo-jwt',
    idToken: 'test-id-token',
    jwtToken: 'test-access-token',
    permissions: [],
    ...overrides.authState,
  }

  const defaultCedar: CedarPermissionsState = {
    permissions: {},
    loading: false,
    error: null,
    initialized: true,
    isInitializing: false,
    cedarFailedStatusAfterMaxTries: null,
    policyStoreJson: '',
    ...overrides.cedarState,
  }

  return configureStore({
    reducer: combineReducers({
      authReducer: (state = defaultAuth) => state,
      cedarPermissions: (state = defaultCedar) => state,
      noReducer: (state = {}) => state,
    }),
  })
}

const createWrapper = (store: ReturnType<typeof createStore>) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.createElement(Provider, { store } as React.ComponentProps<typeof Provider>, children)
  return Wrapper
}

describe('useCedarling', () => {
  let tokenAuthorizeMock: jest.Mock

  beforeEach(() => {
    tokenAuthorizeMock = jest.requireMock('@/cedarling/client').cedarlingClient
      .token_authorize as jest.Mock
    tokenAuthorizeMock.mockClear()
  })

  describe('hasCedarReadPermission', () => {
    it('returns undefined when no cached permission', () => {
      const store = createStore()
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })
      expect(result.current.hasCedarReadPermission('Dashboard')).toBeUndefined()
    })

    it('returns cached read permission', () => {
      const store = createStore({
        cedarState: { permissions: { 'Dashboard::read': true } },
      })
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })
      expect(result.current.hasCedarReadPermission('Dashboard')).toBe(true)
    })

    it('returns false for denied read permission', () => {
      const store = createStore({
        cedarState: { permissions: { 'Users::read': false } },
      })
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })
      expect(result.current.hasCedarReadPermission('Users')).toBe(false)
    })
  })

  describe('hasCedarWritePermission', () => {
    it('returns undefined when no cached permission', () => {
      const store = createStore()
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })
      expect(result.current.hasCedarWritePermission('Dashboard')).toBeUndefined()
    })

    it('returns cached write permission', () => {
      const store = createStore({
        cedarState: { permissions: { 'SMTP::write': true } },
      })
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })
      expect(result.current.hasCedarWritePermission('SMTP')).toBe(true)
    })
  })

  describe('hasCedarDeletePermission', () => {
    it('returns undefined when no cached permission', () => {
      const store = createStore()
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })
      expect(result.current.hasCedarDeletePermission('Scripts')).toBeUndefined()
    })

    it('returns cached delete permission', () => {
      const store = createStore({
        cedarState: { permissions: { 'Scripts::delete': true } },
      })
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })
      expect(result.current.hasCedarDeletePermission('Scripts')).toBe(true)
    })
  })

  describe('authorize', () => {
    it('returns not authorized when cedarling is not initialized', async () => {
      const store = createStore({
        cedarState: { initialized: false, isInitializing: true },
      })
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })

      let authResult: { isAuthorized: boolean; error?: string } = { isAuthorized: false }
      await act(async () => {
        authResult = await result.current.authorize([
          { permission: 'https://example.com/read', resourceId: 'Dashboard' },
        ])
      })
      expect(authResult.isAuthorized).toBe(false)
      expect(authResult.error).toContain('not yet initialized')
    })

    it('returns not authorized when tokens are missing', async () => {
      const store = createStore({
        authState: { userinfo_jwt: undefined, idToken: undefined, jwtToken: undefined },
      })
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })

      let authResult: { isAuthorized: boolean; error?: string } = { isAuthorized: false }
      await act(async () => {
        authResult = await result.current.authorize([
          { permission: 'https://example.com/read', resourceId: 'Dashboard' },
        ])
      })
      expect(authResult.isAuthorized).toBe(false)
      expect(authResult.error).toContain('tokens are missing')
    })

    it('returns not authorized for empty scope array', async () => {
      const store = createStore()
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })

      let authResult: { isAuthorized: boolean } = { isAuthorized: false }
      await act(async () => {
        authResult = await result.current.authorize([])
      })
      expect(authResult.isAuthorized).toBe(false)
    })

    it('returns cached decision without calling API', async () => {
      const store = createStore({
        cedarState: { permissions: { 'Dashboard::read': true } },
      })
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })

      let authResult: { isAuthorized: boolean } = { isAuthorized: false }
      await act(async () => {
        authResult = await result.current.authorize([
          { permission: 'https://example.com/read', resourceId: 'Dashboard' },
        ])
      })
      expect(authResult.isAuthorized).toBe(true)
      expect(tokenAuthorizeMock).not.toHaveBeenCalled()
    })
  })

  describe('authorizeHelper', () => {
    it('returns empty array for empty scopes', async () => {
      const store = createStore()
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })

      let results: { isAuthorized: boolean }[] = []
      await act(async () => {
        results = await result.current.authorizeHelper([])
      })
      expect(results).toEqual([])
    })

    it('deduplicates entries with same resourceId and action', async () => {
      const store = createStore()
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })

      let results: { isAuthorized: boolean }[] = []
      await act(async () => {
        results = await result.current.authorizeHelper([
          { permission: 'https://example.com/stat-read', resourceId: 'Dashboard' },
          { permission: 'https://example.com/stat-jans-read', resourceId: 'Dashboard' },
        ])
      })
      expect(results).toHaveLength(2)
      expect(results[0].isAuthorized).toBe(true)
      expect(results[1].isAuthorized).toBe(true)
      // Both entries share the same resourceId+action key — only one API call should be made
      expect(tokenAuthorizeMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('hook return shape', () => {
    it('returns all expected properties', () => {
      const store = createStore()
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })

      expect(typeof result.current.authorize).toBe('function')
      expect(typeof result.current.authorizeHelper).toBe('function')
      expect(typeof result.current.hasCedarReadPermission).toBe('function')
      expect(typeof result.current.hasCedarWritePermission).toBe('function')
      expect(typeof result.current.hasCedarDeletePermission).toBe('function')
      expect(typeof result.current.isLoading).toBe('boolean')
      expect(result.current.error).toBeNull()
    })

    it('reflects loading state from store', () => {
      const store = createStore({ cedarState: { loading: true } })
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })
      expect(result.current.isLoading).toBe(true)
    })

    it('reflects error state from store', () => {
      const store = createStore({ cedarState: { error: 'test error' } })
      const { result } = renderHook(() => useCedarling(), { wrapper: createWrapper(store) })
      expect(result.current.error).toBe('test error')
    })
  })
})
