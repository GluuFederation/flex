import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/redux/features/authSlice'
import type { Config } from '@/redux/features/types/authTypes'
import { useCedarlingLogToggle } from '../useCedarlingLogToggle'

type MutationHandlers = {
  onSuccess: (config: Config) => void
  onError: (error: Error) => void
}
type MutateArgs = [{ data: Config }, MutationHandlers]
type ConfQueryOptions = { query?: { enabled?: boolean } }

const mockMutate = jest.fn<void, MutateArgs>()
const mockUseGetAdminuiConf = jest.fn()
let mockIsPending = false

jest.mock('JansConfigApi', () => ({
  useGetAdminuiConf: (options?: ConfQueryOptions) => mockUseGetAdminuiConf(options),
  useEditAdminuiConf: () => ({
    mutate: (...args: MutateArgs) => mockMutate(...args),
    isPending: mockIsPending,
  }),
  getGetAdminuiConfQueryKey: () => ['/admin-ui/config'],
}))

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

const buildStore = (hasSession = true) => {
  const store = configureStore({ reducer: { authReducer } })
  if (hasSession) {
    store.dispatch({ type: 'auth/createAdminUiSessionResponse', payload: { success: true } })
  }
  return store
}

const renderToggle = (config?: Config, { hasSession = true } = {}) => {
  mockUseGetAdminuiConf.mockReturnValue({ data: config })
  const store = buildStore(hasSession)
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  )
  return { store, invalidateSpy, ...renderHook(() => useCedarlingLogToggle(), { wrapper }) }
}

describe('useCedarlingLogToggle reads the config the Config API query holds', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsPending = false
  })

  it('reports enabled when the stored log type is std_out', () => {
    const { result } = renderToggle({ cedarlingLogType: 'std_out' })

    expect(result.current.enabled).toBe(true)
  })

  it('reports disabled when the stored log type is off', () => {
    const { result } = renderToggle({ cedarlingLogType: 'off' })

    expect(result.current.enabled).toBe(false)
  })

  it('sends the other stored config fields back with the toggled log type', () => {
    const { result } = renderToggle({
      cedarlingLogType: 'off',
      sessionTimeoutInMins: 30,
      acrValues: 'basic',
      additionalParameters: [{ key: 'a', value: 'b' }],
    })

    act(() => result.current.toggle())

    expect(mockMutate).toHaveBeenCalledWith(
      {
        data: {
          sessionTimeoutInMins: 30,
          acrValues: 'basic',
          additionalParameters: [{ key: 'a', value: 'b' }],
          cedarlingLogType: 'std_out',
        },
      },
      expect.anything(),
    )
  })

  it('shows the new state optimistically before the request settles', () => {
    const { result } = renderToggle({ cedarlingLogType: 'off' })

    act(() => result.current.toggle())

    expect(result.current.enabled).toBe(true)
  })

  it('invalidates the configuration query on success so the settings form refetches', () => {
    const { result, invalidateSpy } = renderToggle({ cedarlingLogType: 'off' })

    act(() => result.current.toggle())
    const [, handlers] = mockMutate.mock.calls[0]
    act(() => handlers.onSuccess({ cedarlingLogType: 'std_out' }))

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['/admin-ui/config'] })
  })

  it('writes the saved config back into redux on success', async () => {
    const { result, store } = renderToggle({ cedarlingLogType: 'off' })

    act(() => result.current.toggle())

    const [, handlers] = mockMutate.mock.calls[0]
    act(() => handlers.onSuccess({ cedarlingLogType: 'std_out' }))

    await waitFor(() =>
      expect(store.getState().authReducer.config.cedarlingLogType).toBe('std_out'),
    )
  })

  it('rolls the optimistic state back when the request fails', () => {
    const { result } = renderToggle({ cedarlingLogType: 'off' })

    act(() => result.current.toggle())
    const [, handlers] = mockMutate.mock.calls[0]
    act(() => handlers.onError(new Error('save boom')))

    expect(result.current.enabled).toBe(false)
  })

  it('ignores a toggle while a save is already in flight', () => {
    mockIsPending = true
    const { result } = renderToggle({ cedarlingLogType: 'off' })

    act(() => result.current.toggle())

    expect(mockMutate).not.toHaveBeenCalled()
  })
})

describe('useCedarlingLogToggle before the configuration query resolves', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsPending = false
  })

  it('reports the config as not ready while the query has no data', () => {
    const { result } = renderToggle(undefined)

    expect(result.current.isConfigReady).toBe(false)
  })

  it('does not submit a configuration write while the stored config is still empty', () => {
    const { result } = renderToggle(undefined)

    act(() => result.current.toggle())

    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('reports the config as ready once the query has resolved', () => {
    const { result } = renderToggle({ cedarlingLogType: 'off' })

    expect(result.current.isConfigReady).toBe(true)
  })

  it('keeps the configuration query disabled until a session exists', () => {
    renderToggle({ cedarlingLogType: 'off' }, { hasSession: false })

    expect(mockUseGetAdminuiConf).toHaveBeenCalledWith({ query: { enabled: false } })
  })

  it('enables the configuration query once a session exists', () => {
    renderToggle({ cedarlingLogType: 'off' })

    expect(mockUseGetAdminuiConf).toHaveBeenCalledWith({ query: { enabled: true } })
  })
})
