import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { InitState, SessionExpiredPayload } from './types'

const initialState: InitState = {
  isSessionExpired: false,
}

const initSlice = createSlice({
  name: 'init',
  initialState,
  reducers: {
    handleSessionExpired: (state, action: PayloadAction<SessionExpiredPayload>) => {
      state.isSessionExpired = action.payload.isSessionExpired
    },
  },
})

export const { handleSessionExpired } = initSlice.actions
export const { reducer } = initSlice
reducerRegistry.register('initReducer', reducer)
