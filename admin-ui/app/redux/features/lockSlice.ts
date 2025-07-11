import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const initialState = {
  lockDetail: {},
  loading: false,
}

const lockSlice = createSlice({
  name: 'lock',
  initialState,
  reducers: {
    getLockStatus: (state) => {
      state.loading = true
    },
    getLockStatusResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.lockDetail = action.payload.data
      }
    },
  },
})

export const { getLockStatus, getLockStatusResponse } = lockSlice.actions

export default lockSlice.reducer
reducerRegistry.register('lockReducer', lockSlice.reducer)
