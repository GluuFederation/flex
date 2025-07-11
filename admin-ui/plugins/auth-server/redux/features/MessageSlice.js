import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  config: {},
  loading: true,
  savingConfig: false,
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    getConfigMessage: () => {},
    getMessageResponse: (state, action) => {
      if (action.payload?.data) {
        state.config = action.payload.data
      }
    },
    editMessageConfig: () => {},
    editMessageConfigResponse: (state, action) => {
      if (action.payload?.data) {
        state.config = action.payload.data
      }
    },
    putConfigMessagePostgres: (state) => {
      state.savingConfig = true
    },
    putConfigMessageRedis: (state) => {
      state.savingConfig = true
    },
    toggleMessageConfigLoader: (state, action) => {
      state.loading = action.payload
    },
    toggleSaveConfigLoader: (state, action) => {
      state.savingConfig = action.payload
    },
  },
})

export const {
  getConfigMessage,
  getMessageResponse,
  editMessageConfig,
  editMessageConfigResponse,
  putConfigMessagePostgres,
  putConfigMessageRedis,
  toggleMessageConfigLoader,
  toggleSaveConfigLoader,
} = messageSlice.actions

export const { actions, state } = messageSlice
export default messageSlice.reducer
reducerRegistry.register('messageReducer', messageSlice.reducer)
