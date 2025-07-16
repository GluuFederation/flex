import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MauState {
  stat: any[]
  loading: boolean
  startMonth: string
  endMonth: string
}

interface MauRequestPayload {
  action?: {
    action_data?: {
      startMonth: string
      endMonth: string
    }
  }
}

interface MauResponsePayload {
  data?: any[]
}

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
