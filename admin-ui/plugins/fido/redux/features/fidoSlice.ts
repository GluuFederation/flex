import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppConfiguration, DeleteFido2DeviceInput } from '../../types'

interface FidoState {
  fido: AppConfiguration
  loading: boolean
}

const initialState: FidoState = {
  fido: {},
  loading: false,
}

const fidoSlice = createSlice({
  name: 'fido2',
  initialState,
  reducers: {
    getFidoConfiguration: (state) => {
      state.loading = true
    },
    putFidoConfiguration: (state, _action: PayloadAction<AppConfiguration>) => {
      state.loading = true
    },
    getFidoConfigurationResponse: (state, action: PayloadAction<AppConfiguration>) => {
      state.fido = action.payload ? action.payload : {}
      state.loading = false
    },
    deleteFido2DeviceData: (state, _action: PayloadAction<DeleteFido2DeviceInput>) => {
      state.loading = true
    },
    deleteFido2DeviceDataResponse: (state, _action: PayloadAction<void>) => {
      state.loading = false
    },
  },
})

export const {
  getFidoConfiguration,
  putFidoConfiguration,
  getFidoConfigurationResponse,
  deleteFido2DeviceData,
  deleteFido2DeviceDataResponse,
} = fidoSlice.actions
export const { actions, reducer } = fidoSlice
reducerRegistry.register('fidoReducer', reducer)
