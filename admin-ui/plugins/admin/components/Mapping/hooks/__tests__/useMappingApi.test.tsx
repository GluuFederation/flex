import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMappingData } from '../useMappingApi'

type QueryOptions = { query: { enabled: boolean } }

const mockMapping = jest.fn()
const mockRoles = jest.fn()
const mockPermissions = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetAllAdminuiRolePermissions: (options: QueryOptions) => mockMapping(options),
  useGetAllAdminuiRoles: (options: QueryOptions) => mockRoles(options),
  useGetAllAdminuiPermissions: (options: QueryOptions) => mockPermissions(options),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const baseQuery = {
  data: undefined,
  isLoading: false,
  isError: false,
  error: null,
  refetch: jest.fn().mockResolvedValue(undefined),
}

describe('useMappingData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMapping.mockReturnValue({ ...baseQuery, data: [{ role: 'admin' }] })
    mockRoles.mockReturnValue({ ...baseQuery, data: [{ role: 'admin' }] })
    mockPermissions.mockReturnValue({ ...baseQuery, data: [{ permission: 'read' }] })
  })

  it('returns combined data from all three queries', () => {
    const { result } = renderHook(() => useMappingData(), { wrapper: createWrapper() })
    expect(result.current.mapping).toEqual([{ role: 'admin' }])
    expect(result.current.roles).toEqual([{ role: 'admin' }])
    expect(result.current.permissions).toEqual([{ permission: 'read' }])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('defaults missing data to empty arrays', () => {
    mockMapping.mockReturnValue({ ...baseQuery, data: undefined })
    mockRoles.mockReturnValue({ ...baseQuery, data: undefined })
    mockPermissions.mockReturnValue({ ...baseQuery, data: undefined })

    const { result } = renderHook(() => useMappingData(), { wrapper: createWrapper() })
    expect(result.current.mapping).toHaveLength(0)
    expect(result.current.roles).toHaveLength(0)
    expect(result.current.permissions).toHaveLength(0)
  })

  it('passes the enabled flag through to every query', () => {
    renderHook(() => useMappingData(false), { wrapper: createWrapper() })
    expect(mockMapping.mock.calls[0][0].query.enabled).toBe(false)
    expect(mockRoles.mock.calls[0][0].query.enabled).toBe(false)
    expect(mockPermissions.mock.calls[0][0].query.enabled).toBe(false)
  })

  it('enables queries by default', () => {
    renderHook(() => useMappingData(), { wrapper: createWrapper() })
    expect(mockMapping.mock.calls[0][0].query.enabled).toBe(true)
  })

  it('aggregates loading and error state across queries', () => {
    mockRoles.mockReturnValue({ ...baseQuery, isLoading: true })
    mockPermissions.mockReturnValue({ ...baseQuery, isError: true, error: new Error('boom') })

    const { result } = renderHook(() => useMappingData(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('refetch triggers all three underlying refetches', async () => {
    const { result } = renderHook(() => useMappingData(), { wrapper: createWrapper() })
    await act(async () => {
      await result.current.refetch()
    })
    expect(mockMapping.mock.results[0].value.refetch).toHaveBeenCalled()
    expect(mockRoles.mock.results[0].value.refetch).toHaveBeenCalled()
    expect(mockPermissions.mock.results[0].value.refetch).toHaveBeenCalled()
  })
})
