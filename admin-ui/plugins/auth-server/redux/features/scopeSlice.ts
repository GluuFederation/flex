import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import type { ScopeItem } from 'Redux/types'

type ScopeSliceState = {
  selectedClientScopes: ScopeItem[]
}

const initialState: ScopeSliceState = {
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

export const { reducer } = scopeSlice
reducerRegistry.register('scopeReducer', reducer)
