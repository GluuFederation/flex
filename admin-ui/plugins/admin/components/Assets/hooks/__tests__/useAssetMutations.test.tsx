import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  useCreateAssetWithAudit,
  useUpdateAssetWithAudit,
  useDeleteAssetWithAudit,
} from '../useAssetMutations'
import type { AssetFormData } from '../../types'

const mockCustomInstance = jest.fn()
const mockDeleteMutateAsync = jest.fn()
const mockLogAction = jest.fn()
const mockInvalidate = jest.fn()

jest.mock('Orval', () => ({
  ...jest.requireActual('Orval'),
  customInstance: (config: { url: string; method: string; data: FormData }) =>
    mockCustomInstance(config),
}))

jest.mock('JansConfigApi', () => ({
  useDeleteAsset: () => ({
    mutateAsync: (vars: { inum: string }) => mockDeleteMutateAsync(vars),
    isPending: false,
    isError: false,
    error: null,
  }),
  getGetAllAssetsQueryKey: () => ['/api/v1/jans-assets'],
}))

jest.mock('../useAssetAudit', () => ({
  useAssetAudit: () => ({
    logAction: (actionType: string, resource: string, payload: object) =>
      mockLogAction(actionType, resource, payload),
  }),
}))

jest.mock('@/utils/queryUtils', () => ({
  invalidateQueriesByKey: (queryClient: object, queryKey: readonly string[]) =>
    mockInvalidate(queryClient, queryKey),
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

const formData: AssetFormData = {
  fileName: 'logo.png',
  description: 'company logo',
  document: 'inline-content',
  service: 'jans-auth',
  enabled: true,
}

describe('useAssetMutations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCustomInstance.mockResolvedValue({ inum: 'asset-1' })
    mockDeleteMutateAsync.mockResolvedValue({})
    mockLogAction.mockResolvedValue(undefined)
    mockInvalidate.mockResolvedValue(undefined)
  })

  describe('useCreateAssetWithAudit', () => {
    it('uploads via POST, logs the audit and invalidates the list', async () => {
      const onSuccess = jest.fn()
      const store = buildStore()
      const { result } = renderHook(() => useCreateAssetWithAudit({ onSuccess }), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.createAsset(formData, 'created')
      })

      expect(mockCustomInstance).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/api/v1/jans-assets/upload', method: 'POST' }),
      )
      expect(mockLogAction).toHaveBeenCalledWith(
        'CREATE',
        'asset',
        expect.objectContaining({ action_message: 'created', action_data: formData }),
      )
      expect(mockInvalidate).toHaveBeenCalled()
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })

    it('dispatches an error toast and calls onError when upload fails', async () => {
      mockCustomInstance.mockRejectedValueOnce({
        response: { data: { responseMessage: 'upload boom' } },
      })
      const onError = jest.fn()
      const store = buildStore()
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      const { result } = renderHook(() => useCreateAssetWithAudit({ onError }), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await expect(result.current.createAsset(formData)).rejects.toBeDefined()
      })

      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalled()
      })
      expect(onError).toHaveBeenCalledTimes(1)
      expect(mockLogAction).not.toHaveBeenCalled()
    })
  })

  describe('useUpdateAssetWithAudit', () => {
    it('uploads via PUT and logs an UPDATE audit', async () => {
      const store = buildStore()
      const { result } = renderHook(() => useUpdateAssetWithAudit(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.updateAsset({ ...formData, inum: 'asset-1' }, 'updated')
      })

      expect(mockCustomInstance).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/api/v1/jans-assets/upload', method: 'PUT' }),
      )
      expect(mockLogAction).toHaveBeenCalledWith('UPDATE', 'asset', expect.any(Object))
    })
  })

  describe('useDeleteAssetWithAudit', () => {
    it('deletes by inum, logs a DELETION audit and shows a success toast', async () => {
      const onSuccess = jest.fn()
      const store = buildStore()
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      const { result } = renderHook(() => useDeleteAssetWithAudit({ onSuccess }), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.deleteAsset('asset-1', 'removed')
      })

      expect(mockDeleteMutateAsync).toHaveBeenCalledWith({ inum: 'asset-1' })
      expect(mockLogAction).toHaveBeenCalledWith(
        'DELETION',
        'asset',
        expect.objectContaining({ action_data: { inum: 'asset-1' } }),
      )
      expect(mockInvalidate).toHaveBeenCalledWith(expect.any(Object), ['/api/v1/jans-assets'])
      expect(dispatchSpy).toHaveBeenCalled()
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })

    it('dispatches an error toast and calls onError when delete fails', async () => {
      mockDeleteMutateAsync.mockRejectedValueOnce(new Error('delete boom'))
      const onError = jest.fn()
      const store = buildStore()
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      const { result } = renderHook(() => useDeleteAssetWithAudit({ onError }), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await expect(result.current.deleteAsset('asset-1')).rejects.toBeDefined()
      })

      expect(dispatchSpy).toHaveBeenCalled()
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })
})
