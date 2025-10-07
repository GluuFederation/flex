import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ScimActionPayload, SCIMConfig, ScimState } from '../types'

const initialState: ScimState = {
  scim: {} as Record<string, never>,
  loading: true,
}

const scimSlice = createSlice({
  name: 'scim',
  initialState,
  reducers: {
    getScimConfiguration: (state) => {
      state.loading = true
    },
    putScimConfiguration: (state, _action: PayloadAction<ScimActionPayload>) => {
      state.loading = true
    },
    getScimConfigurationResponse: (state, action: PayloadAction<SCIMConfig | null>) => {
      state.scim = action.payload ? action.payload : ({} as Record<string, never>)
      state.loading = false
    },
  },
})

export const { getScimConfiguration, putScimConfiguration, getScimConfigurationResponse } =
  scimSlice.actions
export const { actions, reducer } = scimSlice
export default scimSlice.reducer
reducerRegistry.register('scimReducer', reducer)
