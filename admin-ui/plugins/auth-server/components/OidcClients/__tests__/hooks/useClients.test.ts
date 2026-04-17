import { renderHook } from '@testing-library/react'
import { useClients } from 'Plugins/auth-server/components/OidcClients/hooks/useClients'

const mockDispatch = jest.fn()

jest.mock('@/redux/hooks', () => ({
  useAppSelector: jest.fn((selector: (s: unknown) => unknown) =>
    selector({ authReducer: { hasSession: true } }),
  ),
  useAppDispatch: () => mockDispatch,
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: jest.fn(),
}))

const mockRefetch = jest.fn()
const mockUseGetOauthOpenidClients = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetOauthOpenidClients: (...args: unknown[]) => mockUseGetOauthOpenidClients(...args),
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockUseGetOauthOpenidClients.mockReturnValue({
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: mockRefetch,
  })
})

describe('useClients', () => {
  it('returns empty clients and zero totalCount when no data', () => {
    const { result } = renderHook(() => useClients({ limit: 10, startIndex: 0 }))
    expect(result.current.clients).toEqual([])
    expect(result.current.totalCount).toBe(0)
  })

  it('returns clients and totalCount from query data', () => {
    mockUseGetOauthOpenidClients.mockReturnValue({
      data: { entries: [{ inum: 'abc' }, { inum: 'def' }], totalEntriesCount: 2 },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    })
    const { result } = renderHook(() => useClients({ limit: 10, startIndex: 0 }))
    expect(result.current.clients).toHaveLength(2)
    expect(result.current.totalCount).toBe(2)
  })

  it('exposes isLoading from the query', () => {
    mockUseGetOauthOpenidClients.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    })
    const { result } = renderHook(() => useClients({ limit: 10 }))
    expect(result.current.isLoading).toBe(true)
  })

  it('dispatches an error toast when the query fails', () => {
    mockUseGetOauthOpenidClients.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error('network error'),
      refetch: mockRefetch,
    })
    renderHook(() => useClients({ limit: 10 }))
    expect(mockDispatch).toHaveBeenCalled()
  })

  it('does not dispatch an error toast when there is no error', () => {
    renderHook(() => useClients({ limit: 10 }))
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('exposes the refetch function', () => {
    const { result } = renderHook(() => useClients({ limit: 10 }))
    expect(result.current.refetch).toBe(mockRefetch)
  })
})
