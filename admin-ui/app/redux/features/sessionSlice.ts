import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

interface SessionState {
  logoutAuditInFlight: boolean
  logoutAuditSucceeded: boolean | null
  /** When true, session timeout dialog is open — do not call Cedarling WASM (tokens may be stale). */
  sessionTimeoutDialogOpen: boolean
}

const initialState: SessionState = {
  logoutAuditInFlight: false,
  logoutAuditSucceeded: null,
  sessionTimeoutDialogOpen: false,
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
    setSessionTimeoutDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.sessionTimeoutDialogOpen = action.payload
    },
  },
})

export const {
  auditLogoutLogs,
  auditLogoutLogsResponse,
  resetLogoutState,
  setSessionTimeoutDialogOpen,
} = sessionSlice.actions
export default sessionSlice.reducer
reducerRegistry.register('logoutAuditReducer', sessionSlice.reducer)
