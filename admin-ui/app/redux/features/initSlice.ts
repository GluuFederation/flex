import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  ActionDataPayload,
  ApiTimeoutPayload,
  AttributesResponsePayload,
  ClientsResponsePayload,
  InitState,
  ScopesResponsePayload,
  ScriptsResponsePayload,
} from './types'

export type { InitState }

const initialState: InitState = {
  scripts: [],
  clients: [],
  scopes: [],
  attributes: [],
  totalClientsEntries: 0,
  isTimeout: false,
  loadingScripts: false,
}

const initSlice = createSlice({
  name: 'init',
  initialState,
  reducers: {
    getScripts: (state, _action: PayloadAction<{ action?: ActionDataPayload }>) => {
      state.loadingScripts = true
    },
    getScriptsResponse: (state, action: PayloadAction<ScriptsResponsePayload>) => {
      state.loadingScripts = false
      if (action.payload?.data) {
        state.scripts = action.payload.data.entries || []
      }
    },
    getClients: () => {},
    getClientsResponse: (state, action: PayloadAction<ClientsResponsePayload>) => {
      if (action.payload?.data) {
        state.clients = action.payload.data.entries || []
        state.totalClientsEntries = action.payload.data.totalEntriesCount || 0
      }
    },
    getScopes: () => {},
    getScopesResponse: (state, action: PayloadAction<ScopesResponsePayload>) => {
      if (action.payload?.data) {
        state.scopes = action.payload.data
      }
    },
    getAttributes: () => {},
    getAttributesResponse: (state, action: PayloadAction<AttributesResponsePayload>) => {
      if (action.payload?.data) {
        state.attributes = action.payload.data.entries || []
      }
    },
    handleApiTimeout: (state, action: PayloadAction<ApiTimeoutPayload>) => {
      state.isTimeout = action.payload.isTimeout
    },
  },
})

export const {
  getScripts,
  getScriptsResponse,
  getClients,
  getClientsResponse,
  getScopes,
  getScopesResponse,
  getAttributes,
  getAttributesResponse,
  handleApiTimeout,
} = initSlice.actions
export const { actions, reducer } = initSlice
reducerRegistry.register('initReducer', reducer)
