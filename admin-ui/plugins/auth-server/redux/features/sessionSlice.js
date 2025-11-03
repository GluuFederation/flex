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
      if (state) {
        state.loading = action.payload
      }
    },
    handleUpdateSessionsResponse: (state, action) => {
      if (state) {
        state.loading = false
        state.items = action.payload.data || []
      }
    },
    handleRevokeSession: (state, action) => {
      if (state) {
        state.loading = false
        state.items = state.items.filter(({ userDn }) => userDn !== action.payload.data)
      }
    },
    handleDeleteSession: (state, action) => {
      if (state) {
        state.loading = false
        state.items = state.items.filter(
          ({ sessionAttributes }) => sessionAttributes?.sid !== action.payload.data,
        )
      }
    },
    getSessions: (state) => {
      if (state) {
        state.loading = true
      }
    },

    searchSessions: (state) => {
      if (state) {
        state.loading = true
      }
    },
    revokeSession: (state) => {
      if (state) {
        state.loading = true
      }
    },
    deleteSession: (state) => {
      if (state) {
        state.loading = true
      }
    },
  },
})

export const {
  handleUpdateSessionsResponse,
  toggleLoader,
  handleRevokeSession,
  handleDeleteSession,
  getSessions,
  revokeSession,
  deleteSession,
  searchSessions,
} = sessionSlice.actions

export const { actions, reducer, state } = sessionSlice
reducerRegistry.register('sessionReducer', reducer)
