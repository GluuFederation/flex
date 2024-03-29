import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    assets: [],
    loading: false,
    saveOperationFlag: false,
    errorInSaveOperationFlag: false,
    totalItems: 0,
    entriesCount: 0,
    selectedAsset: {},
    loadingAssets: false,
    assetModal: false,
    showErrorModal: false
}

const assetSlice = createSlice({
    name: 'assets',
    initialState,
    reducers: {
        getAssets: (state, action) => {
            state.loading = true
        },
        getAssetResponse: (state, action) => {
            state.loading = false
            if (action.payload?.data) {
                state.assets = action.payload.data.entries
                state.totalItems = action.payload.data.totalEntriesCount
                state.entriesCount = action.payload.data.entriesCount
            }
        },
        createAsset: (state) => {
            state.loading = true
            state.saveOperationFlag = false
            state.errorInSaveOperationFlag = false
        },
        createAssetResponse: (state, action) => {
            state.loading = false
            state.saveOperationFlag = true
            if (action.payload?.data) {
                state.errorInSaveOperationFlag = false
            } else {
                state.errorInSaveOperationFlag = true
            }
        },
        deleteAsset: (state) => {
            state.loading = true
        },
        deleteAssetResponse: (state) => {
            state.loading = false
        },
        setSelectedAsset: (state, action) => {
            state.selectedAsset = action.payload
        },
        updateAsset: (state) => {
            state.loading = true
            state.saveOperationFlag = false
            state.errorInSaveOperationFlag = false
        },
        updateAssetResponse: (state, action) => {
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
        }
    },
})

export const {
    getAssets,
    getAssetResponse,
    createAsset,
    createAssetResponse,
    deleteAsset,
    deleteAssetResponse,
    setSelectedAsset,
    updateAsset,
    updateAssetResponse,
    resetFlags,
    setAssetModal,
    setShowErrorModal
} = assetSlice.actions
export const { actions, reducer, state } = assetSlice
export default reducer
reducerRegistry.register('assetReducer', reducer)