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
    removeSsaResponse: (state) => {
      state.loading = false
    },
  },
})

export const {
  getSsaConfig,
  getSsaConfigResponse,
  createSsa,
  toggleSaveConfig,
  removeSsa,
  removeSsaResponse,
} = ssaSlice.actions

export default ssaSlice.reducer
export { initialState }
reducerRegistry.register('ssaReducer', ssaSlice.reducer)
