import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

interface SessionState {
  logoutAuditInFlight: boolean
  logoutAuditSucceeded: boolean | null
}

const initialState: SessionState = {
  logoutAuditInFlight: false,
  logoutAuditSucceeded: null,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    auditLogoutLogs: (state, _action: PayloadAction<{ message: string }>) => {
      state.logoutAuditInFlight = true
      state.logoutAuditSucceeded = null
    },
    auditLogoutLogsResponse: (state, action: PayloadAction<boolean>) => {
      state.logoutAuditInFlight = false
      state.logoutAuditSucceeded = action.payload
    },
    resetLogoutState: (state) => {
      state.logoutAuditInFlight = false
      state.logoutAuditSucceeded = null
    },
  },
})

export const { auditLogoutLogs, auditLogoutLogsResponse, resetLogoutState } = sessionSlice.actions
export default sessionSlice.reducer
reducerRegistry.register('logoutAuditReducer', sessionSlice.reducer)
