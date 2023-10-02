import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  item: {},
  view: false,
  loading: false,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
  totalItems: 0,
  entriesCount: 0
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
      state.items = []
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    editClientResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        const clients = state?.items?.filter(
          (e) => e.inum !== action.payload.data.inum
        )
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
    },
    viewOnly: (state, action) => {
      state.loading = false
      if (action.payload) {
        state.view = action.payload?.view
      }
    }
  }
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
  viewOnly
} = oidcSlice.actions
export const { actions, reducer, state } = oidcSlice
reducerRegistry.register('oidcReducer', reducer)
