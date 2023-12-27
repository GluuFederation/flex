import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  type: '',
  loading: false
}

const persistenceTypeSlice = createSlice({
  name: 'persistenceType',
  initialState,
  reducers: {
    getPersistenceType: (state) => {
      state.loading = true
    },
    getPersistenceTypeResponse: (state, action) => {
      state.type = action.payload?.data || ''
      state.loading = false
    }
  }
})

export const { getPersistenceType, getPersistenceTypeResponse } =
  persistenceTypeSlice.actions

export const { reducer, actions } = persistenceTypeSlice
