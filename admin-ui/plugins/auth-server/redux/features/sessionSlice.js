import { createSlice } from "@reduxjs/toolkit";
import reducerRegistry from "Redux/reducers/ReducerRegistry";

const initialState = {
  items: [],
  item: {},
  loading: false,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    toggleLoader: (state, action) => {
      state.loading = action.payload;
    }, 
    handleUpdateSessionsResponse: (state, action) => {
      state.loading = false;
      state.items = action.payload.data || [];
    },
    handleRevokeSession: (state, action) => {
      state.loading = false;
      state.items = state.items.filter(
        ({ userDn }) => userDn !== action.payload.data
      );
    }
  },
});

reducerRegistry.register("SessionReducer", reducer);
export const {
  handleUpdateSessionsResponse,
  toggleLoader,
  handleRevokeSession,
} = sessionSlice.actions;

export const { actions, reducer, state } = sessionSlice;
