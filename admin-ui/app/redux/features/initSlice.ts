import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GenericItem {
  [key: string]: string | number | boolean | string[] | number[] | boolean[] | null
}

export interface InitState {
  scripts: GenericItem[]
  clients: GenericItem[]
  scopes: GenericItem[]
  attributes: GenericItem[]
  totalClientsEntries: number
  isTimeout: boolean
  loadingScripts: boolean
}

interface ActionDataPayload {
  [key: string]: string | number | boolean | string[] | number[] | boolean[] | null
}

interface ScriptsResponsePayload {
  data?: {
    entries?: GenericItem[]
  }
}

interface ClientsResponsePayload {
  data?: {
    entries?: GenericItem[]
    totalEntriesCount?: number
  }
}

interface ScopesResponsePayload {
  data?: GenericItem[]
}

interface AttributesResponsePayload {
  data?: {
    entries?: GenericItem[]
  }
}

interface ApiTimeoutPayload {
  isTimeout: boolean
}

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
