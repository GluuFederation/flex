import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { InitState } from './types/initTypes'

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
    getScripts: (state) => {
      state.loadingScripts = true
    },
    getScriptsResponse: (state, action: PayloadAction<{ data?: { entries?: any[] } }>) => {
      state.loadingScripts = false
      if (action.payload?.data) {
        state.scripts = action.payload.data?.entries || []
      }
    },
    getClients: () => {},
    getClientsResponse: (
      state,
      action: PayloadAction<{ data?: { entries?: any[]; totalEntriesCount?: number } }>,
    ) => {
      if (action.payload?.data) {
        state.clients = action.payload.data?.entries || []
        state.totalClientsEntries = action.payload.data.totalEntriesCount || 0
      }
    },
    getScopes: () => {},
    getScopesResponse: (state, action: PayloadAction<{ data?: any[] }>) => {
      if (action.payload?.data) {
        state.scopes = action.payload.data
      }
    },
    getAttributes: () => {},
    getAttributesResponse: (state, action: PayloadAction<{ data?: { entries?: any[] } }>) => {
      if (action.payload?.data) {
        state.attributes = action.payload.data?.entries || []
      }
    },
    handleApiTimeout: (state, action: PayloadAction<{ isTimeout?: boolean }>) => {
      state.isLoading = false
      state.isTimeout = action.payload.isTimeout || false
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
