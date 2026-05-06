import { renderHook, act } from '@testing-library/react'
import { useClientUmaResources } from 'Plugins/auth-server/components/OidcClients/hooks/useClientUmaResources'

const mockMutateAsync = jest.fn()
const mockRefetch = jest.fn()
const mockInvalidateQueriesByKey = jest.fn()
const mockDevLoggerError = jest.fn()

const mockUseGetOauthUmaResourcesByClientid = jest.fn()
const mockUseDeleteOauthUmaResourcesById = jest.fn()
const proxyUseGetOauthUmaResourcesByClientid = (
  ...args: Parameters<typeof mockUseGetOauthUmaResourcesByClientid>
) => mockUseGetOauthUmaResourcesByClientid(...args)
const proxyInvalidateQueriesByKey = (...args: Parameters<typeof mockInvalidateQueriesByKey>) =>
  mockInvalidateQueriesByKey(...args)
const proxyDevLoggerError = (...args: Parameters<typeof mockDevLoggerError>) =>
  mockDevLoggerError(...args)

jest.mock('JansConfigApi', () => ({
  useGetOauthUmaResourcesByClientid: proxyUseGetOauthUmaResourcesByClientid,
  useDeleteOauthUmaResourcesById: () => mockUseDeleteOauthUmaResourcesById(),
  getGetOauthUmaResourcesByClientidQueryKey: jest.fn((id) => ['umaResources', id]),
}))

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({}),
}))

jest.mock('@/utils/queryUtils', () => ({
  invalidateQueriesByKey: proxyInvalidateQueriesByKey,
}))

jest.mock('@/utils/devLogger', () => ({
  devLogger: { error: proxyDevLoggerError },
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockUseGetOauthUmaResourcesByClientid.mockReturnValue({
    data: undefined,
    isLoading: false,
    refetch: mockRefetch,
  })
  mockUseDeleteOauthUmaResourcesById.mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending: false,
  })
  mockInvalidateQueriesByKey.mockResolvedValue(undefined)
})

describe('useClientUmaResources', () => {
  it('returns empty umaResources when no data', () => {
    const { result } = renderHook(() => useClientUmaResources('client-001'))
    expect(result.current.umaResources).toEqual([])
  })

  it('returns umaResources from query data', () => {
    mockUseGetOauthUmaResourcesByClientid.mockReturnValue({
      data: [{ id: 'uma-1', name: 'Resource One' }],
      isLoading: false,
      refetch: mockRefetch,
    })
    const { result } = renderHook(() => useClientUmaResources('client-001'))
    expect(result.current.umaResources).toHaveLength(1)
    expect(result.current.umaResources[0]).toMatchObject({ id: 'uma-1' })
  })

  it('does not enable the query when clientId is undefined', () => {
    renderHook(() => useClientUmaResources(undefined))
    const callArgs = mockUseGetOauthUmaResourcesByClientid.mock.calls[0]
    expect(callArgs[1]).toMatchObject({ query: { enabled: false } })
  })

  it('deleteUmaResource calls mutateAsync with the resource id', async () => {
    mockMutateAsync.mockResolvedValue(undefined)
    const { result } = renderHook(() => useClientUmaResources('client-001'))
    await act(async () => {
      await result.current.deleteUmaResource('uma-1')
    })
    expect(mockMutateAsync).toHaveBeenCalledWith({ id: 'uma-1' })
    expect(mockInvalidateQueriesByKey).toHaveBeenCalled()
  })

  it('deleteUmaResource logs error and rethrows on failure', async () => {
    mockMutateAsync.mockRejectedValue(new Error('delete failed'))
    const { result } = renderHook(() => useClientUmaResources('client-001'))
    await expect(
      act(async () => {
        await result.current.deleteUmaResource('uma-1')
      }),
    ).rejects.toThrow('delete failed')
    expect(mockDevLoggerError).toHaveBeenCalled()
  })

  it('exposes isLoading from the query', () => {
    mockUseGetOauthUmaResourcesByClientid.mockReturnValue({
      data: undefined,
      isLoading: true,
      refetch: mockRefetch,
    })
    const { result } = renderHook(() => useClientUmaResources('client-001'))
    expect(result.current.isLoading).toBe(true)
  })
})
