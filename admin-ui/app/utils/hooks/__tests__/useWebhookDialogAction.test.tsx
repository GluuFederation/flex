import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import useWebhookDialogAction from '../useWebhookDialogAction'

type WebhookEntry = { inum?: string; displayName?: string; jansEnabled?: boolean }

type QueryOptions = {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  staleTime?: number
}

const mockHasCedarReadPermission = jest.fn()
const mockAuthorizeHelper = jest.fn()
const mockUseGetWebhooksByFeatureId = jest.fn()

jest.mock('@/cedarling/hooks/useCedarling', () => ({
  useCedarling: () => ({
    hasCedarReadPermission: (id: string) => mockHasCedarReadPermission(id),
    authorizeHelper: mockAuthorizeHelper,
  }),
}))

jest.mock('@/context/theme/themeContext', () => ({
  useTheme: () => ({ state: { theme: 'light' } }),
}))

jest.mock('@/context/theme/config', () => ({
  __esModule: true,
  default: () => ({
    fontColor: '#000',
    borderColor: '#ccc',
    badges: { statusActive: '#0f0', filledBadgeText: '#fff' },
  }),
}))

jest.mock('@/routes/Apps/Gluu/styles/GluuCommitDialog.style', () => ({
  useStyles: () => ({ classes: {} }),
}))

jest.mock('@/utils/styles/WebhookTriggerModal.style', () => ({
  useWebhookTriggerModalStyles: () => ({ classes: {} }),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

jest.mock('JansConfigApi', () => ({
  useGetWebhooksByFeatureId: (feature: string, opts: { query: QueryOptions }) =>
    mockUseGetWebhooksByFeatureId(feature, opts),
}))

const buildStore = () =>
  configureStore({
    reducer: combineReducers({
      webhookReducer: (
        state = { webhookModal: false, triggerWebhookInProgress: false },
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

const mockQueryReturn = (
  data: WebhookEntry[] | undefined,
  { isFetching = false, isFetched = true } = {},
) => {
  mockUseGetWebhooksByFeatureId.mockReturnValue({
    data,
    isFetching,
    isFetched,
  })
}

describe('useWebhookDialogAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockHasCedarReadPermission.mockReturnValue(true)
    mockQueryReturn([{ inum: 'wh-1', displayName: 'Hook 1', jansEnabled: true }])
  })

  it('returns the expected action shape', () => {
    const store = buildStore()
    const { result } = renderHook(() => useWebhookDialogAction({ feature: 'feat-1', modal: true }), {
      wrapper: createWrapper(store),
    })

    expect(typeof result.current.onCloseModal).toBe('function')
    expect(typeof result.current.webhookTriggerModal).toBe('function')
    expect(typeof result.current.webhookCheckComplete).toBe('boolean')
    expect(typeof result.current.willShowWebhookModal).toBe('boolean')
    expect(result.current.isLoadingWebhooks).toBe(false)
  })

  it('dispatches reset actions when onCloseModal is called', () => {
    const store = buildStore()
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    const { result } = renderHook(() => useWebhookDialogAction({ feature: 'feat-1', modal: true }), {
      wrapper: createWrapper(store),
    })

    dispatchSpy.mockClear()
    act(() => {
      result.current.onCloseModal()
    })

    const types = dispatchSpy.mock.calls.map((call) => (call[0] as { type: string }).type)
    expect(types).toContain('webhook/setWebhookModal')
    expect(types).toContain('webhook/completeTriggerWebhook')
    expect(types).toContain('webhook/setWebhookTriggerResults')
    expect(types).toContain('webhook/setFeatureToTrigger')
  })

  it('calls authorizeHelper for the webhook scopes', () => {
    const store = buildStore()
    renderHook(() => useWebhookDialogAction({ feature: 'feat-1', modal: true }), {
      wrapper: createWrapper(store),
    })

    expect(mockAuthorizeHelper).toHaveBeenCalled()
  })

  it('enables the webhooks query when permitted, modal open, and feature present', () => {
    const store = buildStore()
    renderHook(() => useWebhookDialogAction({ feature: 'feat-1', modal: true }), {
      wrapper: createWrapper(store),
    })

    const [feature, opts] = mockUseGetWebhooksByFeatureId.mock.calls[0]
    expect(feature).toBe('feat-1')
    expect(opts.query.enabled).toBe(true)
  })

  it('disables the webhooks query when read permission is denied', () => {
    mockHasCedarReadPermission.mockReturnValue(false)
    const store = buildStore()
    renderHook(() => useWebhookDialogAction({ feature: 'feat-1', modal: true }), {
      wrapper: createWrapper(store),
    })

    const [, opts] = mockUseGetWebhooksByFeatureId.mock.calls[0]
    expect(opts.query.enabled).toBe(false)
  })

  it('flags willShowWebhookModal when enabled webhooks exist and read is permitted', () => {
    const store = buildStore()
    const { result } = renderHook(
      () => useWebhookDialogAction({ feature: 'feat-1', modal: true }),
      { wrapper: createWrapper(store) },
    )

    expect(result.current.willShowWebhookModal).toBe(true)
  })

  it('does not flag willShowWebhookModal when there are no enabled webhooks', () => {
    mockQueryReturn([{ inum: 'wh-1', displayName: 'Hook 1', jansEnabled: false }])
    const store = buildStore()
    const { result } = renderHook(
      () => useWebhookDialogAction({ feature: 'feat-1', modal: true }),
      { wrapper: createWrapper(store) },
    )

    expect(result.current.willShowWebhookModal).toBe(false)
  })

  it('treats the check as incomplete when the modal is closed', () => {
    const store = buildStore()
    const { result } = renderHook(
      () => useWebhookDialogAction({ feature: 'feat-1', modal: false }),
      { wrapper: createWrapper(store) },
    )

    expect(result.current.webhookCheckComplete).toBe(false)
  })

  it('completes the check immediately when there is no feature', () => {
    const store = buildStore()
    const { result } = renderHook(() => useWebhookDialogAction({ modal: true }), {
      wrapper: createWrapper(store),
    })

    expect(result.current.webhookCheckComplete).toBe(true)
  })

  it('renders no portal content from webhookTriggerModal when the modal is not open', () => {
    const store = buildStore()
    const { result } = renderHook(() => useWebhookDialogAction({ feature: 'feat-1', modal: true }), {
      wrapper: createWrapper(store),
    })

    const rendered = result.current.webhookTriggerModal({ closeModal: jest.fn() })
    expect(rendered).toBeNull()
  })
})
