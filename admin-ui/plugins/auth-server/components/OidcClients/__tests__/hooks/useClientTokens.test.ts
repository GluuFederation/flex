import { renderHook, act } from '@testing-library/react'
import { useClientTokens } from 'Plugins/auth-server/components/OidcClients/hooks/useClientTokens'
import type { UseClientTokensParams } from 'Plugins/auth-server/components/OidcClients/types'

const mockDispatch = jest.fn()
jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: jest.fn((_show, _type, _msg) => ({ type: 'toast/update' })),
}))

const mockMutateAsync = jest.fn()
const mockRefetch = jest.fn()
const mockUseSearchToken = jest.fn()
const mockUseRevokeToken = jest.fn()
const mockInvalidateQueriesByKey = jest.fn()

jest.mock('JansConfigApi', () => ({
  useSearchToken: mockUseSearchToken,
  useRevokeToken: () => mockUseRevokeToken(),
  getSearchTokenQueryKey: jest.fn(() => ['searchToken']),
}))

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({}),
}))

jest.mock('@/utils/queryUtils', () => ({
  invalidateQueriesByKey: mockInvalidateQueriesByKey,
}))

const DEFAULT_PARAMS: UseClientTokensParams = {
  clientInum: 'client-001',
  pattern: { dateAfter: null, dateBefore: null },
  filterField: 'expirationDate',
  pageNumber: 0,
  limit: 10,
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUseSearchToken.mockReturnValue({
    data: undefined,
    isLoading: false,
    refetch: mockRefetch,
  })
  mockUseRevokeToken.mockReturnValue({
    mutateAsync: mockMutateAsync,
    isPending: false,
  })
  mockInvalidateQueriesByKey.mockResolvedValue(undefined)
})

describe('useClientTokens', () => {
  it('returns empty rows and zero totalItems when no data', () => {
    const { result } = renderHook(() => useClientTokens(DEFAULT_PARAMS))
    expect(result.current.rows).toEqual([])
    expect(result.current.totalItems).toBe(0)
  })

  it('maps token entities to ClientTokenRow shape', () => {
    mockUseSearchToken.mockReturnValue({
      data: {
        entries: [
          {
            tokenCode: 'tok-abc',
            tokenType: 'access_token',
            scope: 'openid',
            deletable: true,
            grantType: 'authorization_code',
            expirationDate: '2024-12-31',
            creationDate: '2024-01-01',
          },
        ],
        totalEntriesCount: 1,
      },
      isLoading: false,
      refetch: mockRefetch,
    })
    const { result } = renderHook(() => useClientTokens(DEFAULT_PARAMS))
    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0].tokenCode).toBe('tok-abc')
    expect(result.current.totalItems).toBe(1)
  })

  it('revokeToken calls mutateAsync and dispatches success toast', async () => {
    mockMutateAsync.mockResolvedValue(undefined)
    const { result } = renderHook(() => useClientTokens(DEFAULT_PARAMS))
    await act(async () => {
      await result.current.revokeToken('tok-abc')
    })
    expect(mockMutateAsync).toHaveBeenCalledWith({ tknCde: 'tok-abc' })
    expect(mockDispatch).toHaveBeenCalled()
    expect(mockInvalidateQueriesByKey).toHaveBeenCalled()
  })

  it('revokeToken dispatches error toast and rethrows on failure', async () => {
    mockMutateAsync.mockRejectedValue(new Error('revoke failed'))
    const { result } = renderHook(() => useClientTokens(DEFAULT_PARAMS))
    await expect(
      act(async () => {
        await result.current.revokeToken('tok-abc')
      }),
    ).rejects.toThrow('revoke failed')
    expect(mockDispatch).toHaveBeenCalled()
  })

  it('exposes the refetch function', () => {
    const { result } = renderHook(() => useClientTokens(DEFAULT_PARAMS))
    expect(result.current.refetch).toBe(mockRefetch)
  })
})
