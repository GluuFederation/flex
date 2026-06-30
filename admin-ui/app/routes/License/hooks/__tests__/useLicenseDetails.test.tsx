import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useLicenseDetails } from '../useLicenseDetails'
import type { LicenseResponse } from 'JansConfigApi'
import type { UserActionPayload } from '@/redux/api/types/BackendApi'

type SelectFn = (data: LicenseResponse | undefined) => LicenseResponse | undefined

type QueryOptions = {
  enabled?: boolean
  select?: SelectFn
}

type DeleteMutationOptions = {
  mutation?: {
    onSuccess?: () => void | Promise<void>
    onError?: (error: Error) => void
  }
}

const mockUseGetAdminuiLicense = jest.fn()
const mockMutate = jest.fn()
const mockRefetch = jest.fn()
const mockPostUserAction = jest.fn()
const mockIsFourZeroThreeError = jest.fn()

let capturedDeleteOptions: DeleteMutationOptions | undefined

jest.mock('JansConfigApi', () => ({
  useGetAdminuiLicense: (opts: { query: QueryOptions }) => mockUseGetAdminuiLicense(opts),
  useLicenseConfigDelete: (opts: DeleteMutationOptions) => {
    capturedDeleteOptions = opts
    return { mutate: mockMutate, isPending: false }
  },
  getGetAdminuiLicenseQueryKey: () => ['adminui', 'license'],
}))

jest.mock('@/redux/api/backend-api', () => ({
  postUserAction: (userAction: UserActionPayload) => mockPostUserAction(userAction),
}))

jest.mock('@/utils/TokenController', () => ({
  isFourZeroThreeError: (error: Error) => mockIsFourZeroThreeError(error),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const rawLicense: LicenseResponse = {
  companyName: '"Acme Corp"',
  customerFirstName: '"Jane"',
  customerLastName: '"Doe"',
  customerEmail: '"jane@example.com"',
}

const buildStore = (hasSession = true) =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { hasSession, userinfo: { inum: 'a-1', name: 'admin' } }) => state,
      toastReducer: (state = { showToast: false }) => state,
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

const mockQueryReturn = (raw: LicenseResponse | undefined, isLoading = false) => {
  mockUseGetAdminuiLicense.mockImplementation((opts: { query: QueryOptions }) => {
    const data = raw !== undefined && opts.query.select ? opts.query.select(raw) : raw
    return { data, isLoading, refetch: mockRefetch }
  })
}

describe('useLicenseDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    capturedDeleteOptions = undefined
    mockIsFourZeroThreeError.mockReturnValue(false)
    mockPostUserAction.mockResolvedValue({ status: 200 })
  })

  it('strips surrounding quotes from the license fields', () => {
    mockQueryReturn(rawLicense)
    const store = buildStore(true)
    const { result } = renderHook(() => useLicenseDetails(), { wrapper: createWrapper(store) })

    expect(result.current.item.companyName).toBe('Acme Corp')
    expect(result.current.item.customerFirstName).toBe('Jane')
    expect(result.current.item.customerLastName).toBe('Doe')
    expect(result.current.item.customerEmail).toBe('jane@example.com')
  })

  it('falls back to an empty item when there is no data', () => {
    mockQueryReturn(undefined)
    const store = buildStore(true)
    const { result } = renderHook(() => useLicenseDetails(), { wrapper: createWrapper(store) })

    expect(result.current.item).toEqual({})
  })

  it('exposes the shared query key, refetch and reset helpers', () => {
    mockQueryReturn(rawLicense)
    const store = buildStore(true)
    const { result } = renderHook(() => useLicenseDetails(), { wrapper: createWrapper(store) })

    expect(result.current.queryKey).toEqual(['adminui', 'license'])
    expect(result.current.refetch).toBe(mockRefetch)
    expect(typeof result.current.resetLicense).toBe('function')
    expect(result.current.isResetting).toBe(false)
  })

  it('reflects the query loading state', () => {
    mockQueryReturn(undefined, true)
    const store = buildStore(true)
    const { result } = renderHook(() => useLicenseDetails(), { wrapper: createWrapper(store) })

    expect(result.current.loading).toBe(true)
  })

  it('triggers the delete mutation when resetLicense is called', () => {
    mockQueryReturn(rawLicense)
    const store = buildStore(true)
    const { result } = renderHook(() => useLicenseDetails(), { wrapper: createWrapper(store) })

    act(() => {
      result.current.resetLicense('reset reason')
    })

    expect(mockMutate).toHaveBeenCalledTimes(1)
  })

  it('invalidates the license query and toasts success on a successful reset', async () => {
    const invalidateSpy = jest
      .spyOn(QueryClient.prototype, 'invalidateQueries')
      .mockResolvedValue(undefined)
    const onResetSuccess = jest.fn()
    mockQueryReturn(rawLicense)
    const store = buildStore(true)
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    renderHook(() => useLicenseDetails({ onResetSuccess }), { wrapper: createWrapper(store) })

    await act(async () => {
      await capturedDeleteOptions?.mutation?.onSuccess?.()
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['adminui', 'license'] })
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'toast/updateToast',
        payload: expect.objectContaining({
          showToast: true,
          type: 'success',
          message: 'messages.license_reset_success',
        }),
      }),
    )
    expect(onResetSuccess).toHaveBeenCalledTimes(1)

    invalidateSpy.mockRestore()
  })

  it('toasts an error with the error message on a non-403 reset failure', () => {
    mockIsFourZeroThreeError.mockReturnValue(false)
    mockQueryReturn(rawLicense)
    const store = buildStore(true)
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    renderHook(() => useLicenseDetails(), { wrapper: createWrapper(store) })

    act(() => {
      capturedDeleteOptions?.mutation?.onError?.(new Error('boom'))
    })

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'toast/updateToast',
        payload: expect.objectContaining({
          showToast: true,
          type: 'error',
          message: 'boom',
        }),
      }),
    )
  })

  it('dispatches a session-expired logout audit on a 403 reset failure', () => {
    mockIsFourZeroThreeError.mockReturnValue(true)
    mockQueryReturn(rawLicense)
    const store = buildStore(true)
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    renderHook(() => useLicenseDetails(), { wrapper: createWrapper(store) })

    act(() => {
      capturedDeleteOptions?.mutation?.onError?.(new Error('forbidden'))
    })

    const dispatchedTypes = dispatchSpy.mock.calls.map(([action]) =>
      typeof action === 'object' && action !== null && 'type' in action ? action.type : undefined,
    )
    expect(dispatchedTypes).toContain('session/auditLogoutLogs')
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'toast/updateToast' }),
    )
  })

  it('disables the query when there is no session', () => {
    mockQueryReturn(undefined)
    const store = buildStore(false)
    renderHook(() => useLicenseDetails(), { wrapper: createWrapper(store) })

    const [opts] = mockUseGetAdminuiLicense.mock.calls[0]
    expect(opts.query.enabled).toBe(false)
  })
})
