import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  useSamlConfiguration,
  useIdentityProviders,
  useTrustRelationships,
  useUpdateSamlConfiguration,
  useCreateIdentityProvider,
  useUpdateIdentityProvider,
  useDeleteIdentityProvider,
  useCreateTrustRelationship,
  useDeleteTrustRelationshipMutation,
} from 'Plugins/saml/components/hooks/useSamlApi'
import type {
  BrokerIdentityProviderForm,
  TrustRelationshipForm,
} from 'Plugins/saml/components/hooks/useSamlApi'
import type { LogAuditParams } from 'Utils/AuditLogger'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

const mockGet = jest.fn()
const mockPost = jest.fn()
const mockPut = jest.fn()
const mockDelete = jest.fn()
const mockLogAuditUserAction = jest.fn()
const mockTriggerWebhook = jest.fn()

jest.mock('Orval', () => ({
  ...jest.requireActual('Orval'),
  AXIOS_INSTANCE: {
    get: (...args: Parameters<typeof mockGet>) => mockGet(...args),
    post: (...args: Parameters<typeof mockPost>) => mockPost(...args),
    put: (...args: Parameters<typeof mockPut>) => mockPut(...args),
    delete: (...args: Parameters<typeof mockDelete>) => mockDelete(...args),
  },
}))

jest.mock('@/audit', () => ({
  useAuditContext: () => ({
    userinfo: { inum: 'inum-1', name: 'admin' },
    client_id: 'client-1',
    ip_address: '127.0.0.1',
  }),
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETION: 'DELETION',
}))

jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: (params: LogAuditParams) => mockLogAuditUserAction(params),
}))

jest.mock('@/utils/triggerWebhookForFeature', () => ({
  triggerWebhookForFeature: (data: Record<string, JsonValue>, feature: string) =>
    mockTriggerWebhook(data, feature),
}))

jest.mock('@/utils/logger', () => ({
  logger: { error: jest.fn() },
}))

jest.mock('@/constants', () => ({
  adminUiFeatures: {
    saml_configuration_write: 'saml_configuration_write',
    saml_idp_write: 'saml_idp_write',
    saml_delete: 'saml_delete',
  },
}))

const buildStore = (hasSession = true) =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { hasSession }) => state,
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

const idpForm: BrokerIdentityProviderForm = {
  identityProvider: { displayName: 'IdP One' },
}

const trustForm: TrustRelationshipForm = {
  trustRelationship: { displayName: 'TR One' },
}

describe('useSamlApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogAuditUserAction.mockResolvedValue(undefined)
    mockGet.mockResolvedValue({ data: {} })
    mockPost.mockResolvedValue({ data: { inum: 'created' } })
    mockPut.mockResolvedValue({ data: { inum: 'updated' } })
    mockDelete.mockResolvedValue({ data: undefined })
  })

  describe('queries', () => {
    it('fetches the saml properties when a session exists', async () => {
      mockGet.mockResolvedValueOnce({ data: { enabled: true } })
      const store = buildStore(true)
      const { result } = renderHook(() => useSamlConfiguration(), {
        wrapper: createWrapper(store),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(mockGet).toHaveBeenCalledWith('/kc/saml/properties')
      expect(result.current.data).toEqual({ enabled: true })
    })

    it('does not run the properties query without a session', () => {
      const store = buildStore(false)
      const { result } = renderHook(() => useSamlConfiguration(), {
        wrapper: createWrapper(store),
      })
      expect(result.current.fetchStatus).toBe('idle')
      expect(mockGet).not.toHaveBeenCalled()
    })

    it('fetches identity providers with the supplied params', async () => {
      mockGet.mockResolvedValueOnce({ data: { entries: [], totalEntriesCount: 0 } })
      const store = buildStore(true)
      const { result } = renderHook(() => useIdentityProviders({ limit: 5 }), {
        wrapper: createWrapper(store),
      })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(mockGet).toHaveBeenCalledWith('/kc/saml/idp', { params: { limit: 5 } })
    })

    it('fetches trust relationships', async () => {
      mockGet.mockResolvedValueOnce({ data: [] })
      const store = buildStore(true)
      const { result } = renderHook(() => useTrustRelationships(), {
        wrapper: createWrapper(store),
      })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(mockGet).toHaveBeenCalledWith('/kc/saml/trust-relationships')
    })
  })

  describe('useUpdateSamlConfiguration', () => {
    it('updates, dispatches a success toast, triggers webhook and audits', async () => {
      mockPut.mockResolvedValueOnce({ data: { enabled: false } })
      const store = buildStore(true)
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      const { result } = renderHook(() => useUpdateSamlConfiguration(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.mutateAsync({ data: { enabled: false }, userMessage: 'updated' })
      })

      expect(mockPut).toHaveBeenCalledWith('/kc/saml/properties', { enabled: false })
      expect(dispatchSpy).toHaveBeenCalled()
      expect(mockTriggerWebhook).toHaveBeenCalledWith(
        { enabled: false },
        'saml_configuration_write',
      )
      expect(mockLogAuditUserAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'UPDATE' }),
      )
    })
  })

  describe('useCreateIdentityProvider', () => {
    it('uploads, sets savedForm, triggers webhook and audits with CREATE', async () => {
      mockPost.mockResolvedValueOnce({ data: { inum: 'idp-1' } })
      const store = buildStore(true)
      const { result } = renderHook(() => useCreateIdentityProvider(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.mutateAsync({ data: idpForm, userMessage: 'created idp' })
      })

      expect(mockPost).toHaveBeenCalledWith('/kc/saml/idp/upload', expect.any(FormData))
      expect(result.current.savedForm).toBe(true)
      expect(mockTriggerWebhook).toHaveBeenCalledWith({ inum: 'idp-1' }, 'saml_idp_write')
      expect(mockLogAuditUserAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CREATE' }),
      )

      act(() => {
        result.current.resetSavedForm()
      })
      expect(result.current.savedForm).toBe(false)
    })

    it('keeps savedForm false and rethrows when the upload fails', async () => {
      mockPost.mockRejectedValueOnce(new Error('upload boom'))
      const store = buildStore(true)
      const { result } = renderHook(() => useCreateIdentityProvider(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await expect(
          result.current.mutateAsync({ data: idpForm, userMessage: 'x' }),
        ).rejects.toThrow('upload boom')
      })
      expect(result.current.savedForm).toBe(false)
    })
  })

  describe('useUpdateIdentityProvider', () => {
    it('puts the identity provider and audits with UPDATE', async () => {
      mockPut.mockResolvedValueOnce({ data: { inum: 'idp-1' } })
      const store = buildStore(true)
      const { result } = renderHook(() => useUpdateIdentityProvider(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.mutateAsync({ data: idpForm, userMessage: 'updated idp' })
      })

      expect(mockPut).toHaveBeenCalledWith('/kc/saml/idp/upload', expect.any(FormData))
      expect(mockLogAuditUserAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'UPDATE' }),
      )
    })
  })

  describe('useDeleteIdentityProvider', () => {
    it('deletes by inum, triggers webhook and audits with DELETION', async () => {
      const store = buildStore(true)
      const { result } = renderHook(() => useDeleteIdentityProvider(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.mutateAsync({ inum: 'idp-1', userMessage: 'removed' })
      })

      expect(mockDelete).toHaveBeenCalledWith('/kc/saml/idp/idp-1')
      expect(mockTriggerWebhook).toHaveBeenCalledWith({ inum: 'idp-1' }, 'saml_delete')
      expect(mockLogAuditUserAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'DELETION' }),
      )
    })

    it('dispatches an error toast and rethrows when the delete fails', async () => {
      mockDelete.mockRejectedValueOnce(new Error('delete boom'))
      const store = buildStore(true)
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      const { result } = renderHook(() => useDeleteIdentityProvider(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await expect(
          result.current.mutateAsync({ inum: 'idp-1', userMessage: 'x' }),
        ).rejects.toThrow('delete boom')
      })
      expect(dispatchSpy).toHaveBeenCalled()
    })
  })

  describe('trust relationship mutations', () => {
    it('creates a trust relationship and audits with CREATE', async () => {
      mockPost.mockResolvedValueOnce({ data: { inum: 'tr-1' } })
      const store = buildStore(true)
      const { result } = renderHook(() => useCreateTrustRelationship(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.mutateAsync({ data: trustForm, userMessage: 'created tr' })
      })

      expect(mockPost).toHaveBeenCalledWith(
        '/kc/saml/trust-relationship/upload',
        expect.any(FormData),
      )
      expect(result.current.savedForm).toBe(true)
      expect(mockLogAuditUserAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CREATE' }),
      )
    })

    it('deletes a trust relationship by id and audits with DELETION', async () => {
      const store = buildStore(true)
      const { result } = renderHook(() => useDeleteTrustRelationshipMutation(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.mutateAsync({ id: 'tr-1', userMessage: 'removed' })
      })

      expect(mockDelete).toHaveBeenCalledWith('/kc/saml/trust-relationship/tr-1')
      expect(mockTriggerWebhook).toHaveBeenCalledWith({ inum: 'tr-1' }, 'saml_delete')
      expect(mockLogAuditUserAction).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'DELETION' }),
      )
    })
  })
})
