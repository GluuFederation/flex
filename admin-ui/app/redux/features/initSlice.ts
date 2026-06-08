import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ApiTimeoutPayload, InitState } from './types'

const initialState: InitState = {
  isTimeout: false,
}

const initSlice = createSlice({
  name: 'init',
  initialState,
  reducers: {
    handleApiTimeout: (state, action: PayloadAction<ApiTimeoutPayload>) => {
      state.isTimeout = action.payload.isTimeout
    },
  },
})

export const { handleApiTimeout } = initSlice.actions
export const { reducer } = initSlice
reducerRegistry.register('initReducer', reducer)
