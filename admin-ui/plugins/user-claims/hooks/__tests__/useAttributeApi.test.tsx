import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { JansAttribute } from 'JansConfigApi'
import {
  useAttributes,
  useAttribute,
  toAttributeList,
  useCreateAttribute,
  useUpdateAttribute,
  useDeleteAttribute,
} from 'Plugins/user-claims/hooks/useAttributeApi'

const buildAttribute = (overrides: Partial<JansAttribute>): JansAttribute => ({
  inum: 'attr-1',
  name: 'email',
  displayName: 'Email',
  description: 'Email attribute',
  dataType: 'string',
  editType: ['admin'],
  viewType: ['admin'],
  ...overrides,
})

const mockPostMutateAsync = jest.fn()
const mockPutMutateAsync = jest.fn()
const mockDeleteMutateAsync = jest.fn()
const mockUseGetAttributes = jest.fn()
const mockUseGetAttributesByInum = jest.fn()
const mockLogAudit = jest.fn()
const mockTriggerAttributeWebhook = jest.fn()
const mockDispatch = jest.fn()
const mockLoggerError = jest.fn()

type MutationOptions = { mutation?: { onError?: (e: Error) => void } }

let mockHasSession = true
let postOptions: MutationOptions | undefined

jest.mock('JansConfigApi', () => ({
  useGetAttributes: (...args: Parameters<typeof mockUseGetAttributes>) =>
    mockUseGetAttributes(...args),
  useGetAttributesByInum: (...args: Parameters<typeof mockUseGetAttributesByInum>) =>
    mockUseGetAttributesByInum(...args),
  usePostAttributes: (options: MutationOptions) => {
    postOptions = options
    return { mutateAsync: mockPostMutateAsync, isPending: false }
  },
  usePutAttributes: () => ({ mutateAsync: mockPutMutateAsync, isPending: false }),
  useDeleteAttributesByInum: () => ({ mutateAsync: mockDeleteMutateAsync, isPending: false }),
  getGetAttributesQueryKey: () => ['/api/v1/attributes'],
  getGetAttributesByInumQueryKey: (inum: string) => [`/api/v1/attributes/${inum}`],
}))

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (s: { authReducer: { hasSession: boolean } }) => boolean) =>
    selector({ authReducer: { hasSession: mockHasSession } }),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: (show: boolean, type: string, message?: string) => ({
    type: 'toast/update',
    payload: { show, type, message },
  }),
}))

jest.mock('Plugins/user-claims/hooks/useSchemaAuditLogger', () => ({
  useSchemaAuditLogger: () => ({ logAudit: mockLogAudit }),
}))

jest.mock('Plugins/user-claims/hooks/useSchemaWebhook', () => ({
  useSchemaWebhook: () => ({ triggerAttributeWebhook: mockTriggerAttributeWebhook }),
}))

jest.mock('@/utils/logger', () => ({
  logger: { error: (...args: Parameters<typeof mockLoggerError>) => mockLoggerError(...args) },
}))

jest.mock('@/constants', () => ({
  adminUiFeatures: { attributes_write: 'attributes_write', attributes_delete: 'attributes_delete' },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useAttributeApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockHasSession = true
    mockLogAudit.mockResolvedValue(undefined)
    mockUseGetAttributes.mockReturnValue({ data: undefined, error: null })
    mockUseGetAttributesByInum.mockReturnValue({ data: undefined, error: null })
  })

  describe('useAttributes', () => {
    it('enables the query when a session exists', () => {
      renderHook(() => useAttributes({ limit: 10 }), { wrapper: createWrapper() })
      expect(mockUseGetAttributes).toHaveBeenCalledWith(
        { limit: 10 },
        expect.objectContaining({ query: expect.objectContaining({ enabled: true }) }),
      )
    })

    it('disables the query when there is no session', () => {
      mockHasSession = false
      renderHook(() => useAttributes(), { wrapper: createWrapper() })
      expect(mockUseGetAttributes).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ query: expect.objectContaining({ enabled: false }) }),
      )
    })
  })

  describe('toAttributeList', () => {
    it('returns an empty array when no entries are provided', () => {
      expect(toAttributeList()).toEqual([])
    })

    it('maps entries into attribute objects', () => {
      const list = toAttributeList([{ inum: 'a' }, { inum: 'b' }])
      expect(list).toHaveLength(2)
      expect(list[0]).toEqual({ inum: 'a' })
    })
  })

  describe('useAttribute', () => {
    it('enables the query only when inum and session exist', () => {
      renderHook(() => useAttribute('attr-1'), { wrapper: createWrapper() })
      expect(mockUseGetAttributesByInum).toHaveBeenCalledWith(
        'attr-1',
        expect.objectContaining({ query: expect.objectContaining({ enabled: true }) }),
      )
    })
  })

  describe('useCreateAttribute', () => {
    it('creates, invalidates, triggers webhook and audits with CREATE', async () => {
      const created = buildAttribute({ inum: 'attr-1', name: 'email' })
      mockPostMutateAsync.mockResolvedValue(created)
      const { result } = renderHook(() => useCreateAttribute(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.mutateAsync({ data: created, userMessage: 'created' })
      })

      expect(mockPostMutateAsync).toHaveBeenCalledWith({ data: created })
      expect(mockTriggerAttributeWebhook).toHaveBeenCalledWith(created)
      expect(mockLogAudit).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CREATE',
          resource: 'api-attribute',
          message: 'created',
          payload: created,
        }),
      )
    })

    it('exposes a mutate wrapper that logs failures without throwing', async () => {
      const failure = new Error('create boom')
      mockPostMutateAsync.mockRejectedValue(failure)
      const { result } = renderHook(() => useCreateAttribute(), { wrapper: createWrapper() })

      await act(async () => {
        // The wrapper swallows the rejection; calling it must not throw.
        expect(() => result.current.mutate({ data: buildAttribute({ inum: 'x' }) })).not.toThrow()
        await Promise.resolve()
        await Promise.resolve()
      })

      expect(mockLoggerError).toHaveBeenCalledWith('Create attribute failed:', failure)
    })

    it('dispatches the exact error toast through the onError handler', () => {
      renderHook(() => useCreateAttribute(), { wrapper: createWrapper() })
      postOptions?.mutation?.onError?.(new Error('server boom'))
      // Plain error has no response.data.message, so it falls back to the i18n key.
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'toast/update',
        payload: { show: true, type: 'error', message: 'messages.error_in_saving' },
      })
    })

    it('uses the server-provided message in the error toast when present', () => {
      renderHook(() => useCreateAttribute(), { wrapper: createWrapper() })
      const apiError = Object.assign(new Error('server boom'), {
        response: { data: { message: 'Name already exists' } },
      })
      postOptions?.mutation?.onError?.(apiError)
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'toast/update',
        payload: { show: true, type: 'error', message: 'Name already exists' },
      })
    })
  })

  describe('useUpdateAttribute', () => {
    it('updates, invalidates and audits with UPDATE and modifiedFields', async () => {
      const updated = buildAttribute({ inum: 'attr-1', name: 'email' })
      mockPutMutateAsync.mockResolvedValue(updated)
      const { result } = renderHook(() => useUpdateAttribute(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.mutateAsync({
          data: updated,
          userMessage: 'updated',
          modifiedFields: { name: 'email' },
        })
      })

      expect(mockPutMutateAsync).toHaveBeenCalledWith({ data: updated })
      expect(mockTriggerAttributeWebhook).toHaveBeenCalledWith(updated)
      expect(mockLogAudit).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'UPDATE',
          modifiedFields: { name: 'email' },
        }),
      )
    })
  })

  describe('useDeleteAttribute', () => {
    it('deletes, triggers a delete webhook and audits with DELETION', async () => {
      mockDeleteMutateAsync.mockResolvedValue(undefined)
      const { result } = renderHook(() => useDeleteAttribute(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.mutateAsync({ inum: 'attr-1', name: 'email', userMessage: 'removed' })
      })

      expect(mockDeleteMutateAsync).toHaveBeenCalledWith({ inum: 'attr-1' })
      expect(mockTriggerAttributeWebhook).toHaveBeenCalledWith(
        { inum: 'attr-1', name: 'email' },
        'attributes_delete',
      )
      expect(mockLogAudit).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'DELETION', payload: { inum: 'attr-1', name: 'email' } }),
      )
    })
  })
})
