import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { setupWebhookListener } from '../webhookListener'
import { reducer as webhookReducer, triggerWebhook } from '../../features/WebhookSlice'
import authReducer from 'Redux/features/authSlice'
import { customInstance } from 'Orval'
import { postUserAction } from 'Redux/api/backend-api'
import { webhookOutputObject } from 'Plugins/admin/helper/utils'
import type { RootState } from '@/redux/types'
import type { AppDispatch } from '@/redux/hooks'

jest.mock('Orval', () => ({ customInstance: jest.fn() }))
jest.mock('Redux/api/backend-api')
jest.mock('Utils/TokenController', () => ({ addAdditionalData: jest.fn() }))
jest.mock('Plugins/admin/helper/utils', () => ({ webhookOutputObject: jest.fn() }))

const mockedCustomInstance = customInstance as jest.MockedFunction<typeof customInstance>
const mockedPostUserAction = postUserAction as jest.MockedFunction<typeof postUserAction>
const mockedWebhookOutputObject = webhookOutputObject as jest.MockedFunction<
  typeof webhookOutputObject
>

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

const buildStore = () => {
  const listenerMiddleware = createListenerMiddleware()
  setupWebhookListener(listenerMiddleware.startListening.withTypes<RootState, AppDispatch>())
  return configureStore({
    reducer: { webhookReducer, authReducer },
    middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware),
  })
}

describe('webhookListener - triggerWebhook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedPostUserAction.mockResolvedValue({} as never)
  })

  it('shows the execution dialog and stores enriched results on success', async () => {
    mockedCustomInstance
      .mockResolvedValueOnce([{ jansEnabled: true, inum: 'w1' }] as never)
      .mockResolvedValueOnce([{ responseObject: { webhookId: 'w1' } }] as never)
    mockedWebhookOutputObject.mockReturnValue([
      { webhookId: 'w1', shortcodeValueMap: {}, url: 'http://hook' },
    ] as never)

    const store = buildStore()
    store.dispatch(triggerWebhook({ feature: 'clients', createdFeatureValue: {} }))
    await flush()

    const state = store.getState().webhookReducer
    expect(state.showWebhookExecutionDialog).toBe(true)
    expect(state.webhookTriggerResults).toHaveLength(1)
    expect(state.webhookTriggerResults[0]).toEqual(expect.objectContaining({ url: 'http://hook' }))
    expect(state.triggerWebhookInProgress).toBe(false)
  })

  it('resets state and skips the dialog when no enabled webhooks exist', async () => {
    mockedCustomInstance.mockResolvedValueOnce([{ jansEnabled: false }] as never)

    const store = buildStore()
    store.dispatch(triggerWebhook({ feature: 'clients', createdFeatureValue: {} }))
    await flush()

    const state = store.getState().webhookReducer
    expect(state.showWebhookExecutionDialog).toBe(false)
    expect(state.webhookTriggerResults).toEqual([])
    expect(mockedWebhookOutputObject).not.toHaveBeenCalled()
  })

  it('clears the in-progress flag and closes the modal on error', async () => {
    mockedCustomInstance.mockRejectedValueOnce(new Error('network'))

    const store = buildStore()
    store.dispatch(triggerWebhook({ feature: 'clients', createdFeatureValue: {} }))
    await flush()

    const state = store.getState().webhookReducer
    expect(state.triggerWebhookInProgress).toBe(false)
    expect(state.webhookModal).toBe(false)
  })
})
