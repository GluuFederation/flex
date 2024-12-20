import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const initialState = {
  items: [],
  item: {},
  loading: false,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    toggleLoader: (state, action) => {
      state.loading = action.payload
    },
    handleUpdateSessionsResponse: (state, action) => {
      state.loading = false
      state.items = action.payload.data || []
    },
    handleRevokeSession: (state, action) => {
      state.loading = false
      state.items = state.items.filter(
        ({ userDn }) => userDn !== action.payload.data
      )
    },
    getSessions: (state) => {
      state.loading = true
    },

    searchSessions: (state) => {
      state.loading = true
    },
    revokeSession: (state) => {
      state.loading = true
    },
  },
})

export const {
  handleUpdateSessionsResponse,
  toggleLoader,
  handleRevokeSession,
  getSessions,
  revokeSession,
  searchSessions
} = sessionSlice.actions

export const { actions, reducer, state } = sessionSlice
reducerRegistry.register('sessionReducer', reducer)
