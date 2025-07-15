import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define types for the state
interface WebhookState {
  webhooks: any[]
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  selectedWebhook: any
  loadingFeatures: boolean
  features: any[]
  webhookFeatures: any[]
  loadingWebhookFeatures: boolean
  loadingWebhooks: boolean
  featureWebhooks: any[]
  webhookModal: boolean
  triggerWebhookInProgress: boolean
  triggerWebhookMessage: string
  webhookTriggerErrors: any[]
  tiggerPayload: {
    feature: any
    payload: any
  }
  featureToTrigger: string
  showErrorModal: boolean
}

const initialState: WebhookState = {
  webhooks: [],
  loading: false,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
  totalItems: 0,
  entriesCount: 0,
  selectedWebhook: {},
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
  tiggerPayload: {
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
    getWebhook: (state, action: PayloadAction<any>) => {
      state.loading = true
    },
    getWebhookResponse: (state, action: PayloadAction<any>) => {
      state.loading = false
      if (action.payload?.data) {
        state.webhooks = action.payload.data?.entries || []
        state.totalItems = action.payload.data.totalEntriesCount
        state.entriesCount = action.payload.data.entriesCount
      }
    },
    createWebhook: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    createWebhookResponse: (state, action: PayloadAction<any>) => {
      state.loading = false
      state.saveOperationFlag = true
      if (action.payload?.data) {
        state.errorInSaveOperationFlag = false
      } else {
        state.errorInSaveOperationFlag = true
      }
    },
    deleteWebhook: (state) => {
      state.loading = true
    },
    deleteWebhookResponse: (state) => {
      state.loading = false
    },
    setSelectedWebhook: (state, action: PayloadAction<any>) => {
      state.selectedWebhook = action.payload
    },
    updateWebhook: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    updateWebhookResponse: (state, action: PayloadAction<any>) => {
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
    getFeaturesResponse: (state, action: PayloadAction<any>) => {
      state.loadingFeatures = false
      state.features = action.payload
    },
    getFeaturesByWebhookId: (state) => {
      state.loadingWebhookFeatures = true
    },
    getFeaturesByWebhookIdResponse: (state, action: PayloadAction<any>) => {
      state.loadingWebhookFeatures = false
      state.webhookFeatures = action.payload
    },
    getWebhooksByFeatureId: (state) => {
      state.loadingWebhooks = true
    },
    getWebhooksByFeatureIdResponse: (state, action: PayloadAction<any>) => {
      state.featureWebhooks = action.payload
      state.loadingWebhooks = false
    },
    setWebhookModal: (state, action: PayloadAction<boolean>) => {
      state.webhookModal = action.payload
    },
    triggerWebhook: (state) => {
      state.triggerWebhookInProgress = true
    },
    setTriggerWebhookResponse: (state, action: PayloadAction<string>) => {
      state.triggerWebhookInProgress = false
      state.triggerWebhookMessage = action.payload
    },
    setWebhookTriggerErrors: (state, action: PayloadAction<any[]>) => {
      state.webhookTriggerErrors = action.payload
    },
    setTriggerPayload: (state, action: PayloadAction<{ feature: any; payload: any }>) => {
      state.tiggerPayload = action.payload
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
