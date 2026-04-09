import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import type { OidcState } from 'Redux/types'
import type { SetCurrentClientPayload, ViewOnlyPayload } from './types'

const initialState: OidcState = {
  item: {},
  view: false,
}

const oidcSlice = createSlice({
  name: 'oidc',
  initialState,
  reducers: {
    setCurrentItem: (state, action: PayloadAction<SetCurrentClientPayload>) => {
      state.item = action.payload?.item ?? {}
    },
    viewOnly: (state, action: PayloadAction<ViewOnlyPayload>) => {
      const payload = action.payload
      if (payload && typeof payload === 'object') {
        state.view = payload.view
      }
    },
  },
})

export const { setCurrentItem, viewOnly } = oidcSlice.actions

export const { actions, reducer } = oidcSlice
reducerRegistry.register('oidcReducer', reducer)
