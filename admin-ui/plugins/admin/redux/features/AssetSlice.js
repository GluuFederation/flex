import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    assets: [{
        "dn": "inum=0b436302-b729-4eb2-b211-335980dcab43,ou=document,o=jans",
        "selected": false,
        "inum": "0b436302-b729-4eb2-b211-335980dcab43",
        "displayName": "mermaid-extra.css",
        "description": "/opt/jans/jetty/jans-config-api/",
        "creationDate": "2024-04-1T12:53:00",
        "document": ".mermaid {\r\n\toverflow: auto;\r\n}\r\n\r\n.mermaid svg {\r\n\twidth: 1315px;\r\n\theight: 600px;\r\n}\r\n",
        "jansModuleProperty": [
            "config-api",
            "jar",
            "/opt/jans/jetty/jans-config-api/custom/lib"
        ],
        "jansLevel": "1",
        "jansRevision": "2",
        "jansEnabled": true,
        "baseDn": "inum=0b436302-b729-4eb2-b211-335980dcab43,ou=document,o=jans"
    },
    {
        "dn": "inum=9d2f39f5-a910-4a03-a888-6f0f1ee03445,ou=document,o=jans",
        "selected": false,
        "inum": "9d2f39f5-a910-4a03-a888-6f0f1ee03445",
        "displayName": "kc-saml-plugin.jar",
        "description": "/opt/jans/jetty/jans-config-api/",
        "creationDate": "2024-03-14T12:53:00",
        "jansModuleProperty": [
            "config-api",
            "jar",
            "/opt/jans/jetty/jans-config-api/custom/lib"
        ],
        "jansEnabled": true,
        "baseDn": "inum=9d2f39f5-a910-4a03-a888-6f0f1ee03445,ou=document,o=jans"
    }],
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
    name: 'asset',
    initialState,
    reducers: {
        getJansAssets: (state, action) => {
            state.loading = true
        },
        getJansAssetResponse: (state, action) => {
            console.log("closing asset", action.payload)
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
    getJansAssets,
    getJansAssetResponse,
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