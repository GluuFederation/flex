import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

type HealthStatus = 'Running' | 'Not present' | 'Down'

export type HealthServiceKey =
  | 'jans-lock'
  | 'jans-auth'
  | 'jans-config-api'
  | 'jans-casa'
  | 'jans-fido2'
  | 'jans-scim'
  | 'jans-link'
  | 'keycloak'

type KnownHealthServices = Partial<Record<HealthServiceKey, HealthStatus>>

export type HealthStatusResponse = KnownHealthServices & {
  [serviceName: string]: HealthStatus
}

export interface HealthState {
  serverStatus: HealthStatus | null
  dbStatus: HealthStatus | null
  health: HealthStatusResponse
  loading: boolean
}

const initialState: HealthState = {
  serverStatus: null,
  dbStatus: null,
  health: {},
  loading: false,
}

interface HealthStatusResponsePayload {
  data?: {
    status?: HealthStatus
    db_status?: HealthStatus
  }
}

interface HealthServerStatusResponsePayload {
  data?: HealthStatusResponse
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
