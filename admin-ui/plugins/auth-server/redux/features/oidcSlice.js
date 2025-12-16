import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  item: {},
  view: false,
  loading: false,
  isTokenLoading: false,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
  totalItems: 0,
  entriesCount: 0,
  tokens: {},
}

const oidcSlice = createSlice({
  name: 'oidc',
  initialState,
  reducers: {
    getOpenidClients: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    searchClients: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    getOpenidClientsResponse: (state, action) => {
      state.loading = false
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
      if (action.payload?.data) {
        state.items = action.payload.data.entries
        state.totalItems = action.payload.data.totalEntriesCount
        state.entriesCount = action.payload.data.entriesCount
      }
    },
    addNewClientAction: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    addClientResponse: (state, action) => {
      state.loading = false
      state.saveOperationFlag = true
      if (action.payload?.data) {
        state.errorInSaveOperationFlag = false
      } else {
        state.errorInSaveOperationFlag = true
      }
    },
    editClient: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    editClientResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        const clients = state?.items?.filter((e) => e.inum !== action.payload.data.inum)
        state.items = [action.payload.data, ...clients]
        state.saveOperationFlag = true
        state.errorInSaveOperationFlag = false
      } else {
        state.saveOperationFlag = true
        state.errorInSaveOperationFlag = true
      }
    },
    deleteClient: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    deleteClientResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = state.items.filter((i) => i.inum !== action.payload.data)
      }
    },
    setCurrentItem: (state, action) => {
      state.item = action.payload?.item
      state.loading = false
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    viewOnly: (state, action) => {
      state.loading = false
      if (action.payload) {
        state.view = action.payload?.view
      }
    },
    getTokenByClient: (state) => {
      state.isTokenLoading = true
    },
    getTokenByClientResponse: (state, action) => {
      state.isTokenLoading = false
      if (action.payload?.data) {
        console.log(action.payload.data.entries)
        state.tokens.items = action.payload?.data?.entries || []
        state.tokens.totalItems = action.payload?.data?.totalEntriesCount || 0
        state.tokens.entriesCount = action.payload?.data?.entriesCount || 0
      }
    },
    deleteClientToken: (state) => {
      state.isTokenLoading = true
    },
    deleteClientTokenResponse: (state, action) => {
      state.isTokenLoading = false
    },
  },
})

export const {
  getOpenidClients,
  searchClients,
  getOpenidClientsResponse,
  addNewClientAction,
  addClientResponse,
  editClient,
  editClientResponse,
  deleteClient,
  deleteClientResponse,
  setCurrentItem,
  viewOnly,
  getTokenByClient,
  getTokenByClientResponse,
  deleteClientToken,
  deleteClientTokenResponse,
} = oidcSlice.actions
export const { actions, reducer, state } = oidcSlice
reducerRegistry.register('oidcReducer', reducer)
