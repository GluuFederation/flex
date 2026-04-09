import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import type { UmaResourceState } from 'Redux/types'
import type {
  DeleteUMAResourcePayload,
  DeleteUMAResourceResponsePayload,
  GetUMAResourcesByClientPayload,
  GetUMAResourcesByClientResponsePayload,
} from './types'

const initialState: UmaResourceState = {
  items: [],
  loading: false,
}

const umaResourceSlice = createSlice({
  name: 'umaResource',
  initialState,
  reducers: {
    getUMAResourcesByClient: (state, _action: PayloadAction<GetUMAResourcesByClientPayload>) => {
      state.loading = true
    },
    getUMAResourcesByClientResponse: (
      state,
      action: PayloadAction<GetUMAResourcesByClientResponsePayload>,
    ) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = action.payload.data
      }
    },
    deleteUMAResource: (state, _action: PayloadAction<DeleteUMAResourcePayload>) => {
      state.loading = true
    },
    deleteUMAResourceResponse: (state, action: PayloadAction<DeleteUMAResourceResponsePayload>) => {
      state.loading = false
      if (action.payload?.data) {
        state.items = state.items.filter(({ id }) => id !== action.payload?.data)
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

export const { actions, reducer } = umaResourceSlice
reducerRegistry.register('umaResourceReducer', reducer)
