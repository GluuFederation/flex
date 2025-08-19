import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  CustomScriptItem,
  CustomScriptState,
  CustomScriptResponse,
  CustomScriptItemResponse,
  ScriptType,
  ModuleProperty,
  ConfigurationProperty,
} from './types/customScript'

const initialState: CustomScriptState = {
  items: [],
  item: undefined,
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
    setIsScriptTypesLoading: (state, action: PayloadAction<boolean>) => {
      state.loadingScriptTypes = action.payload
    },
    getCustomScriptsResponse: (state, action: PayloadAction<CustomScriptResponse>) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = action.payload.data?.entries || []
        state.totalItems = action.payload.data.totalEntriesCount || 0
        state.entriesCount = action.payload.data.entriesCount || 0
      }
    },
    addCustomScript: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    addCustomScriptResponse: (state, action: PayloadAction<CustomScriptItemResponse>) => {
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
    editCustomScriptResponse: (state, action: PayloadAction<CustomScriptItemResponse>) => {
      state.loading = false
      state.saveOperationFlag = true
      if (action.payload?.data) {
        state.items = [...state.items]
        state.errorInSaveOperationFlag = false
      } else {
        state.errorInSaveOperationFlag = true
      }
    },

    getCustomScriptByType: (state) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    getCustomScriptByTypeResponse: (state, action: PayloadAction<CustomScriptResponse>) => {
      if (action.payload.data) {
        state.items = action.payload.data.entries || []
      }
      state.loading = false
    },
    deleteCustomScript: (state) => {
      state.loading = true
    },
    deleteCustomScriptResponse: (state, action: PayloadAction<{ inum?: string }>) => {
      state.loading = false
      if (action.payload?.inum) {
        const items = state.items.filter((item) => item.inum !== action.payload.inum)
        state.items = items
      } else {
        state.saveOperationFlag = false
        state.errorInSaveOperationFlag = false
      }
    },
    setScriptTypes: (state, action: PayloadAction<ScriptType[]>) => {
      state.scriptTypes = action.payload || []
      state.hasFetchedScriptTypes = true
    },
    setCurrentItem: (state, action: PayloadAction<{ item: CustomScriptItem }>) => {
      state.item = action.payload?.item
      state.loading = false
    },
    viewOnly: (state, action: PayloadAction<{ view: boolean }>) => {
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
  getCustomScriptByTypeResponse,
  viewOnly,
  setCurrentItem,
  setScriptTypes,
  getScriptTypes,
  setIsScriptTypesLoading,
} = customScriptSlice.actions

export { initialState }
export type {
  CustomScriptItem,
  CustomScriptState,
  ScriptType,
  ModuleProperty,
  ConfigurationProperty,
  CustomScriptResponse,
}
export const { actions, reducer } = customScriptSlice
reducerRegistry.register('customScriptReducer', reducer)
