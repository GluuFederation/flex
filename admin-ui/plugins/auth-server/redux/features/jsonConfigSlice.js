import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  configuration: {},
  loading: false
}

const jsonConfigSlice = createSlice({
  name: 'jsonConfig',
  initialState: initialState,
  reducers: {
    getJsonConfig: (state) => {
      state.loading = true
    },
    getJsonConfigResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.configuration = action.payload.data
      }
    },
    patchJsonConfig: (state,action) => {
      state.loading = true
    },
    patchJsonConfigResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.configuration = action.payload.data
      }
    },
    handleDefault: (state) => {
      state.loading = false
    }
  }
})

export const {
  getJsonConfig,
  getJsonConfigResponse,
  patchJsonConfig,
  patchJsonConfigResponse,
  handleDefault
} = jsonConfigSlice.actions

export const { actions, reducer, state } = jsonConfigSlice
reducerRegistry.register('jsonConfigReducer', reducer)
