import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import type { OidcState } from 'Redux/types/authServerPluginState'
import type { SetCurrentClientPayload, ViewOnlyPayload } from './types/oidcSlice'

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
      state.view = action.payload.view
    },
  },
})

export const { setCurrentItem, viewOnly } = oidcSlice.actions

export const { actions, reducer } = oidcSlice
reducerRegistry.register('oidcReducer', reducer)
