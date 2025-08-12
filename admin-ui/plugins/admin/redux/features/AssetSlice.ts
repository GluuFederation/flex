import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AssetState, AssetResponsePayload, DeleteAssetSagaPayload } from './types/asset'
import {
  Document,
  DocumentPagedResult,
  GetAllAssetsOptions,
} from '../../components/Assets/types/AssetApiTypes'

const initialState: AssetState = {
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

// Type guard to check if data is DocumentPagedResult
const isDocumentPagedResult = (data: unknown): data is DocumentPagedResult => {
  return (
    data !== null &&
    typeof data === 'object' &&
    'entries' in data &&
    Array.isArray((data as Record<string, unknown>).entries)
  )
}

// Type guard to check if data is string array
const isStringArray = (data: unknown): data is string[] => {
  return Array.isArray(data) && (data.length === 0 || typeof data[0] === 'string')
}

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    fetchJansAssets: (state, action: PayloadAction<GetAllAssetsOptions>) => {
      console.trace('fetchJansAssets', action.payload)
      state.loadingAssets = true
    },
    getJansAssets: (state, action: PayloadAction<GetAllAssetsOptions>) => {
      console.trace('getJansAssets', action.payload)
      state.loading = true
    },
    getJansAssetResponse: (state, action: PayloadAction<AssetResponsePayload>) => {
      state.loadingAssets = false
      if (action.payload?.data && isDocumentPagedResult(action.payload.data)) {
        const data = action.payload.data
        state.assets = data.entries || []
        state.totalItems = data.totalEntriesCount || 0
        state.entriesCount = data.entriesCount || 0
      }
    },
    getAssetServices: (state, action: PayloadAction<void>) => {
      console.trace('getAssetServices', action.payload)
      state.loading = true
    },
    getAssetServicesResponse: (state, action: PayloadAction<AssetResponsePayload>) => {
      state.loading = false
      if (action.payload?.data && isStringArray(action.payload.data)) {
        state.services = action.payload.data
      }
    },
    getAssetTypes: (state, action: PayloadAction<void>) => {
      console.trace('getAssetTypes', action.payload)
      state.loading = true
    },
    getAssetTypesResponse: (state, action: PayloadAction<AssetResponsePayload>) => {
      state.loading = false
      if (action.payload?.data && isStringArray(action.payload.data)) {
        state.fileTypes = action.payload.data
      }
    },
    createJansAsset: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    createJansAssetResponse: (state, action: PayloadAction<AssetResponsePayload>) => {
      state.loading = false
      state.saveOperationFlag = true
      if (action.payload?.data) {
        state.errorInSaveOperationFlag = false
      } else {
        state.errorInSaveOperationFlag = true
      }
    },
    deleteJansAsset: (state, action: PayloadAction<DeleteAssetSagaPayload>) => {
      console.trace('deleteJansAsset', action.payload)
      state.loading = true
    },
    deleteJansAssetResponse: (state) => {
      state.loading = false
    },
    setSelectedAsset: (state, action: PayloadAction<Document | Record<string, never>>) => {
      state.selectedAsset = action.payload
    },
    updateJansAsset: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    updateJansAssetResponse: (state, action: PayloadAction<AssetResponsePayload>) => {
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
    setAssetModal: (state, action: PayloadAction<boolean>) => {
      state.assetModal = action.payload
    },
    setShowErrorModal: (state, action: PayloadAction<boolean>) => {
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

export const { actions, reducer } = assetSlice
export default reducer
reducerRegistry.register('assetReducer', reducer)
