import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import type { ScopeItem, ScopeState } from 'Redux/types'
import type {
  DeleteScopeResponsePayload,
  EditOrAddScopeResponsePayload,
  GetClientScopesResponsePayload,
  GetScopeByCreatorResponsePayload,
  GetScopeByPatternResponsePayload,
  ScopeActionPayload,
  ScopesResponsePayload,
  SetCurrentScopePayload,
} from './types'

export const initialState: ScopeState = {
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
    getScopes: (state, _action: PayloadAction<ScopeActionPayload>) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    handleUpdateScopeResponse: (state, action: PayloadAction<ScopesResponsePayload>) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = action.payload.data.entries ?? []
        state.totalItems = action.payload.data.totalEntriesCount ?? 0
        state.entriesCount = action.payload.data.entriesCount ?? 0
      } else {
        state.saveOperationFlag = false
        state.errorInSaveOperationFlag = false
      }
    },
    setCurrentItem: (state, action: PayloadAction<SetCurrentScopePayload>) => {
      state.item = action.payload?.item ?? {}
      state.loading = false
    },
    deleteScope: (state, _action: PayloadAction<ScopeActionPayload>) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    deleteScopeResponse: (state, action: PayloadAction<DeleteScopeResponsePayload>) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = state.items.filter((i) => i.inum !== action.payload?.data)
      } else {
        state.saveOperationFlag = false
        state.errorInSaveOperationFlag = false
      }
    },
    editScopeResponse: (state, action: PayloadAction<EditOrAddScopeResponsePayload>) => {
      state.loading = false
      state.saveOperationFlag = true
      if (action.payload?.data) {
        state.items = [...state.items]
        state.errorInSaveOperationFlag = false
      } else {
        state.errorInSaveOperationFlag = true
      }
    },
    addScopeResponse: (state, action: PayloadAction<EditOrAddScopeResponsePayload>) => {
      state.loading = false
      state.saveOperationFlag = true
      if (action.payload?.data) {
        state.items = [...state.items]
        state.errorInSaveOperationFlag = false
      } else {
        state.errorInSaveOperationFlag = true
      }
    },
    getScopeByPatternResponse: (state, action: PayloadAction<GetScopeByPatternResponsePayload>) => {
      state.loading = false
      if (action.payload?.data) {
        state.item = action.payload.data
      } else {
        state.saveOperationFlag = false
        state.errorInSaveOperationFlag = false
      }
    },
    getScopeByCreatorResponse: (state, action: PayloadAction<GetScopeByCreatorResponsePayload>) => {
      const payload = action.payload
      if (Array.isArray(payload)) {
        state.scopesByCreator = payload
      } else {
        state.scopesByCreator = payload?.data ?? []
      }
    },
    getClientScopesResponse: (state, action: PayloadAction<GetClientScopesResponsePayload>) => {
      state.loading = false
      if (action.payload?.data) {
        state.clientScopes = action.payload.data.entries ?? []
        state.loadingClientScopes = false
      } else {
        state.saveOperationFlag = false
        state.errorInSaveOperationFlag = false
      }
    },
    searchScopes: (state, _action: PayloadAction<ScopeActionPayload>) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    addScope: (state, _action: PayloadAction<ScopeActionPayload>) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    editScope: (state, _action: PayloadAction<ScopeActionPayload>) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    getScopeByCreator: (_state, _action: PayloadAction<ScopeActionPayload>) => {
      // handled by saga
    },
    getScopeByInum: (state, _action: PayloadAction<ScopeActionPayload>) => {
      state.loading = true
      state.saveOperationFlag = false
      state.errorInSaveOperationFlag = false
    },
    getClientScopes: (state, _action: PayloadAction<ScopeActionPayload>) => {
      state.loadingClientScopes = true
    },
    emptyScopes: (state) => {
      state.items = []
    },
    setClientSelectedScopes: (state, action: PayloadAction<ScopeItem[]>) => {
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

export const { actions, reducer } = scopeSlice
reducerRegistry.register('scopeReducer', reducer)
