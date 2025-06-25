import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: true,
  view: false,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
  totalItems: 0,
  entriesCount: 0,
  scriptTypes: [],
  hasFetchedScriptTypes: false,
  loadingScriptTypes: false,
}

const customScriptSlice = createSlice({
  name: 'customScript',
  initialState,
  reducers: {
    getCustomScripts: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    setIsScriptTypesLoading: (state, action) => {
      state.loadingScriptTypes = action.payload
    },
    getCustomScriptsResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = action.payload.data?.entries || []
        state.totalItems = action.payload.data.totalEntriesCount
        state.entriesCount = action.payload.data.entriesCount
      }
    },
    addCustomScript: (state, action) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    addCustomScriptResponse: (state, action) => {
      state.loading = false
      state.errorInSaveOperationFlag = false
      if (action.payload?.data) {
        state.saveOperationFlag = true
      } else {
        state.saveOperationFlag = false
      }
    },
    editCustomScript: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    editCustomScriptResponse: (state, action) => {
      state.loading = false
      state.saveOperationFlag = true
      if (action.payload?.data) {
        state.items = [...state.items]
        state.errorInSaveOperationFlag = false
      } else {
        state.errorInSaveOperationFlag = true
      }
    },
    // getCustomScriptByInum: () => {},
    // getCustomScriptByInumResponse: () => {},
    getCustomScriptByType: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    getCustomScriptByTypeResponse: (state, action) => {
      if (action.payload.data) {
        state.items = action.payload.data.entries
      }
      state.loading = false
    },
    deleteCustomScript: (state) => {
      state.loading = true
    },
    deleteCustomScriptResponse: (state, action) => {
      state.loading = false
      if (action.payload?.inum) {
        const items = state.items.filter((item) => item.inum !== action.payload.inum)
        state.items = items
      } else {
        state.saveOperationFlag = false
        state.errorInSaveOperationFlag = false
      }
    },
    setScriptTypes: (state, action) => {
      ;(state.scriptTypes = action.payload || []), (state.hasFetchedScriptTypes = true)
    },
    setCurrentItem: (state, action) => {
      state.item = action.payload?.item
      state.loading = false
    },
    viewOnly: (state, action) => {
      state.loading = false
      if (action.payload) {
        state.view = action.payload.view
      } else {
        state.saveOperationFlag = false
        state.errorInSaveOperationFlag = false
      }
    },
    getScriptTypes: () => {},
  },
})

export const {
  getCustomScriptsResponse,
  getCustomScripts,
  addCustomScriptResponse,
  addCustomScript,
  editCustomScriptResponse,
  editCustomScript,
  deleteCustomScript,
  deleteCustomScriptResponse,
  getCustomScriptByType,
  viewOnly,
  setCurrentItem,
  setScriptTypes,
  getScriptTypes,
  setIsScriptTypesLoading,
} = customScriptSlice.actions
export { initialState }
export const { actions, reducer, state } = customScriptSlice
reducerRegistry.register('customScriptReducer', reducer)
