import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

type WebhookPayload = { createdFeatureValue: Record<string, JsonValue>; feature: string }
type WebhookAction = { type: string; payload: WebhookPayload }

// mock-prefixed so the hoisted jest.mock factories may close over them.
const mockDispatch = jest.fn()
jest.mock('Redux/store', () => ({
  __esModule: true,
  default: { dispatch: (action: WebhookAction) => mockDispatch(action) },
}))

const mockTriggerWebhook = jest.fn((payload: WebhookPayload) => ({
  type: 'triggerWebhook',
  payload,
}))
jest.mock('Plugins/admin/redux/features/WebhookSlice', () => ({
  triggerWebhook: (payload: WebhookPayload) => mockTriggerWebhook(payload),
}))

const mockLoggerError = jest.fn()
jest.mock('@/utils/logger', () => ({
  logger: { error: (msg: string, err?: Error) => mockLoggerError(msg, err) },
}))

import { triggerWebhookForFeature } from '@/utils/triggerWebhookForFeature'

describe('triggerWebhookForFeature', () => {
  beforeEach(() => {
    mockDispatch.mockReset()
    mockTriggerWebhook.mockClear()
    mockLoggerError.mockReset()
  })

  it('dispatches the webhook action with the feature data and name', () => {
    triggerWebhookForFeature({ id: 'abc' }, 'user-created')
    expect(mockTriggerWebhook).toHaveBeenCalledWith({
      createdFeatureValue: { id: 'abc' },
      feature: 'user-created',
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'triggerWebhook',
      payload: { createdFeatureValue: { id: 'abc' }, feature: 'user-created' },
    })
  })

  it('swallows dispatch errors and logs them with the feature name', () => {
    mockDispatch.mockImplementation(() => {
      throw new Error('dispatch failed')
    })
    expect(() => triggerWebhookForFeature({}, 'scope-updated')).not.toThrow()
    expect(mockLoggerError).toHaveBeenCalledWith(
      expect.stringContaining('scope-updated'),
      expect.any(Error),
    )
  })
})
