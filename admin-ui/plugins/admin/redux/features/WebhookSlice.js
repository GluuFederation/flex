import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
  loadingWebhookFeatures: false
}

const webhookSlice = createSlice({
  name: 'webhook',
  initialState,
  reducers: {
    getWebhook: (state, action) => {
      state.loading = true
    },
    getWebhookResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.webhooks = action.payload.data.entries
        state.totalItems = action.payload.data.totalEntriesCount
        state.entriesCount = action.payload.data.entriesCount
      }
    },
    createWebhook: (state) => {
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    createWebhookResponse: (state, action) => {
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
    setSelectedWebhook: (state, action) => {
      state.selectedWebhook = action.payload
    },
    updateWebhook: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    updateWebhookResponse: (state, action) => {
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
    getFeaturesResponse: (state, action) => {
      state.loadingFeatures = false
      state.features = action.payload
    },
    getFeaturesByWebhookId: (state) => {
      state.loadingWebhookFeatures = true
    },
    getFeaturesByWebhookIdResponse: (state, action) => {
      state.loadingWebhookFeatures = false
      state.webhookFeatures = action.payload
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
  getFeaturesByWebhookIdResponse
} = webhookSlice.actions
export const { actions, reducer, state } = webhookSlice
export default reducer
reducerRegistry.register('webhookReducer', reducer)
