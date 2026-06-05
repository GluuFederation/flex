import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  WebhookSliceState,
  WebhookTriggerResponseItem,
  TriggerWebhookReducerPayload,
} from '../types'

export type { WebhookSliceState }

const initialState: WebhookSliceState = {
  webhookModal: false,
  triggerWebhookInProgress: false,
  webhookTriggerResults: [],
  featureToTrigger: '',
  showWebhookExecutionDialog: false,
}

const webhookSlice = createSlice({
  name: 'webhook',
  initialState,
  reducers: {
    setWebhookModal: (state, action: PayloadAction<boolean>) => {
      state.webhookModal = action.payload
    },
    triggerWebhook: (state, _action: PayloadAction<TriggerWebhookReducerPayload>) => {
      state.triggerWebhookInProgress = true
    },
    completeTriggerWebhook: (state) => {
      state.triggerWebhookInProgress = false
    },
    setWebhookTriggerResults: (state, action: PayloadAction<WebhookTriggerResponseItem[]>) => {
      state.webhookTriggerResults = action.payload
    },
    setFeatureToTrigger: (state, action: PayloadAction<string>) => {
      state.featureToTrigger = action.payload
    },
    setShowWebhookExecutionDialog: (state, action: PayloadAction<boolean>) => {
      state.showWebhookExecutionDialog = action.payload
    },
  },
})

export const {
  setWebhookModal,
  triggerWebhook,
  completeTriggerWebhook,
  setWebhookTriggerResults,
  setFeatureToTrigger,
  setShowWebhookExecutionDialog,
} = webhookSlice.actions

export const { reducer } = webhookSlice

reducerRegistry.register('webhookReducer', reducer)
