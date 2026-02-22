import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { WebhookEntry } from 'JansConfigApi'
import type { TriggerPayload } from 'Plugins/admin/components/Webhook/types'
import type { WebhookTriggerResponseItem } from '../sagas/types/webhook'

type SerializableValue = string | number | boolean | object | null

interface StoredTriggerPayload {
  feature: string | null
  payload: SerializableValue
}

export interface WebhookSliceState {
  loadingWebhooks: boolean
  featureWebhooks: WebhookEntry[]
  webhookModal: boolean
  triggerWebhookInProgress: boolean
  triggerWebhookMessage: string
  webhookTriggerErrors: WebhookTriggerResponseItem[]
  triggerPayload: StoredTriggerPayload
  featureToTrigger: string
  showErrorModal: boolean
}

const initialState: WebhookSliceState = {
  loadingWebhooks: false,
  featureWebhooks: [],
  webhookModal: false,
  triggerWebhookInProgress: false,
  triggerWebhookMessage: '',
  webhookTriggerErrors: [],
  triggerPayload: {
    feature: null,
    payload: null,
  },
  featureToTrigger: '',
  showErrorModal: false,
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
    triggerWebhook: (state, action: PayloadAction<TriggerPayload>) => {
      state.triggerWebhookInProgress = true
      state.triggerPayload = {
        feature: action.payload?.feature ?? null,
        payload: (action.payload?.payload ?? null) as SerializableValue,
      }
    },
    setTriggerWebhookResponse: (state, action: PayloadAction<string>) => {
      state.triggerWebhookInProgress = false
      state.triggerWebhookMessage = action.payload
    },
    setWebhookTriggerErrors: (state, action: PayloadAction<WebhookTriggerResponseItem[]>) => {
      state.webhookTriggerErrors = action.payload
    },
    setTriggerPayload: (state, action: PayloadAction<TriggerPayload>) => {
      state.triggerPayload = {
        feature: action.payload?.feature ?? null,
        payload: (action.payload?.payload ?? null) as SerializableValue,
      }
    },
    setFeatureToTrigger: (state, action: PayloadAction<string>) => {
      state.featureToTrigger = action.payload
    },
    setShowErrorModal: (state, action: PayloadAction<boolean>) => {
      state.showErrorModal = action.payload
    },
  },
})

export const {
  getWebhooksByFeatureId,
  getWebhooksByFeatureIdResponse,
  setWebhookModal,
  triggerWebhook,
  setTriggerWebhookResponse,
  setWebhookTriggerErrors,
  setTriggerPayload,
  setFeatureToTrigger,
  setShowErrorModal,
} = webhookSlice.actions

export const { actions, reducer } = webhookSlice
export default reducer

reducerRegistry.register('webhookReducer', reducer)
