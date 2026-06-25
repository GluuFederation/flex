import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { useCreateScope, useUpdateScope } from '../useScopeMutations'
import type { Scope, ModifiedFields } from '../../types'

const mockCreateMutateAsync = jest.fn()
const mockUpdateMutateAsync = jest.fn()
const mockLogScopeCreation = jest.fn()
const mockLogScopeUpdate = jest.fn()
const mockNavigateToScopeList = jest.fn()
const mockUpdateToast = jest.fn()
const mockTriggerWebhook = jest.fn()

jest.mock('JansConfigApi', () => ({
  usePostOauthScopes: () => ({
    mutateAsync: mockCreateMutateAsync,
    isPending: false,
    isError: false,
    error: null,
  }),
  usePutOauthScopes: () => ({
    mutateAsync: mockUpdateMutateAsync,
    isPending: false,
    isError: false,
    error: null,
  }),
  getGetOauthScopesQueryKey: () => ['/scopes'],
  getGetOauthScopesByInumQueryKey: (inum: string) => [`/scopes/inum/${inum}`],
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: (showToast: boolean, type: string, message?: string) => {
    mockUpdateToast(showToast, type, message)
    return { type: 'toast/updateToast', payload: { showToast, toastType: type, message } }
  },
}))

jest.mock('Plugins/admin/redux/features/WebhookSlice', () => ({
  triggerWebhook: (payload: { createdFeatureValue: Record<string, JsonValue>; feature: string }) => {
    mockTriggerWebhook(payload)
    return { type: 'webhook/triggerWebhook', payload }
  },
}))

jest.mock('../useScopeActions', () => ({
  useScopeActions: () => ({
    logScopeCreation: (scope: Scope, message: string, modifiedFields?: ModifiedFields) =>
      mockLogScopeCreation(scope, message, modifiedFields),
    logScopeUpdate: (scope: Scope, message: string, modifiedFields?: ModifiedFields) =>
      mockLogScopeUpdate(scope, message, modifiedFields),
    navigateToScopeList: () => mockNavigateToScopeList(),
  }),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const buildStore = () =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = {}) => state,
      noReducer: (state = {}) => state,
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

describe('useScopeMutations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogScopeCreation.mockResolvedValue(undefined)
    mockLogScopeUpdate.mockResolvedValue(undefined)
  })

  describe('useCreateScope', () => {
    it('exposes createScope and status fields', () => {
      const store = buildStore()
      const { result } = renderHook(() => useCreateScope(), { wrapper: createWrapper(store) })
      expect(typeof result.current.createScope).toBe('function')
      expect(result.current.isPending).toBe(false)
      expect(result.current.isError).toBe(false)
    })

    it('does nothing when data is empty', async () => {
      const store = buildStore()
      const { result } = renderHook(() => useCreateScope(), { wrapper: createWrapper(store) })
      await act(async () => {
        await result.current.createScope('', {})
      })
      expect(mockCreateMutateAsync).not.toHaveBeenCalled()
    })

    it('parses data, calls the mutation, dispatches success toast and navigates', async () => {
      mockCreateMutateAsync.mockResolvedValue({ id: 'new-scope', displayName: 'New Scope' })
      const store = buildStore()
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      const { result } = renderHook(() => useCreateScope(), { wrapper: createWrapper(store) })

      await act(async () => {
        await result.current.createScope(
          JSON.stringify({ id: 'new-scope', action_message: 'made it' }),
          {},
        )
      })

      expect(mockCreateMutateAsync).toHaveBeenCalledWith({
        data: { id: 'new-scope' },
      })
      expect(mockUpdateToast).toHaveBeenCalledWith(
        true,
        'success',
        'messages.scope_created_successfully_with_name',
      )
      expect(mockTriggerWebhook).toHaveBeenCalledTimes(1)
      expect(mockLogScopeCreation).toHaveBeenCalledTimes(1)
      expect(mockNavigateToScopeList).toHaveBeenCalledTimes(1)
      expect(dispatchSpy).toHaveBeenCalled()
    })

    it('sets a parse error and rejects on invalid JSON', async () => {
      const store = buildStore()
      const { result } = renderHook(() => useCreateScope(), { wrapper: createWrapper(store) })

      await act(async () => {
        await expect(result.current.createScope('{not json', {})).rejects.toBeInstanceOf(Error)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
      expect(mockCreateMutateAsync).not.toHaveBeenCalled()
    })
  })

  describe('useUpdateScope', () => {
    it('exposes updateScope and status fields', () => {
      const store = buildStore()
      const { result } = renderHook(() => useUpdateScope(), { wrapper: createWrapper(store) })
      expect(typeof result.current.updateScope).toBe('function')
      expect(result.current.isPending).toBe(false)
    })

    it('parses data, calls the mutation, dispatches success toast and navigates', async () => {
      mockUpdateMutateAsync.mockResolvedValue({ id: 'scope-1', displayName: 'Updated' })
      const store = buildStore()
      const { result } = renderHook(() => useUpdateScope(), { wrapper: createWrapper(store) })

      await act(async () => {
        await result.current.updateScope(JSON.stringify({ id: 'scope-1' }), {})
      })

      expect(mockUpdateMutateAsync).toHaveBeenCalledWith({ data: { id: 'scope-1' } })
      expect(mockUpdateToast).toHaveBeenCalledWith(
        true,
        'success',
        'messages.scope_updated_successfully_with_name',
      )
      expect(mockLogScopeUpdate).toHaveBeenCalledTimes(1)
      expect(mockNavigateToScopeList).toHaveBeenCalledTimes(1)
    })

    it('rejects on invalid JSON without calling the mutation', async () => {
      const store = buildStore()
      const { result } = renderHook(() => useUpdateScope(), { wrapper: createWrapper(store) })
      await act(async () => {
        await expect(result.current.updateScope('}}invalid', {})).rejects.toBeInstanceOf(Error)
      })
      expect(mockUpdateMutateAsync).not.toHaveBeenCalled()
    })
  })
})
