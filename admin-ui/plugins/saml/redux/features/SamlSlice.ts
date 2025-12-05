import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  SamlReduxState,
  SamlConfiguration,
  TrustRelationship,
  PutSamlPropertiesPayload,
  GetSamlIdentityProviderPayload,
} from '../../types/redux'
import type { SamlIdentityProviderResponse } from '../../types/api'

const initialState: SamlReduxState = {
  configuration: {
    enabled: false,
    selectedIdp: '',
    ignoreValidation: false,
    applicationName: '',
  },
  loading: false,
  savedForm: false,
  items: [],
  loadingSamlIdp: false,
  loadingSamlIdentity: false,
  loadingTrustRelationship: false,
  totalItems: 0,
  entriesCount: 0,
  trustRelationships: [],
}

const samlSlice = createSlice({
  name: 'idpSaml',
  initialState,
  reducers: {
    getSamlConfiguration: (state) => {
      state.loading = true
    },
    getSamlConfigurationResponse: (state, action: PayloadAction<SamlConfiguration | null>) => {
      state.configuration = action.payload
        ? action.payload
        : {
            enabled: false,
            selectedIdp: '',
            ignoreValidation: false,
            applicationName: '',
          }
      state.loading = false
    },
    getSamlIdentites: (state, _action: PayloadAction<GetSamlIdentityProviderPayload>) => {
      state.loadingSamlIdp = true
    },
    getSamlIdentitiesResponse: (
      state,
      action: PayloadAction<{ data?: SamlIdentityProviderResponse } | null>,
    ) => {
      state.loadingSamlIdp = false
      if (action.payload?.data) {
        state.items = action.payload.data.entries || []
        state.totalItems = action.payload.data.totalEntriesCount
        state.entriesCount = action.payload.data.entriesCount
      }
    },
    toggleSavedFormFlag: (state, action: PayloadAction<boolean | null>) => {
      state.savedForm = action.payload ?? false
    },
    putSamlProperties: (state, _action: PayloadAction<PutSamlPropertiesPayload>) => {
      state.loading = true
    },
    putSamlPropertiesResponse: (state, action: PayloadAction<SamlConfiguration | null>) => {
      state.loading = false
      state.configuration = action.payload ?? {
        enabled: false,
        selectedIdp: '',
        ignoreValidation: false,
        applicationName: '',
      }
    },
    createSamlIdentity: (
      state,
      _action: PayloadAction<{ action: { action_message: string; action_data: FormData } }>,
    ) => {
      state.loading = true
      state.loadingSamlIdentity = true
    },
    samlIdentityResponse: (state) => {
      state.loading = false
      state.loadingSamlIdentity = false
    },
    updateSamlIdentity: (
      state,
      _action: PayloadAction<{
        action: { action_message: string; action_data: FormData; action_inum?: string }
      }>,
    ) => {
      state.loading = true
      state.loadingSamlIdentity = true
    },
    updateSamlIdentityResponse: (state) => {
      state.loading = false
      state.loadingSamlIdentity = false
    },
    deleteSamlIdentity: (state, _action: PayloadAction<{ action: { action_data: string } }>) => {
      state.loading = true
    },
    deleteSamlIdentityResponse: (state) => {
      state.loading = false
    },
    deleteTrustRelationship: (
      state,
      _action: PayloadAction<{ action: { action_data: string } }>,
    ) => {
      state.loadingTrustRelationship = true
    },
    deleteTrustRelationshipResponse: (state) => {
      state.loadingTrustRelationship = false
    },
    getTrustRelationship: (state) => {
      state.loadingTrustRelationship = true
    },
    getTrustRelationshipResponse: (
      state,
      action: PayloadAction<{ data?: TrustRelationship[] } | null>,
    ) => {
      state.loadingTrustRelationship = false
      state.trustRelationships = action.payload?.data || []
    },
    createTrustRelationship: (
      state,
      _action: PayloadAction<{ action: { action_message: string; action_data: FormData } }>,
    ) => {
      state.loading = true
      state.loadingTrustRelationship = true
    },
    updateTrustRelationship: (
      state,
      _action: PayloadAction<{
        action: { action_message: string; action_data: FormData; action_inum?: string }
      }>,
    ) => {
      state.loading = true
      state.loadingTrustRelationship = true
    },
    updateTrustRelationshipResponse: (state) => {
      state.loading = false
      state.loadingTrustRelationship = false
    },
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
  updateSamlIdentity,
  getTrustRelationship,
  getTrustRelationshipResponse,
  deleteTrustRelationship,
  deleteTrustRelationshipResponse,
  createTrustRelationship,
  updateTrustRelationship,
  updateTrustRelationshipResponse,
} = samlSlice.actions

export default samlSlice.reducer

reducerRegistry.register('idpSamlReducer', samlSlice.reducer)
