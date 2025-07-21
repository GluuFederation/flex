import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MauState, MauRequestPayload, MauResponsePayload } from './types'

const initialState: MauState = {
  stat: [],
  loading: false,
  startMonth: '',
  endMonth: '',
}

const mauSlice = createSlice({
  name: 'mau',
  initialState,
  reducers: {
    getMau: (state, action: PayloadAction<MauRequestPayload>) => {
      state.loading = true
      state.startMonth = action.payload?.action?.action_data?.startMonth || ''
      state.endMonth = action.payload?.action?.action_data?.endMonth || ''
    },
    getMauResponse: (state, action: PayloadAction<MauResponsePayload>) => {
      state.loading = false
      if (action.payload?.data) {
        state.stat = action.payload.data
      }
    },
  },
})

export const { getMau, getMauResponse } = mauSlice.actions
export const { actions, reducer } = mauSlice
reducerRegistry.register('mauReducer', reducer)
