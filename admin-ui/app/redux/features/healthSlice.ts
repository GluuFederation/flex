import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import type {
  HealthServerStatusResponsePayload,
  HealthServiceKey,
  HealthState,
  HealthStatusResponse,
  HealthStatusResponsePayload,
} from './types'

export type { HealthServiceKey, HealthStatusResponse, HealthState }

const initialState: HealthState = {
  serverStatus: null,
  dbStatus: null,
  health: {},
  loading: false,
}

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    getHealthStatus: (state) => {
      state.loading = true
    },
    getHealthServerStatus: (state) => {
      state.loading = true
    },
    getHealthStatusResponse: (state, action: PayloadAction<HealthStatusResponsePayload | null>) => {
      state.loading = false
      if (action.payload?.data) {
        if (action.payload.data.status) {
          state.serverStatus = action.payload.data.status
        }
        if (action.payload.data.db_status) {
          state.dbStatus = action.payload.data.db_status
        }
      }
    },
    getHealthServerStatusResponse: (
      state,
      action: PayloadAction<HealthServerStatusResponsePayload | null>,
    ) => {
      state.loading = false
      if (action.payload?.data) {
        state.health = action.payload.data
      }
    },
  },
})

export const {
  getHealthStatus,
  getHealthStatusResponse,
  getHealthServerStatus,
  getHealthServerStatusResponse,
} = healthSlice.actions

export default healthSlice.reducer
reducerRegistry.register('healthReducer', healthSlice.reducer)
