import { renderHook } from '@testing-library/react'
import { useOidcProperties } from 'Plugins/auth-server/components/OidcClients/hooks/useOidcProperties'

const mockDispatch = jest.fn()
jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: jest.fn((_show, _type, _msg) => ({ type: 'toast/update' })),
}))

jest.mock('@/utils/errorHandler', () => ({
  getQueryErrorMessage: jest.fn((_err, fallback) => fallback),
}))

const mockUseGetProperties = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetProperties: () => mockUseGetProperties(),
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockUseGetProperties.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
  })
})

describe('useOidcProperties', () => {
  it('returns undefined oidcConfiguration when no data', () => {
    const { result } = renderHook(() => useOidcProperties())
    expect(result.current.oidcConfiguration).toBeUndefined()
  })

  it('returns oidcConfiguration from query data', () => {
    const config = { issuer: 'https://auth.example.com', tokenEndpoint: '/token' }
    mockUseGetProperties.mockReturnValue({
      data: config,
      isLoading: false,
      isError: false,
      error: null,
    })
    const { result } = renderHook(() => useOidcProperties())
    expect(result.current.oidcConfiguration).toMatchObject({ issuer: 'https://auth.example.com' })
  })

  it('exposes isLoading from the query', () => {
    mockUseGetProperties.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    })
    const { result } = renderHook(() => useOidcProperties())
    expect(result.current.isLoading).toBe(true)
  })

  it('dispatches error toast when query fails', () => {
    mockUseGetProperties.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('properties error'),
    })
    renderHook(() => useOidcProperties())
    expect(mockDispatch).toHaveBeenCalled()
  })

  it('does not dispatch error toast when there is no error', () => {
    renderHook(() => useOidcProperties())
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('exposes isError from the query', () => {
    mockUseGetProperties.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('fail'),
    })
    const { result } = renderHook(() => useOidcProperties())
    expect(result.current.isError).toBe(true)
  })
})
