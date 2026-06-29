import { renderHook, act } from '@testing-library/react'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { useSchemaWebhook } from 'Plugins/user-claims/hooks/useSchemaWebhook'

type WebhookArg = { createdFeatureValue: Record<string, JsonValue>; feature: string }

const mockDispatch = jest.fn()
const mockTriggerWebhook = jest.fn((payload: WebhookArg) => ({ type: 'webhook/trigger', payload }))
const mockLoggerError = jest.fn()

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('Plugins/admin/redux/features/WebhookSlice', () => ({
  triggerWebhook: (payload: WebhookArg) => mockTriggerWebhook(payload),
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    error: (message: string, detail: Error | string) => mockLoggerError(message, detail),
  },
}))

jest.mock('@/constants', () => ({
  adminUiFeatures: {
    attributes_write: 'attributes_write',
    attributes_delete: 'attributes_delete',
  },
}))

describe('useSchemaWebhook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns a triggerAttributeWebhook function', () => {
    const { result } = renderHook(() => useSchemaWebhook())
    expect(typeof result.current.triggerAttributeWebhook).toBe('function')
  })

  it('dispatches the webhook with the default attributes_write feature', () => {
    const { result } = renderHook(() => useSchemaWebhook())
    const attribute = { inum: 'attr-1', name: 'email' }

    act(() => {
      result.current.triggerAttributeWebhook(attribute)
    })

    expect(mockTriggerWebhook).toHaveBeenCalledWith({
      createdFeatureValue: attribute,
      feature: 'attributes_write',
    })
    expect(mockDispatch).toHaveBeenCalledTimes(1)
  })

  it('uses the provided feature when one is passed', () => {
    const { result } = renderHook(() => useSchemaWebhook())

    act(() => {
      result.current.triggerAttributeWebhook({ inum: 'attr-1' }, 'attributes_delete')
    })

    expect(mockTriggerWebhook).toHaveBeenCalledWith(
      expect.objectContaining({ feature: 'attributes_delete' }),
    )
  })

  it('logs an error and does not throw when dispatch fails', () => {
    const failure = new Error('dispatch failed')
    mockDispatch.mockImplementationOnce(() => {
      throw failure
    })
    const { result } = renderHook(() => useSchemaWebhook())

    expect(() => {
      act(() => {
        result.current.triggerAttributeWebhook({ inum: 'attr-1' })
      })
    }).not.toThrow()

    expect(mockLoggerError).toHaveBeenCalledWith('Failed to trigger attribute webhook:', failure)
  })
})
