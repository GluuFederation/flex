import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  AssetState,
  AssetResponsePayload,
  CreateAssetActionPayload,
  UpdateAssetActionPayload,
} from './types/asset'
import { Document } from '../../components/Assets/types/AssetApiTypes'

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

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    createJansAsset: (state, _action: PayloadAction<CreateAssetActionPayload>) => {
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
    setSelectedAsset: (state, action: PayloadAction<Document | Record<string, never>>) => {
      state.selectedAsset = action.payload
    },
    updateJansAsset: (state, _action: PayloadAction<UpdateAssetActionPayload>) => {
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
  createJansAsset,
  createJansAssetResponse,
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
