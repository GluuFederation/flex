import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { CustomScript } from 'JansConfigApi'
import {
  useCustomScriptsByType,
  useCustomScript,
  useCustomScriptTypes,
  useCreateCustomScript,
  useUpdateCustomScript,
  useDeleteCustomScript,
} from 'Plugins/scripts/components/hooks/useCustomScriptApi'

if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = function structuredClonePolyfill<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T
  }
}

type WebhookArg = { createdFeatureValue: Record<string, JsonValue>; feature?: string }
type AuditArgs = [string, string, Record<string, JsonValue>]

const mockPostMutateAsync = jest.fn()
const mockPutMutateAsync = jest.fn()
const mockDeleteMutateAsync = jest.fn()
const mockUseGetConfigScriptsByType = jest.fn()
const mockUseGetConfigScriptsByInum = jest.fn()
const mockUseGetCustomScriptType = jest.fn()
const mockLogAuditAction = jest.fn((...args: AuditArgs) => args)
const mockTriggerWebhook = jest.fn((payload: WebhookArg) => ({ type: 'webhook', payload }))
const mockDispatch = jest.fn()
const mockUpdateToast = jest.fn((show: boolean, type: string, message?: string) => ({
  type: 'toast/update',
  payload: { show, type, message },
}))

let mockHasSession = true

jest.mock('JansConfigApi', () => ({
  useGetConfigScriptsByType: (...args: Parameters<typeof mockUseGetConfigScriptsByType>) =>
    mockUseGetConfigScriptsByType(...args),
  useGetConfigScriptsByInum: (...args: Parameters<typeof mockUseGetConfigScriptsByInum>) =>
    mockUseGetConfigScriptsByInum(...args),
  useGetCustomScriptType: (...args: Parameters<typeof mockUseGetCustomScriptType>) =>
    mockUseGetCustomScriptType(...args),
  usePostConfigScripts: () => ({ mutateAsync: mockPostMutateAsync, isPending: false }),
  usePutConfigScripts: () => ({ mutateAsync: mockPutMutateAsync, isPending: false }),
  useDeleteConfigScriptsByInum: () => ({ mutateAsync: mockDeleteMutateAsync, isPending: false }),
  getGetConfigScriptsQueryKey: () => ['/api/v1/config/scripts/'],
  getGetConfigScriptsByTypeQueryKey: (type: string) => [`/api/v1/config/scripts/type/${type}`],
  getGetConfigScriptsByInumQueryKey: (inum: string) => [`/api/v1/config/scripts/${inum}`],
}))

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (s: { authReducer: { hasSession: boolean } }) => boolean) =>
    selector({ authReducer: { hasSession: mockHasSession } }),
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: (show: boolean, type: string, message?: string) =>
    mockUpdateToast(show, type, message),
}))

jest.mock('@/redux/features/toastSlice', () => ({
  updateToast: (show: boolean, type: string, message?: string) =>
    mockUpdateToast(show, type, message),
}))

jest.mock('Plugins/scripts/components/helper', () => ({
  logAuditAction: (...args: AuditArgs) => mockLogAuditAction(...args),
}))

jest.mock('Plugins/admin/redux/features/WebhookSlice', () => ({
  triggerWebhook: (payload: WebhookArg) => mockTriggerWebhook(payload),
}))

jest.mock('@/constants', () => ({
  adminUiFeatures: {
    custom_script_write: 'custom_script_write',
    custom_script_delete: 'custom_script_delete',
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCustomScriptApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockHasSession = true
    mockUseGetConfigScriptsByType.mockReturnValue({ data: undefined, error: null })
    mockUseGetConfigScriptsByInum.mockReturnValue({ data: undefined, error: null })
    mockUseGetCustomScriptType.mockReturnValue({ data: [] })
  })

  describe('useCustomScriptsByType', () => {
    it('passes type, params and enabled flag to the underlying query', () => {
      renderHook(() => useCustomScriptsByType('person_authentication', { limit: 5 }), {
        wrapper: createWrapper(),
      })

      expect(mockUseGetConfigScriptsByType).toHaveBeenCalledWith(
        'person_authentication',
        { limit: 5 },
        expect.objectContaining({ query: expect.objectContaining({ enabled: true }) }),
      )
    })

    it('dispatches an error toast when the query errors', () => {
      mockUseGetConfigScriptsByType.mockReturnValue({ data: undefined, error: new Error('boom') })
      renderHook(() => useCustomScriptsByType('person_authentication'), {
        wrapper: createWrapper(),
      })
      expect(mockUpdateToast).toHaveBeenCalledWith(true, 'error', expect.anything())
    })

    it('disables the query when external enabled is false', () => {
      renderHook(
        () => useCustomScriptsByType('person_authentication', undefined, { enabled: false }),
        {
          wrapper: createWrapper(),
        },
      )
      expect(mockUseGetConfigScriptsByType).toHaveBeenCalledWith(
        'person_authentication',
        undefined,
        expect.objectContaining({ query: expect.objectContaining({ enabled: false }) }),
      )
    })
  })

  describe('useCustomScript', () => {
    it('enables the query only when inum and session are present', () => {
      renderHook(() => useCustomScript('script-1'), { wrapper: createWrapper() })
      expect(mockUseGetConfigScriptsByInum).toHaveBeenCalledWith(
        'script-1',
        expect.objectContaining({ query: expect.objectContaining({ enabled: true }) }),
      )
    })
  })

  describe('useCustomScriptTypes', () => {
    it('formats script type strings via the select transform', () => {
      renderHook(() => useCustomScriptTypes(), { wrapper: createWrapper() })
      const options = mockUseGetCustomScriptType.mock.calls[0][0] as {
        query: { select: (data: string[]) => Array<{ value: string; name: string }> }
      }
      const selected = options.query.select(['person_authentication', 'cache'])
      expect(selected).toEqual([
        { value: 'person_authentication', name: 'Person Authentication' },
        { value: 'cache', name: 'Cache' },
      ])
    })

    it('returns an empty list from select when data is not an array', () => {
      renderHook(() => useCustomScriptTypes(), { wrapper: createWrapper() })
      const options = mockUseGetCustomScriptType.mock.calls[0][0] as {
        query: { select: (data: string[] | undefined) => Array<{ value: string; name: string }> }
      }
      expect(options.query.select(undefined)).toEqual([])
    })
  })

  describe('useCreateCustomScript', () => {
    it('creates, invalidates, triggers webhook and audits', async () => {
      const created: CustomScript = { inum: 'new-1', scriptType: 'person_authentication' }
      mockPostMutateAsync.mockResolvedValue(created)
      const { result } = renderHook(() => useCreateCustomScript(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.mutateAsync({ data: created, actionMessage: 'created' })
      })

      expect(mockPostMutateAsync).toHaveBeenCalledWith({ data: created })
      expect(mockTriggerWebhook).toHaveBeenCalledWith(
        expect.objectContaining({ feature: 'custom_script_write' }),
      )
      expect(mockLogAuditAction).toHaveBeenCalledWith(
        'CREATE',
        'custom-script',
        expect.objectContaining({
          action: expect.objectContaining({ action_message: 'created' }),
        }),
      )
    })
  })

  describe('useUpdateCustomScript', () => {
    it('updates, triggers webhook and audits with UPDATE action', async () => {
      const updated: CustomScript = { inum: 'upd-1', scriptType: 'person_authentication' }
      mockPutMutateAsync.mockResolvedValue(updated)
      const { result } = renderHook(() => useUpdateCustomScript(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.mutateAsync({ data: updated, actionMessage: 'updated' })
      })

      expect(mockPutMutateAsync).toHaveBeenCalledWith({ data: updated })
      expect(mockTriggerWebhook).toHaveBeenCalled()
      expect(mockLogAuditAction).toHaveBeenCalledWith('UPDATE', 'custom-script', expect.anything())
    })
  })

  describe('useDeleteCustomScript', () => {
    it('deletes, triggers a delete webhook and audits with DELETION action', async () => {
      mockDeleteMutateAsync.mockResolvedValue(undefined)
      const { result } = renderHook(() => useDeleteCustomScript(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.mutateAsync({ inum: 'del-1', actionMessage: 'removed' })
      })

      expect(mockDeleteMutateAsync).toHaveBeenCalledWith({ inum: 'del-1' })
      expect(mockTriggerWebhook).toHaveBeenCalledWith(
        expect.objectContaining({
          createdFeatureValue: { inum: 'del-1' },
          feature: 'custom_script_delete',
        }),
      )
      expect(mockLogAuditAction).toHaveBeenCalledWith(
        'DELETION',
        'custom-script',
        expect.objectContaining({ action: { action_data: { inum: 'del-1' } } }),
      )
    })
  })
})
