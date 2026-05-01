import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { WebhookEntry } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type {
  WebhookSliceState,
  WebhookSliceTriggerPayload,
  WebhookTriggerResponseItem,
  TriggerPayloadActionPayload,
  TriggerWebhookReducerPayload,
} from '../types'

export type { WebhookSliceState, WebhookSliceTriggerPayload }

const initialState: WebhookSliceState = {
  loadingWebhooks: false,
  featureWebhooks: [],
  webhookModal: false,
  triggerWebhookInProgress: false,
  webhookTriggerResults: [],
  triggerPayload: {
    feature: null,
    payload: null as JsonValue,
  },
  featureToTrigger: '',
  showWebhookExecutionDialog: false,
}

const webhookSlice = createSlice({
  name: 'webhook',
  initialState,
  reducers: {
    getWebhooksByFeatureId: (state, _action: PayloadAction<string>) => {
      state.loadingWebhooks = true
    },
    getWebhooksByFeatureIdResponse: (state, action: PayloadAction<WebhookEntry[]>) => {
      state.featureWebhooks = action.payload
      state.loadingWebhooks = false
    },
    setWebhookModal: (state, action: PayloadAction<boolean>) => {
      state.webhookModal = action.payload
    },
    triggerWebhook: (state, action: PayloadAction<TriggerWebhookReducerPayload>) => {
      state.triggerWebhookInProgress = true
      const p = action.payload as TriggerPayloadActionPayload
      if ('feature' in p || 'payload' in p) {
        Object.assign(state.triggerPayload, {
          feature: p?.feature ?? null,
          payload: (p?.payload ?? null) as JsonValue,
        })
      }
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
  getWebhooksByFeatureId,
  getWebhooksByFeatureIdResponse,
  setWebhookModal,
  triggerWebhook,
  completeTriggerWebhook,
  setWebhookTriggerResults,
  setFeatureToTrigger,
  setShowWebhookExecutionDialog,
} = webhookSlice.actions

export const { actions, reducer } = webhookSlice
export default reducer

reducerRegistry.register('webhookReducer', reducer)
