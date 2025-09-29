import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppConfiguration, DeleteFido2DeviceInput, FidoState, ApiError } from '../../types'

const initialState: FidoState = {
  fido: {},
  loading: false,
  error: null,
}

const fidoSlice = createSlice({
  name: 'fido2',
  initialState,
  reducers: {
    getFidoConfiguration: (state) => {
      state.loading = true
      state.error = null
    },
    putFidoConfiguration: (state, _action: PayloadAction<AppConfiguration>) => {
      state.loading = true
      state.error = null
    },
    putFidoConfigurationFailed: (state, action: PayloadAction<ApiError>) => {
      state.loading = false
      state.error = action.payload
    },
    getFidoConfigurationResponse: (state, action: PayloadAction<AppConfiguration>) => {
      state.fido = action.payload
      state.loading = false
      state.error = null
    },
    getFidoConfigurationFailed: (state, action: PayloadAction<ApiError>) => {
      state.loading = false
      state.error = action.payload
    },
    deleteFido2DeviceData: (state, _action: PayloadAction<DeleteFido2DeviceInput>) => {
      state.loading = true
      state.error = null
    },
    deleteFido2DeviceDataResponse: (state, _action: PayloadAction<void>) => {
      state.loading = false
      state.error = null
    },
    deleteFido2DeviceDataFailed: (state, action: PayloadAction<ApiError>) => {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const {
  getFidoConfiguration,
  putFidoConfiguration,
  getFidoConfigurationResponse,
  getFidoConfigurationFailed,
  putFidoConfigurationFailed,
  deleteFido2DeviceData,
  deleteFido2DeviceDataResponse,
  deleteFido2DeviceDataFailed,
} = fidoSlice.actions
export const { actions, reducer } = fidoSlice
reducerRegistry.register('fidoReducer', reducer)
