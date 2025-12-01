import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { WebhookEntry, AuiFeature } from 'JansConfigApi'
import type { TriggerPayload, WebhookActionPayload } from 'Plugins/admin/components/Webhook/types'

export interface WebhookSliceState {
  webhooks: WebhookEntry[]
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  selectedWebhook: WebhookEntry | null
  loadingFeatures: boolean
  features: AuiFeature[]
  webhookFeatures: AuiFeature[]
  loadingWebhookFeatures: boolean
  loadingWebhooks: boolean
  featureWebhooks: WebhookEntry[]
  webhookModal: boolean
  triggerWebhookInProgress: boolean
  triggerWebhookMessage: string
  webhookTriggerErrors: unknown[]
  triggerPayload: TriggerPayload
  featureToTrigger: string
  showErrorModal: boolean
}

interface WebhookResponsePayload {
  data?: {
    entries?: WebhookEntry[]
    totalEntriesCount?: number
    entriesCount?: number
  } | null
}

const initialState: WebhookSliceState = {
  webhooks: [],
  loading: false,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
  totalItems: 0,
  entriesCount: 0,
  selectedWebhook: null,
  loadingFeatures: false,
  features: [],
  webhookFeatures: [],
  loadingWebhookFeatures: false,
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
    getWebhook: (state, _action: PayloadAction<WebhookActionPayload>) => {
      state.loading = true
    },
    getWebhookResponse: (state, action: PayloadAction<WebhookResponsePayload>) => {
      state.loading = false
      if (action.payload?.data) {
        state.webhooks = action.payload.data?.entries || []
        state.totalItems = action.payload.data.totalEntriesCount || 0
        state.entriesCount = action.payload.data.entriesCount || 0
      }
    },
    createWebhook: (state, _action: PayloadAction<WebhookActionPayload>) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    createWebhookResponse: (state, action: PayloadAction<{ data?: unknown }>) => {
      state.loading = false
      state.saveOperationFlag = true
      if (action.payload?.data) {
        state.errorInSaveOperationFlag = false
      } else {
        state.errorInSaveOperationFlag = true
      }
    },
    deleteWebhook: (state, _action: PayloadAction<WebhookActionPayload>) => {
      state.loading = true
    },
    deleteWebhookResponse: (state) => {
      state.loading = false
    },
    setSelectedWebhook: (state, action: PayloadAction<WebhookEntry | null>) => {
      state.selectedWebhook = action.payload
    },
    updateWebhook: (state, _action: PayloadAction<WebhookActionPayload>) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    updateWebhookResponse: (state, action: PayloadAction<{ data?: unknown }>) => {
      state.saveOperationFlag = true
      state.loading = false
      if (action.payload?.data) {
        state.errorInSaveOperationFlag = false
      } else {
        state.errorInSaveOperationFlag = true
      }
    },
    resetFlags: (state) => {
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    getFeatures: (state) => {
      state.loadingFeatures = true
    },
    getFeaturesResponse: (state, action: PayloadAction<AuiFeature[]>) => {
      state.loadingFeatures = false
      state.features = action.payload
    },
    getFeaturesByWebhookId: (state, _action: PayloadAction<string>) => {
      state.loadingWebhookFeatures = true
    },
    getFeaturesByWebhookIdResponse: (state, action: PayloadAction<AuiFeature[]>) => {
      state.loadingWebhookFeatures = false
      state.webhookFeatures = action.payload
    },
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
      state.triggerPayload = action.payload
    },
    setTriggerWebhookResponse: (state, action: PayloadAction<string>) => {
      state.triggerWebhookInProgress = false
      state.triggerWebhookMessage = action.payload
    },
    setWebhookTriggerErrors: (state, action: PayloadAction<unknown[]>) => {
      state.webhookTriggerErrors = action.payload
    },
    setTriggerPayload: (state, action: PayloadAction<TriggerPayload>) => {
      state.triggerPayload = action.payload
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
  getWebhook,
  getWebhookResponse,
  createWebhook,
  createWebhookResponse,
  deleteWebhook,
  deleteWebhookResponse,
  setSelectedWebhook,
  updateWebhook,
  updateWebhookResponse,
  resetFlags,
  getFeaturesResponse,
  getFeatures,
  getFeaturesByWebhookId,
  getFeaturesByWebhookIdResponse,
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
