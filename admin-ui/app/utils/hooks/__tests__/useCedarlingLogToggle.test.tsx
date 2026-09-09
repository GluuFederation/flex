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

const mockMutate = jest.fn<void, MutateArgs>()
let mockIsPending = false

jest.mock('JansConfigApi', () => ({
  useEditAdminuiConf: () => ({
    mutate: (...args: MutateArgs) => mockMutate(...args),
    isPending: mockIsPending,
  }),
}))

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

const buildStore = (config?: Config) => {
  const store = configureStore({ reducer: { authReducer } })
  if (config) {
    store.dispatch({ type: 'auth/getOAuth2ConfigResponse', payload: { config } })
  }
  return store
}

const renderToggle = (config?: Config) => {
  const store = buildStore(config)
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  )
  return { store, ...renderHook(() => useCedarlingLogToggle(), { wrapper }) }
}

describe('useCedarlingLogToggle reads the config redux already holds', () => {
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

  it('writes the saved config back into redux on success', async () => {
    const { result, store } = renderToggle({ cedarlingLogType: 'off' })

    act(() => result.current.toggle())

    const [, handlers] = mockMutate.mock.calls[0]
    act(() => handlers.onSuccess({ cedarlingLogType: 'std_out' }))

    await waitFor(() =>
      expect(store.getState().authReducer.config.cedarlingLogType).toBe('std_out'),
    )
    expect(result.current.enabled).toBe(true)
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

describe('useCedarlingLogToggle before redux holds a config', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsPending = false
  })

  it('reports the config as not ready before getOAuth2Config has populated it', () => {
    const { result } = renderToggle()

    expect(result.current.isConfigReady).toBe(false)
  })

  it('does not submit a configuration write while the stored config is still empty', () => {
    const { result } = renderToggle()

    act(() => result.current.toggle())

    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('reports the config as ready once getOAuth2Config has populated it', () => {
    const { result } = renderToggle({ cedarlingLogType: 'off' })

    expect(result.current.isConfigReady).toBe(true)
  })
})
