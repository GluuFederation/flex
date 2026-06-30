import React from 'react'
import { renderHook, waitFor, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  SSA_QUERY_KEYS,
  useGetAllSsas,
  useSsaJwtQuery,
  useCreateSsa,
  useGetSsaJwt,
} from '../useSsaApi'
import type { SsaCreatePayload } from '../../types'

const ssaPayload: SsaCreatePayload = {
  software_id: 's1',
  one_time_use: false,
  org_id: 'org-1',
  description: 'desc',
  software_roles: ['password'],
  rotate_ssa: false,
  grant_types: ['client_credentials'],
  is_expirable: false,
  expirationDate: null,
}

type AuthState = { jwtToken: string | null; config: { authServerHost: string } }

const buildStore = (overrides: Partial<AuthState> = {}) => {
  const authState: AuthState = {
    jwtToken: 'token-123',
    config: { authServerHost: 'https://auth.example' },
    ...overrides,
  }
  return configureStore({
    reducer: combineReducers({
      authReducer: (state = authState) => state,
      noReducer: (state = {}) => state,
    }),
  })
}

const createWrapper = (store: ReturnType<typeof buildStore>) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  )
  return Wrapper
}

const mockFetch = jest.fn()

type JsonLike = string | number | boolean | null | JsonLike[] | { [key: string]: JsonLike }

const jsonResponse = (body: JsonLike, ok = true, status = 200): Response => {
  const partial: Pick<Response, 'ok' | 'status' | 'statusText' | 'json'> = {
    ok,
    status,
    statusText: 'OK',
    json: () => Promise.resolve(body),
  }
  return partial as Response
}

const originalFetch = global.fetch

beforeAll(() => {
  global.fetch = mockFetch as typeof fetch
})

afterAll(() => {
  global.fetch = originalFetch
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('SSA_QUERY_KEYS', () => {
  it('builds list and detail keys', () => {
    expect(SSA_QUERY_KEYS.all).toEqual(['ssas'])
    expect(SSA_QUERY_KEYS.detail('abc')).toEqual(['ssas', 'abc'])
  })
})

describe('useGetAllSsas', () => {
  it('fetches all SSAs with an authorization header', async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ status: 'active' }]))
    const store = buildStore()
    const { result } = renderHook(() => useGetAllSsas(), { wrapper: createWrapper(store) })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual([{ status: 'active' }])
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toBe('https://auth.example/jans-auth/restv1/ssa')
    expect(options.headers.Authorization).toBe('Bearer token-123')
  })

  it('is disabled when there is no token', () => {
    const store = buildStore({ jwtToken: null })
    const { result } = renderHook(() => useGetAllSsas(), { wrapper: createWrapper(store) })
    expect(mockFetch).not.toHaveBeenCalled()
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('surfaces an error when the response is not ok', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ message: 'forbidden' }, false, 403))
    const store = buildStore()
    const { result } = renderHook(() => useGetAllSsas(), { wrapper: createWrapper(store) })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error?.message).toBe('forbidden')
  })
})

describe('useSsaJwtQuery', () => {
  it('is disabled when enabled is false', () => {
    const store = buildStore()
    const { result } = renderHook(() => useSsaJwtQuery('jti-1', false), {
      wrapper: createWrapper(store),
    })
    expect(mockFetch).not.toHaveBeenCalled()
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches the JWT for the given jti when enabled', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ssa: 'jwt-value' }))
    const store = buildStore()
    const { result } = renderHook(() => useSsaJwtQuery('jti-1', true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual({ ssa: 'jwt-value' })
    expect(mockFetch.mock.calls[0][0]).toContain('/jans-auth/restv1/ssa/jwt?jti=jti-1')
  })
})

describe('useCreateSsa', () => {
  it('posts the payload and resolves with created SSA', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ status: 'created' }))
    const store = buildStore()
    const { result } = renderHook(() => useCreateSsa(), { wrapper: createWrapper(store) })

    await act(async () => {
      const created = await result.current.mutateAsync(ssaPayload)
      expect(created).toEqual({ status: 'created' })
    })

    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toBe('https://auth.example/jans-auth/restv1/ssa')
    expect(options.method).toBe('POST')
  })

  it('rejects when no token is available', async () => {
    const store = buildStore({ jwtToken: null })
    const { result } = renderHook(() => useCreateSsa(), { wrapper: createWrapper(store) })

    await act(async () => {
      await expect(result.current.mutateAsync(ssaPayload)).rejects.toThrow(
        'No authentication token available',
      )
    })
    expect(mockFetch).not.toHaveBeenCalled()
  })
})

describe('useGetSsaJwt', () => {
  it('fetches the JWT for the supplied jti', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ssa: 'jwt-x' }))
    const store = buildStore()
    const { result } = renderHook(() => useGetSsaJwt(), { wrapper: createWrapper(store) })

    await act(async () => {
      const value = await result.current.mutateAsync('jti-9')
      expect(value).toEqual({ ssa: 'jwt-x' })
    })
    expect(mockFetch.mock.calls[0][0]).toContain('jti=jti-9')
  })

  it('rejects when the auth server host is not configured', async () => {
    const store = buildStore({ config: { authServerHost: '' } })
    const { result } = renderHook(() => useGetSsaJwt(), { wrapper: createWrapper(store) })

    await act(async () => {
      await expect(result.current.mutateAsync('jti-9')).rejects.toThrow(
        'Auth server host not configured',
      )
    })
  })
})
