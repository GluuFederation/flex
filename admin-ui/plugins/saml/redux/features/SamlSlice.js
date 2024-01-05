import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  configuration: {},
  loading: false,
  savedForm: false,
  items: [],
  loadingSamlIdp: false,
  loadingSamlIdentity: false,
  totalItems: 0,
  entriesCount: 0
}

const samlSlice = createSlice({
  name: 'idpSaml',
  initialState: initialState,
  reducers: {
    getSamlConfiguration: (state) => {
      state.loading = true
    },
    getSamlConfigurationResponse: (state, action) => {
      state.configuration = action.payload ? action.payload : {}
      state.loading = false
    },
    getSamlIdentites: (state) => {
      state.loadingSamlIdp = true
    },
    getSamlIdentitiesResponse: (state, action) => {
      state.loadingSamlIdp = false
      if (action.payload?.data) { 
        state.items = action.payload.data.entries
        state.totalItems = action.payload.data.totalEntriesCount
        state.entriesCount = action.payload.data.entriesCount
      }
    },
    toggleSavedFormFlag: (state, action) => {
      state.savedForm = action.payload || false
    },
    putSamlProperties: (state) => {
      state.loading = true
    },
    putSamlPropertiesResponse: (state, action) => {
      state.loading = false
      state.configuration = action.payload || {}
    },
    createSamlIdentity: (state) => {
      state.loading = true
      state.loadingSamlIdentity = true
    },
    samlIdentityResponse: (state) => {
      state.loading = false
      state.loadingSamlIdentity = false
    },
    updateSamlIdentity: (state) => {
      state.loading = true
      state.loadingSamlIdentity = true
    },
    updateSamlIdentityResponse: (state) => {
      state.loading = false
      state.loadingSamlIdentity = false
    },
    deleteSamlIdentity: (state) => {
      state.loading = true
    },
    deleteSamlIdentityResponse: (state) => {
      state.loading = false
    }
  },
})

export const {
  getSamlConfiguration,
  getSamlConfigurationResponse,
  toggleSavedFormFlag,
  getSamlIdentites,
  getSamlIdentitiesResponse,
  putSamlProperties,
  putSamlPropertiesResponse,
  createSamlIdentity,
  samlIdentityResponse,
  deleteSamlIdentity,
  deleteSamlIdentityResponse,
  updateSamlIdentityResponse,
  updateSamlIdentity
} = samlSlice.actions

export default samlSlice.reducer

reducerRegistry.register('idpSamlReducer', samlSlice.reducer)
