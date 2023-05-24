import { createSlice } from "@reduxjs/toolkit";
import reducerRegistry from "Redux/reducers/ReducerRegistry";
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
};

const scopeSlice = createSlice({
  name: "scope",
  initialState,
  reducers: {
    scopeHandleLoading: (state, action) => {
      state.loading = true;
      state.saveOperationFlag = false;
      state.errorInSaveOperationFlag = false;
    },
    handleUpdateScopeResponse: (state, action) => {
      state.loading = false;
      if (action.payload.data) {
        state.items = action.payload.data.entries;
        state.totalItems = action.payload.data.totalEntriesCount;
        state.entriesCount = action.payload.data.entriesCount;
      } else {
        state.saveOperationFlag = false;
        state.errorInSaveOperationFlag = false;
      }
    },
    setCurrentItem: (state, action) => {
      state.item = action.payload;
      state.loading = false;
    },
    deleteScopeResponse: (state, action) => {
      state.loading = false;
      if (action.payload.data) {
        state.items = state.items.filter((i) => i.inum !== action.payload.data);
      } else {
        state.saveOperationFlag = false;
        state.errorInSaveOperationFlag = false;
      }
    },
    editScopeResponse: (state, action) => {
      state.loading = false;
      state.saveOperationFlag = true;
      if (action.payload.data) {
        state.items = [...state.items];
        state.errorInSaveOperationFlag = false;
      } else {
        state.errorInSaveOperationFlag = true;
      }
    },
    addScopeResponse: (state, action) => {
      state.loading = false;
      state.saveOperationFlag = true;
      if (action.payload.data) {
        state.items = [...state.items];
        state.errorInSaveOperationFlag = false;
      } else {
        state.errorInSaveOperationFlag = true;
      }
    },
    getScopeByPatternResponse: (state, action) => {
      state.loading = false;
      if (action.payload.data) {
        state.item = action.payload.data;
      } else {
        state.saveOperationFlag = false;
        state.errorInSaveOperationFlag = false;
      }
    },
    getScopeByCreatorResponse: (state, action) => {
      state.scopesByCreator = action.payload.data;
    },
    getClientScopesResponse: (state, action) => {
      if (action.payload.data) {
        state.clientScopes = action.payload.data.entries;
        state.loadingClientScopes = false;
      } else {
        state.saveOperationFlag = false;
        state.errorInSaveOperationFlag = false;
      }
    },
  },
});

reducerRegistry.register("scopeReducer", reducer);

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
} = scopeSlice.actions;
export const { actions, reducer, state } = scopeSlice;
