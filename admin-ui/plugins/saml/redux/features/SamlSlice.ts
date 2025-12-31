import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  SamlReduxState,
  SamlConfiguration,
  WebsiteSsoServiceProvider,
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
  loadingWebsiteSsoServiceProvider: false,
  totalItems: 0,
  entriesCount: 0,
  websiteSsoServiceProviders: [],
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
    getSamlIdentities: (state, _action: PayloadAction<GetSamlIdentityProviderPayload>) => {
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
    deleteSamlIdentity: (
      state,
      _action: PayloadAction<{ action: { action_message: string; action_data: string } }>,
    ) => {
      state.loading = true
      state.loadingSamlIdentity = true
    },
    deleteSamlIdentityResponse: (state) => {
      state.loading = false
      state.loadingSamlIdentity = false
    },
    deleteWebsiteSsoServiceProvider: (
      state,
      _action: PayloadAction<{ action: { action_message?: string; action_data: string } }>,
    ) => {
      state.loading = true
      state.loadingWebsiteSsoServiceProvider = true
    },
    deleteWebsiteSsoServiceProviderResponse: (state) => {
      state.loading = false
      state.loadingWebsiteSsoServiceProvider = false
    },
    getWebsiteSsoServiceProvider: (state) => {
      state.loadingWebsiteSsoServiceProvider = true
    },
    getWebsiteSsoServiceProviderResponse: (
      state,
      action: PayloadAction<{ data?: WebsiteSsoServiceProvider[] } | null>,
    ) => {
      state.loadingWebsiteSsoServiceProvider = false
      state.websiteSsoServiceProviders = action.payload?.data || []
    },
    createWebsiteSsoServiceProvider: (
      state,
      _action: PayloadAction<{ action: { action_message: string; action_data: FormData } }>,
    ) => {
      state.loading = true
      state.loadingWebsiteSsoServiceProvider = true
    },
    createWebsiteSsoServiceProviderResponse: (state) => {
      state.loading = false
      state.loadingWebsiteSsoServiceProvider = false
    },
    updateWebsiteSsoServiceProvider: (
      state,
      _action: PayloadAction<{
        action: { action_message: string; action_data: FormData; action_inum?: string }
      }>,
    ) => {
      state.loading = true
      state.loadingWebsiteSsoServiceProvider = true
    },
    updateWebsiteSsoServiceProviderResponse: (state) => {
      state.loading = false
      state.loadingWebsiteSsoServiceProvider = false
    },
  },
})

export const {
  getSamlConfiguration,
  getSamlConfigurationResponse,
  toggleSavedFormFlag,
  getSamlIdentities,
  getSamlIdentitiesResponse,
  putSamlProperties,
  putSamlPropertiesResponse,
  createSamlIdentity,
  samlIdentityResponse,
  deleteSamlIdentity,
  deleteSamlIdentityResponse,
  updateSamlIdentityResponse,
  updateSamlIdentity,
  getWebsiteSsoServiceProvider,
  getWebsiteSsoServiceProviderResponse,
  deleteWebsiteSsoServiceProvider,
  deleteWebsiteSsoServiceProviderResponse,
  createWebsiteSsoServiceProvider,
  createWebsiteSsoServiceProviderResponse,
  updateWebsiteSsoServiceProvider,
  updateWebsiteSsoServiceProviderResponse,
} = samlSlice.actions

export default samlSlice.reducer

reducerRegistry.register('idpSamlReducer', samlSlice.reducer)
