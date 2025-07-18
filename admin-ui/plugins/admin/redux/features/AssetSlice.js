import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  assets: [],
  services: [],
  fileTypes: [],
  loading: false,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
  totalItems: 0,
  entriesCount: 0,
  selectedAsset: {},
  loadingAssets: false,
  assetModal: false,
  showErrorModal: false,
}

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    fetchJansAssets: (state, action) => {
      state.loadingAssets = true
    },
    getJansAssets: (state, action) => {
      state.loading = true
    },
    getJansAssetResponse: (state, action) => {
      state.loadingAssets = false
      if (action.payload?.data) {
        state.assets = action.payload.data.entries
        state.totalItems = action.payload.data.totalEntriesCount
        state.entriesCount = action.payload.data.entriesCount
      }
    },
    getAssetServices: (state, action) => {
      state.loading = true
    },
    getAssetServicesResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.services = action.payload.data
      }
    },
    getAssetTypes: (state, action) => {
      state.loading = true
    },
    getAssetTypesResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.fileTypes = action.payload.data
      }
    },
    createJansAsset: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    createJansAssetResponse: (state, action) => {
      state.loading = false
      state.saveOperationFlag = true
      if (action.payload?.data) {
        state.errorInSaveOperationFlag = false
      } else {
        state.errorInSaveOperationFlag = true
      }
    },
    deleteJansAsset: (state) => {
      state.loading = true
    },
    deleteJansAssetResponse: (state) => {
      state.loading = false
    },
    setSelectedAsset: (state, action) => {
      state.selectedAsset = action.payload
    },
    updateJansAsset: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    updateJansAssetResponse: (state, action) => {
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
    setAssetModal: (state, action) => {
      state.assetModal = action.payload
    },
    setShowErrorModal: (state, action) => {
      state.showErrorModal = action.payload
    },
  },
})

export const {
  fetchJansAssets,
  getJansAssets,
  getJansAssetResponse,
  getAssetServices,
  getAssetServicesResponse,
  getAssetTypes,
  getAssetTypesResponse,
  createJansAsset,
  createJansAssetResponse,
  deleteJansAsset,
  deleteJansAssetResponse,
  setSelectedAsset,
  updateJansAsset,
  updateJansAssetResponse,
  resetFlags,
  setAssetModal,
  setShowErrorModal,
} = assetSlice.actions
export const { actions, reducer, state } = assetSlice
export default reducer
reducerRegistry.register('assetReducer', reducer)
