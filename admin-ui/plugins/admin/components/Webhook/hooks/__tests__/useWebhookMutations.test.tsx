import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  useCreateWebhookWithAudit,
  useUpdateWebhookWithAudit,
  useDeleteWebhookWithAudit,
} from '../useWebhookMutations'
import type { WebhookEntry } from '../../types'

const mockPostMutateAsync = jest.fn()
const mockPutMutateAsync = jest.fn()
const mockDeleteMutateAsync = jest.fn()
const mockLogAction = jest.fn()
const mockInvalidateByKey = jest.fn()

jest.mock('JansConfigApi', () => ({
  usePostWebhook: () => ({
    mutateAsync: (vars: { data: WebhookEntry }) => mockPostMutateAsync(vars),
    isPending: false,
    isError: false,
    error: null,
  }),
  usePutWebhook: () => ({
    mutateAsync: (vars: { data: WebhookEntry }) => mockPutMutateAsync(vars),
    isPending: false,
    isError: false,
    error: null,
  }),
  useDeleteWebhookByInum: () => ({
    mutateAsync: (vars: { webhookId: string }) => mockDeleteMutateAsync(vars),
    isPending: false,
    isError: false,
    error: null,
  }),
  getGetAllWebhooksQueryKey: () => ['/api/v1/admin-ui/webhook'],
  getGetFeaturesByWebhookIdQueryKey: (id: string) => ['/api/v1/admin-ui/webhook/features', id],
}))

jest.mock('@/utils/queryUtils', () => {
  const invalidateQueriesByKey = (queryClient: object, queryKey: readonly string[]) =>
    mockInvalidateByKey(queryClient, queryKey)
  return { invalidateQueriesByKey, default: { invalidateQueriesByKey } }
})

jest.mock('../useWebhookAudit', () => ({
  useWebhookAudit: () => ({
    logAction: (actionType: string, resource: string, payload: object) =>
      mockLogAction(actionType, resource, payload),
  }),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const buildStore = () =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { hasSession: true }) => state,
      toastReducer: (state = { showToast: false, message: '', type: 'success' }) => state,
      noReducer: (state = {}) => state,
    }),
  })

const createWrapper = (store: ReturnType<typeof buildStore>) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  )
}

const webhook: WebhookEntry = { inum: 'w-1', displayName: 'hook', url: 'https://example.com' }

describe('useWebhookMutations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPostMutateAsync.mockResolvedValue({ inum: 'w-1' })
    mockPutMutateAsync.mockResolvedValue({ inum: 'w-1' })
    mockDeleteMutateAsync.mockResolvedValue({})
    mockLogAction.mockResolvedValue(undefined)
  })

  describe('useCreateWebhookWithAudit', () => {
    it('creates a webhook, logs a CREATE audit and invalidates queries', async () => {
      const onSuccess = jest.fn()
      const store = buildStore()
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      // invalidateWebhooksByFeatureQueries calls queryClient.invalidateQueries
      // with a predicate directly (not via queryUtils), so spy on it here.
      const predicateInvalidateSpy = jest
        .spyOn(QueryClient.prototype, 'invalidateQueries')
        .mockResolvedValue(undefined)
      const { result } = renderHook(() => useCreateWebhookWithAudit({ onSuccess }), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.createWebhook(webhook, 'created')
      })

      expect(mockPostMutateAsync).toHaveBeenCalledWith({ data: webhook })
      expect(mockLogAction).toHaveBeenCalledWith(
        'CREATE',
        'webhook',
        expect.objectContaining({ action_message: 'created', action_data: webhook }),
      )
      expect(mockInvalidateByKey).toHaveBeenCalled()
      expect(predicateInvalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ predicate: expect.any(Function) }),
      )
      expect(dispatchSpy).toHaveBeenCalled()
      expect(onSuccess).toHaveBeenCalledTimes(1)

      predicateInvalidateSpy.mockRestore()
    })

    it('dispatches an error toast and calls onError on failure', async () => {
      mockPostMutateAsync.mockRejectedValueOnce({
        response: { data: { responseMessage: 'create boom' } },
      })
      const onError = jest.fn()
      const store = buildStore()
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      const { result } = renderHook(() => useCreateWebhookWithAudit({ onError }), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await expect(result.current.createWebhook(webhook)).rejects.toBeDefined()
      })

      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalled()
      })
      expect(onError).toHaveBeenCalledTimes(1)
      expect(mockLogAction).not.toHaveBeenCalled()
    })
  })

  describe('useUpdateWebhookWithAudit', () => {
    it('updates a webhook, logs an UPDATE audit and invalidates feature queries by inum', async () => {
      const store = buildStore()
      const { result } = renderHook(() => useUpdateWebhookWithAudit(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.updateWebhook(webhook, 'updated')
      })

      expect(mockPutMutateAsync).toHaveBeenCalledWith({ data: webhook })
      expect(mockLogAction).toHaveBeenCalledWith('UPDATE', 'webhook', expect.any(Object))
      // once for all-webhooks key, once for features-by-inum key
      expect(mockInvalidateByKey).toHaveBeenCalledTimes(2)
    })

    it('skips the features-by-inum invalidation when inum is absent', async () => {
      const store = buildStore()
      const { result } = renderHook(() => useUpdateWebhookWithAudit(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.updateWebhook(
          { displayName: 'no-inum', url: 'https://example.com/no-inum' },
          'updated',
        )
      })

      expect(mockInvalidateByKey).toHaveBeenCalledTimes(1)
    })
  })

  describe('useDeleteWebhookWithAudit', () => {
    it('deletes by inum, logs a DELETION audit and shows a success toast', async () => {
      const onSuccess = jest.fn()
      const store = buildStore()
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      const predicateInvalidateSpy = jest
        .spyOn(QueryClient.prototype, 'invalidateQueries')
        .mockResolvedValue(undefined)
      const { result } = renderHook(() => useDeleteWebhookWithAudit({ onSuccess }), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.deleteWebhook('w-1', 'removed')
      })

      expect(mockDeleteMutateAsync).toHaveBeenCalledWith({ webhookId: 'w-1' })
      expect(mockLogAction).toHaveBeenCalledWith(
        'DELETION',
        'webhook',
        expect.objectContaining({ action_data: { inum: 'w-1' } }),
      )
      expect(mockInvalidateByKey).toHaveBeenCalledWith(expect.any(Object), [
        '/api/v1/admin-ui/webhook',
      ])
      expect(predicateInvalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ predicate: expect.any(Function) }),
      )
      expect(dispatchSpy).toHaveBeenCalled()
      expect(onSuccess).toHaveBeenCalledTimes(1)

      predicateInvalidateSpy.mockRestore()
    })

    it('dispatches an error toast and calls onError on failure', async () => {
      mockDeleteMutateAsync.mockRejectedValueOnce(new Error('delete boom'))
      const onError = jest.fn()
      const store = buildStore()
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      const { result } = renderHook(() => useDeleteWebhookWithAudit({ onError }), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await expect(result.current.deleteWebhook('w-1')).rejects.toBeDefined()
      })

      expect(dispatchSpy).toHaveBeenCalled()
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })
})
