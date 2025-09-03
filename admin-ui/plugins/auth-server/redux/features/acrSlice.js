import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  acrs: {},
  scripts: [],
  loading: false,
  acrReponse: {},
}

const acrSlice = createSlice({
  name: 'acr',
  initialState,
  reducers: {
    getAcrsConfig: (state) => {
      state.loading = true
    },
    getAcrsResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.acrReponse = action.payload.data
      }
    },
    editAcrs: (state) => {
      state.loading = true
    },
    editAcrsResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.acrReponse = action.payload.data
      }
    },
    editAcrsResponseFailed: (state) => {
      state.loading = false
    },
  },
})

export const {
  getAcrsConfig,
  getAcrsResponse,
  editAcrs,
  editAcrsResponse,
  editAcrsResponseFailed,
} = acrSlice.actions

export const { actions, reducer, state } = acrSlice
reducerRegistry.register('acrReducer', reducer)
