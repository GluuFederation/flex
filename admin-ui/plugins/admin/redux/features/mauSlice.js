import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  stat: [],
  loading: false,
  startMonth: '',
  endMonth: '',
}

const mauSlice = createSlice({
  name: 'mau',
  initialState,
  reducers: {
    getMau: (state, action) => {
      state.loading = true
      state.startMonth = action.payload?.action?.action_data?.startMonth
      state.endMonth = action.payload?.action?.action_data?.endMonth
    },
    getMauResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.stat = action.payload.data
      }
    },
  },
})

export const { getMau, getMauResponse } = mauSlice.actions
export const { actions, reducer, state } = mauSlice
reducerRegistry.register('mauReducer', reducer)
