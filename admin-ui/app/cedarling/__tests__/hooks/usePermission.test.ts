import { renderHook, act, waitFor } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { usePermission } from '../../hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import cedarPermissionsReducer from '@/redux/features/cedarPermissionsSlice'
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
    initialized: true,
    isInitializing: false,
    cedarFailedStatusAfterMaxTries: null,
    policyStoreBytes: '',
    ...overrides.cedarState,
  }

  return configureStore({
    reducer: combineReducers({
      authReducer: (state = defaultAuth) => state,
      cedarPermissions: cedarPermissionsReducer,
      noReducer: (state = {}) => state,
    }),
    preloadedState: { cedarPermissions: defaultCedar },
  })
}

const createWrapper = (store: ReturnType<typeof createStore>) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store } as React.ComponentProps<typeof Provider>, children)
  return Wrapper
}

describe('usePermission', () => {
  let tokenAuthorizeMock: jest.Mock

  beforeEach(() => {
    tokenAuthorizeMock = jest.requireMock('@/cedarling/client').cedarlingClient
      .token_authorize as jest.Mock
    tokenAuthorizeMock.mockClear()
    tokenAuthorizeMock.mockResolvedValue({ decision: true })
  })

  it('returns all permissions false when nothing is cached and cedarling is not initialized', () => {
    const store = createStore({ cedarState: { initialized: false } })
    const { result } = renderHook(() => usePermission(ADMIN_UI_RESOURCES.Settings), {
      wrapper: createWrapper(store),
    })

    expect(result.current).toEqual({ canRead: false, canWrite: false, canDelete: false })
    expect(typeof result.current.canRead).toBe('boolean')
    expect(tokenAuthorizeMock).not.toHaveBeenCalled()
  })

  it('reads cached decisions through to the matching can flags', () => {
    const store = createStore({
      cedarState: { permissions: { 'Settings::read': true, 'Settings::write': false } },
    })
    const { result } = renderHook(() => usePermission(ADMIN_UI_RESOURCES.Settings), {
      wrapper: createWrapper(store),
    })

    expect(result.current.canRead).toBe(true)
    expect(result.current.canWrite).toBe(false)
    expect(result.current.canDelete).toBe(false)
  })

  it('authorizes every declared action for the resource on mount when uncached', async () => {
    const store = createStore()
    const { result } = renderHook(() => usePermission(ADMIN_UI_RESOURCES.Settings), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(tokenAuthorizeMock).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(result.current.canRead).toBe(true))
    expect(result.current.canWrite).toBe(true)
    expect(result.current.canDelete).toBe(false)
  })

  it('does not call the authorize API when every decision is already cached', async () => {
    const store = createStore({
      cedarState: { permissions: { 'Settings::read': true, 'Settings::write': true } },
    })
    const { result } = renderHook(() => usePermission(ADMIN_UI_RESOURCES.Settings), {
      wrapper: createWrapper(store),
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(tokenAuthorizeMock).not.toHaveBeenCalled()
    expect(result.current.canRead).toBe(true)
    expect(result.current.canWrite).toBe(true)
  })

  it('only authorizes the single declared action of a read-only resource', async () => {
    const store = createStore()
    const { result } = renderHook(() => usePermission(ADMIN_UI_RESOURCES.Dashboard), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(tokenAuthorizeMock).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(result.current.canRead).toBe(true))
    expect(result.current.canWrite).toBe(false)
    expect(result.current.canDelete).toBe(false)
  })
})
