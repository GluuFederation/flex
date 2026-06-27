import {
  reducer,
  setWebhookModal,
  triggerWebhook,
  completeTriggerWebhook,
  setWebhookTriggerResults,
  setFeatureToTrigger,
  setShowWebhookExecutionDialog,
} from '../WebhookSlice'
import type { WebhookTriggerResponseItem } from '../../types'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('WebhookSlice', () => {
  it('returns the initial state', () => {
    expect(getInitial()).toEqual({
      webhookModal: false,
      triggerWebhookInProgress: false,
      webhookTriggerResults: [],
      featureToTrigger: '',
      showWebhookExecutionDialog: false,
    })
  })

  it('setWebhookModal toggles the modal flag', () => {
    expect(reducer(getInitial(), setWebhookModal(true)).webhookModal).toBe(true)
  })

  it('triggerWebhook / completeTriggerWebhook toggle the in-progress flag', () => {
    const inProgress = reducer(getInitial(), triggerWebhook({}))
    expect(inProgress.triggerWebhookInProgress).toBe(true)
    expect(reducer(inProgress, completeTriggerWebhook()).triggerWebhookInProgress).toBe(false)
  })

  it('setWebhookTriggerResults stores the results array', () => {
    const results: WebhookTriggerResponseItem[] = [
      { success: true, responseObject: { webhookId: 'w1' } },
    ]
    expect(reducer(getInitial(), setWebhookTriggerResults(results)).webhookTriggerResults).toEqual(
      results,
    )
  })

  it('setFeatureToTrigger stores the feature name', () => {
    expect(reducer(getInitial(), setFeatureToTrigger('clients')).featureToTrigger).toBe('clients')
  })

  it('setShowWebhookExecutionDialog toggles the dialog flag', () => {
    expect(
      reducer(getInitial(), setShowWebhookExecutionDialog(true)).showWebhookExecutionDialog,
    ).toBe(true)
  })
})
