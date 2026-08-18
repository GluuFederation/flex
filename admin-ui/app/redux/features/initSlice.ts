import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ApiTimeoutPayload, InitState, SessionExpiredPayload } from './types'

const initialState: InitState = {
  isTimeout: false,
  isSessionExpired: false,
}

const initSlice = createSlice({
  name: 'init',
  initialState,
  reducers: {
    handleApiTimeout: (state, action: PayloadAction<ApiTimeoutPayload>) => {
      state.isTimeout = action.payload.isTimeout
    },
    // A dead session is not a slow server: the remedy is signing in again, not retrying, so it
    // carries its own flag and message rather than borrowing the request-timeout ones.
    handleSessionExpired: (state, action: PayloadAction<SessionExpiredPayload>) => {
      state.isSessionExpired = action.payload.isSessionExpired
    },
  },
})

export const { handleApiTimeout, handleSessionExpired } = initSlice.actions
export const { reducer } = initSlice
reducerRegistry.register('initReducer', reducer)
