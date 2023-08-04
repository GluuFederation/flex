import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  agamaList: [],
  loading: false,
  totalItems: 0,
  entriesCount: 0
}

const agamaSlice = createSlice({
  name: 'agama',
  initialState,
  reducers: {
    getAgama: (state) => {
      state.loading = true
    },
    getAgamaResponse: (state, action) => {
      state.loading = false
      if (action.payload) {
        state.totalItems = action.payload.totalEntriesCount || 0
        state.entriesCount = action.payload.entriesCount || 0
        state.agamaList = action.payload.entries || []
      }
    },
    deleteAgama: (state) => {
      state.loading = true
    },
    addAgama: (state) => {
      state.loading = true
    },
    getAddAgamaResponse: (state) => {
      state.loading = false
    }
  }
})

export const {
  getAgama,
  getAgamaResponse,
  deleteAgama,
  addAgama,
  getAddAgamaResponse
} = agamaSlice.actions
export const { actions, reducer, state } = agamaSlice
reducerRegistry.register('agamaReducer', reducer)
