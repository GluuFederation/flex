import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useProfileDetails } from '../useProfileDetails'
import type { LogAuditParams } from 'Utils/AuditLogger'
import type { ProfileDetails } from '../../types'

type RawUser = {
  displayName?: string
  givenName?: string
  mail?: string
  status?: string
  inum?: string
  customAttributes?: Array<{ name?: string; values?: Array<string | number> }>
}

type SelectFn = (user: RawUser) => ProfileDetails

type QueryOptions = {
  enabled?: boolean
  select?: SelectFn
}

const mockUseGetUserByInum = jest.fn()
const mockLogAuditUserAction = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetUserByInum: (inum: string, opts: { query: QueryOptions }) =>
    mockUseGetUserByInum(inum, opts),
}))

jest.mock('@/utils/AuditLogger', () => ({
  logAuditUserAction: (params: LogAuditParams) => mockLogAuditUserAction(params),
}))

const sampleUser: RawUser = {
  displayName: 'Jane Doe',
  givenName: 'Jane',
  mail: 'jane@example.com',
  status: 'active',
  inum: 'inum-123',
  customAttributes: [
    { name: 'sn', values: ['Doe'] },
    { name: 'jansAdminUIRole', values: ['admin', 'manager'] },
  ],
}

const buildStore = () =>
  configureStore({
    reducer: combineReducers({
      authReducer: (
        state = { userinfo: { inum: 'a-1', name: 'admin' }, config: { clientId: 'client-1' } },
      ) => state,
    }),
  })

const createWrapper = (store: ReturnType<typeof buildStore>) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  )
  return Wrapper
}

// Helper that mimics how React Query applies the `select` transform to raw data.
const mockQueryReturn = (raw: RawUser | undefined, loading = false) => {
  mockUseGetUserByInum.mockImplementation((_inum: string, opts: { query: QueryOptions }) => {
    const selected = raw !== undefined && opts.query.select ? opts.query.select(raw) : raw
    return { data: selected, isLoading: loading }
  })
}

describe('useProfileDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogAuditUserAction.mockResolvedValue(undefined)
  })

  it('transforms the raw user into profile details', () => {
    mockQueryReturn(sampleUser)
    const store = buildStore()
    const { result } = renderHook(() => useProfileDetails('inum-123', true), {
      wrapper: createWrapper(store),
    })

    expect(result.current.profileDetails?.displayName).toBe('Jane Doe')
    expect(result.current.profileDetails?.mail).toBe('jane@example.com')
    expect(result.current.profileDetails?.customAttributes).toHaveLength(2)
  })

  it('derives the surname from the "sn" attribute', () => {
    mockQueryReturn(sampleUser)
    const store = buildStore()
    const { result } = renderHook(() => useProfileDetails('inum-123', true), {
      wrapper: createWrapper(store),
    })

    expect(result.current.surname).toBe('Doe')
  })

  it('capitalizes and joins role values', () => {
    mockQueryReturn(sampleUser)
    const store = buildStore()
    const { result } = renderHook(() => useProfileDetails('inum-123', true), {
      wrapper: createWrapper(store),
    })

    expect(result.current.roles).toBe('Admin, Manager')
  })

  it('returns "-" for roles when none are present', () => {
    mockQueryReturn({ ...sampleUser, customAttributes: [{ name: 'sn', values: ['Doe'] }] })
    const store = buildStore()
    const { result } = renderHook(() => useProfileDetails('inum-123', true), {
      wrapper: createWrapper(store),
    })

    expect(result.current.roles).toBe('-')
  })

  it('passes enabled=false to the query when no inum is provided', () => {
    mockQueryReturn(undefined)
    const store = buildStore()
    renderHook(() => useProfileDetails(undefined, true), { wrapper: createWrapper(store) })

    const [, opts] = mockUseGetUserByInum.mock.calls[0]
    expect(opts.query.enabled).toBe(false)
  })

  it('passes enabled=false to the query when disabled despite a valid inum', () => {
    mockQueryReturn(sampleUser)
    const store = buildStore()
    renderHook(() => useProfileDetails('inum-123', false), { wrapper: createWrapper(store) })

    const [, opts] = mockUseGetUserByInum.mock.calls[0]
    expect(opts.query.enabled).toBe(false)
  })

  it('reflects the loading state from the query', () => {
    mockQueryReturn(undefined, true)
    const store = buildStore()
    const { result } = renderHook(() => useProfileDetails('inum-123', true), {
      wrapper: createWrapper(store),
    })

    expect(result.current.loading).toBe(true)
  })

  it('logs an audit action once details are available', async () => {
    mockQueryReturn(sampleUser)
    const store = buildStore()
    renderHook(() => useProfileDetails('inum-123', true), { wrapper: createWrapper(store) })

    await waitFor(() => {
      expect(mockLogAuditUserAction).toHaveBeenCalledTimes(1)
    })
    expect(mockLogAuditUserAction.mock.calls[0][0]).toMatchObject({
      payload: { pattern: 'inum-123' },
    })
  })

  it('does not log an audit action when there are no profile details', () => {
    mockQueryReturn(undefined)
    const store = buildStore()
    renderHook(() => useProfileDetails('inum-123', true), { wrapper: createWrapper(store) })

    expect(mockLogAuditUserAction).not.toHaveBeenCalled()
  })
})
