import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

interface SessionState {
  logoutAuditSucceeded: boolean | null
}

const initialState: SessionState = {
  logoutAuditSucceeded: null,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    auditLogoutLogs: (state, _action: PayloadAction<{ message: string }>) => {
      state.logoutAuditSucceeded = null
    },
    auditLogoutLogsResponse: (state, action: PayloadAction<boolean>) => {
      state.logoutAuditSucceeded = action.payload
    },
  },
})

export const { auditLogoutLogs, auditLogoutLogsResponse } = sessionSlice.actions
export default sessionSlice.reducer
reducerRegistry.register('logoutAuditReducer', sessionSlice.reducer)
