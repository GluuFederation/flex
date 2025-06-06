import { createSlice } from "@reduxjs/toolkit";
import reducerRegistry from "Redux/reducers/ReducerRegistry";

const initialState = {
  serverStatus: null,
  dbStatus: null,
  health: {},
  loading: false,
};

const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {
    getHealthStatus: (state) => {
      state.loading = true;
    },
    getHealthServerStatus: (state) => {
      state.loading = true;
    },
    getHealthStatusResponse: (state, action) => {
      state.loading = false;
      if (action.payload?.data) {
        state.serverStatus = action.payload.data.status;
        state.dbStatus = action.payload.data.db_status;
      }
    },
    getHealthServerStatusResponse: (state, action) => {
      state.loading = false;
      if (action.payload?.data) {
        state.health = action.payload.data
      }
    },
  },
});

export const {
  getHealthStatus,
  getHealthStatusResponse,
  getHealthServerStatus,
  getHealthServerStatusResponse,
} = healthSlice.actions;

export default healthSlice.reducer;
reducerRegistry.register("healthReducer", healthSlice.reducer);
