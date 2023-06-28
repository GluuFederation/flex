import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const initialState = {
  items: [],
  loading: false,
  savedConfig: false,
}

const ssaSlice = createSlice({
  name: 'ssa',
  initialState,
  reducers: {
    getSsaConfig: (state) => {
      state.loading = true
    },
    getSsaConfigResponse: (state, action) => {
      state.items = action.payload
      state.loading = false
    },
    createSsa: (state) => {
      state.loading = true
    },
    toggleSaveConfig: (state, action) => {
      state.savedConfig = action.payload
    },
    removeSsa: (state) => {
      state.loading = true
    },
  },
})

export const {
  getSsaConfig,
  getSsaConfigResponse,
  createSsa,
  toggleSaveConfig,
  removeSsa,
} = ssaSlice.actions

export default ssaSlice.reducer
reducerRegistry.register('ssaReducer', ssaSlice.reducer)
