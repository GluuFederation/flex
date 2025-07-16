import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  scim: {},
  loading: true,
}

const scimSlice = createSlice({
  name: 'scim',
  initialState,
  reducers: {
    getScimConfiguration: (state) => {
      state.loading = true
    },
    putScimConfiguration: (state, action) => {
      state.loading = true
    },
    getScimConfigurationResponse: (state, action) => {
      state.scim = action.payload ? action.payload : {}
      state.loading = false
    },
  },
})

export const { getScimConfiguration, putScimConfiguration, getScimConfigurationResponse } =
  scimSlice.actions
export const { actions, reducer } = scimSlice
reducerRegistry.register('scimReducer', reducer)
