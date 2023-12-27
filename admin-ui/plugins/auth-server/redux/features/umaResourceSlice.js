import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
}

const umaResourceSlice = createSlice({
  name: 'umaResource',
  initialState,
  reducers: {
    getUMAResourcesByClient: (state) => {
      state.loading = true
    },
    getUMAResourcesByClientResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = action.payload.data
      }
    },
    deleteUMAResource: (state) => {
      state.loading = true
    },
    deleteUMAResourceResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = state.items.filter(({ id }) => id !== action.payload.data)
      }
    },
    resetUMAResources: (state) => {
      state.items = initialState.items
      state.loading = initialState.loading
    },
  },
})

export const {
  getUMAResourcesByClient,
  getUMAResourcesByClientResponse,
  deleteUMAResource,
  deleteUMAResourceResponse,
  resetUMAResources,
} = umaResourceSlice.actions
export const { actions, reducer, state } = umaResourceSlice
reducerRegistry.register('UMAResourceReducer', reducer)
