import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import type { ScopeItem } from 'Redux/types'

export type ScopeSliceState = {
  selectedClientScopes: ScopeItem[]
}

export const initialState: ScopeSliceState = {
  selectedClientScopes: [],
}

const scopeSlice = createSlice({
  name: 'scope',
  initialState,
  reducers: {
    setClientSelectedScopes: (state, action: PayloadAction<ScopeItem[]>) => {
      state.selectedClientScopes = action.payload
    },
  },
})

export const { setClientSelectedScopes } = scopeSlice.actions

export const { actions, reducer } = scopeSlice
reducerRegistry.register('scopeReducer', reducer)
