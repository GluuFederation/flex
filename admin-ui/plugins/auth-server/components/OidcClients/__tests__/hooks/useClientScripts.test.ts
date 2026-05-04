import { renderHook } from '@testing-library/react'
import { useClientScripts } from 'Plugins/auth-server/components/OidcClients/hooks/useClientScripts'

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

const mockUseGetConfigScripts = jest.fn()
const proxyUseGetConfigScripts = (...args: Parameters<typeof mockUseGetConfigScripts>) =>
  mockUseGetConfigScripts(...args)

jest.mock('JansConfigApi', () => ({
  useGetConfigScripts: proxyUseGetConfigScripts,
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockUseGetConfigScripts.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
  })
})

describe('useClientScripts', () => {
  it('returns empty scripts when no data', () => {
    const { result } = renderHook(() => useClientScripts())
    expect(result.current.scripts).toEqual([])
  })

  it('returns scripts from query data', () => {
    mockUseGetConfigScripts.mockReturnValue({
      data: {
        entries: [{ name: 'script-one', scriptType: 'PERSON_AUTHENTICATION' }],
      },
      isLoading: false,
      isError: false,
      error: null,
    })
    const { result } = renderHook(() => useClientScripts())
    expect(result.current.scripts).toHaveLength(1)
    expect(result.current.scripts[0].name).toBe('script-one')
  })

  it('exposes isLoading from the query', () => {
    mockUseGetConfigScripts.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    })
    const { result } = renderHook(() => useClientScripts())
    expect(result.current.isLoading).toBe(true)
  })

  it('dispatches error toast when query fails', () => {
    mockUseGetConfigScripts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('scripts error'),
    })
    renderHook(() => useClientScripts())
    expect(mockDispatch).toHaveBeenCalled()
  })

  it('does not dispatch error toast when there is no error', () => {
    renderHook(() => useClientScripts())
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('exposes isError from the query', () => {
    mockUseGetConfigScripts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('fail'),
    })
    const { result } = renderHook(() => useClientScripts())
    expect(result.current.isError).toBe(true)
  })
})
