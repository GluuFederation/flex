import reducerRegistry from "Redux/reducers/ReducerRegistry";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fido: {},
  loading: false,
};

const fidoSlice = createSlice({
  name: "fido2",
  initialState,
  reducers: {
    getFidoConfiguration: (state) => {
      state.loading = true;
    },
    putFidoConfiguration: (state, action) => {
      state.loading = true;
    },
    getFidoConfigurationResponse: (state, action) => {
      state.fido = action.payload ? action.payload : {};
      state.loading = false;
    },
    deleteFido2DeviceData: (state, action) => {
      state.loading = true;
    },
    deleteFido2DeviceDataResponse: (state, action) => {
      state.loading = false;
    },
  },
});

export const {
  getFidoConfiguration,
  putFidoConfiguration,
  getFidoConfigurationResponse,
  deleteFido2DeviceData,
  deleteFido2DeviceDataResponse
} = fidoSlice.actions;
export const { actions, reducer } = fidoSlice;
reducerRegistry.register("fidoReducer", reducer);
