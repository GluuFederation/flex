import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  jwks: {},
  loading: false,
}

const jwksSlice = createSlice({
  name: 'jwks',
  initialState,
  reducers: {
    getJwks: (state) => {
      state.loading = true
    },
    getJwksResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.jwks = action.payload.data
      }
    },
  },
})

export const { getJwks, getJwksResponse } = jwksSlice.actions
export const { actions, reducer, state } = jwksSlice
reducerRegistry.register('jwksReducer', reducer)
