import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
const initialState = {
  items: [],
  item: {},
  loading: false,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
  scopesByCreator: [],
  totalItems: 0,
  entriesCount: 0,
  clientScopes: [],
  loadingClientScopes: false,
  selectedClientScopes: [],
}

const scopeSlice = createSlice({
  name: 'scope',
  initialState,
  reducers: {
    scopeHandleLoading: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    getScopes: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    handleUpdateScopeResponse: (state, action) => {
      state.loading = false
      if (action.payload.data) {
        state.items = action.payload.data.entries || []
        state.totalItems = action.payload.data.totalEntriesCount
        state.entriesCount = action.payload.data.entriesCount
      } else {
        state.saveOperationFlag = false
        state.errorInSaveOperationFlag = false
      }
    },
    setCurrentItem: (state, action) => {
      state.item = action.payload.item
      state.loading = false
    },
    deleteScope: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    deleteScopeResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = state.items.filter((i) => i.inum !== action.payload.data)
      } else {
        state.saveOperationFlag = false
        state.errorInSaveOperationFlag = false
      }
    },
    editScopeResponse: (state, action) => {
      state.loading = false
      state.saveOperationFlag = true
      if (action.payload?.data) {
        state.items = [...state.items]
        state.errorInSaveOperationFlag = false
      } else {
        state.errorInSaveOperationFlag = true
      }
    },
    addScopeResponse: (state, action) => {
      state.loading = false
      state.saveOperationFlag = true
      if (action.payload?.data) {
        state.items = [...state.items]
        state.errorInSaveOperationFlag = false
      } else {
        state.errorInSaveOperationFlag = true
      }
    },
    getScopeByPatternResponse: (state, action) => {
      state.loading = false
      if (action.payload.data) {
        state.item = action.payload.data
      } else {
        state.saveOperationFlag = false
        state.errorInSaveOperationFlag = false
      }
    },
    getScopeByCreatorResponse: (state, action) => {
      state.scopesByCreator = action.payload.data
    },
    getClientScopesResponse: (state, action) => {
      state.loading = false
      if (action.payload.data) {
        state.clientScopes = action.payload.data.entries
        state.loadingClientScopes = false
      } else {
        state.saveOperationFlag = false
        state.errorInSaveOperationFlag = false
      }
    },
    searchScopes: (state, action) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    addScope: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    editScope: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    getScopeByCreator: () => {},
    getScopeByInum: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    getClientScopes: (state) => {
      state.loadingClientScopes = true
    },
    emptyScopes: (state) => {
      state.items = []
    },
    setClientSelectedScopes: (state, action) => {
      state.selectedClientScopes = action.payload
    },
  },
})

export const {
  scopeHandleLoading,
  handleUpdateScopeResponse,
  setCurrentItem,
  deleteScopeResponse,
  editScopeResponse,
  getScopeByPatternResponse,
  addScopeResponse,
  getScopeByCreatorResponse,
  getClientScopesResponse,
  getScopes,
  searchScopes,
  deleteScope,
  addScope,
  editScope,
  getScopeByCreator,
  getScopeByInum,
  getClientScopes,
  emptyScopes,
  setClientSelectedScopes,
} = scopeSlice.actions
export { initialState }
export const { actions, reducer, state } = scopeSlice
reducerRegistry.register('scopeReducer', reducer)
