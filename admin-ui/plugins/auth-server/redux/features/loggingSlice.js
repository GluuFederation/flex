import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  logging: {},
  loading: false,
}

const loggingSlice = createSlice({
  name: 'logging',
  initialState,
  reducers: {
    getLoggingConfig: (state) => {
      state.loading = true
    },
    getLoggingResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.logging = action.payload.data
      }
    },
    editLoggingConfig: (state, _action) => {
      state.loading = true
    },
    editLoggingResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.logging = action.payload.data
      }
    },
  },
})

export const { getLoggingConfig, getLoggingResponse, editLoggingConfig, editLoggingResponse } =
  loggingSlice.actions
export const { actions, reducer, state } = loggingSlice
reducerRegistry.register('loggingReducer', reducer)
