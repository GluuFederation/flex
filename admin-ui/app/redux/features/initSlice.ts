import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  ActionDataPayload,
  ApiTimeoutPayload,
  InitState,
  ScriptsResponsePayload,
} from './types'

const initialState: InitState = {
  scripts: [],
  isTimeout: false,
}

const initSlice = createSlice({
  name: 'init',
  initialState,
  reducers: {
    getScripts: (_state, _action: PayloadAction<{ action?: ActionDataPayload }>) => {},
    getScriptsResponse: (state, action: PayloadAction<ScriptsResponsePayload>) => {
      if (action.payload?.data) {
        state.scripts = action.payload.data.entries || []
      }
    },
    handleApiTimeout: (state, action: PayloadAction<ApiTimeoutPayload>) => {
      state.isTimeout = action.payload.isTimeout
    },
  },
})

export const { getScripts, getScriptsResponse, handleApiTimeout } = initSlice.actions
export const { reducer } = initSlice
reducerRegistry.register('initReducer', reducer)
