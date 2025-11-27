import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  acrs: {},
  scripts: [],
  loading: false,
  acrReponse: {},
  error: null,
}

const acrSlice = createSlice({
  name: 'acr',
  initialState,
  reducers: {
    getAcrsConfig: (state) => {
      state.loading = true
      state.error = null
    },
    getAcrsResponse: (state, action) => {
      state.loading = false
      state.error = null
      if (action.payload?.data) {
        state.acrReponse = action.payload.data
      }
    },
    getAcrsResponseFailed: (state, action) => {
      state.loading = false
      state.error = action?.payload?.error || action?.error || 'Failed to load ACRs configuration'
    },
    editAcrs: (state, _action) => {
      state.loading = true
      state.error = null
    },
    editAcrsResponse: (state, action) => {
      state.loading = false
      state.error = null
      if (action.payload?.data) {
        state.acrReponse = action.payload.data
      }
    },
    editAcrsResponseFailed: (state, action) => {
      state.loading = false
      state.error = action?.payload?.error || action?.error || 'Failed to edit ACRs configuration'
    },
  },
})

export const {
  getAcrsConfig,
  getAcrsResponse,
  getAcrsResponseFailed,
  editAcrs,
  editAcrsResponse,
  editAcrsResponseFailed,
} = acrSlice.actions

export const { actions, reducer, state } = acrSlice
reducerRegistry.register('acrReducer', reducer)
