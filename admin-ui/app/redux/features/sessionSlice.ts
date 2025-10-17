/**
 * Session management slice for handling logout audit logging
 * This is separate from user management to avoid tight coupling
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

interface SessionState {
  isUserLogout: boolean
}

const initialState: SessionState = {
  isUserLogout: false,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    auditLogoutLogs: (state, action: PayloadAction<{ message: string }>) => {
      console.log('Logout audit:', action.payload.message)
      state.isUserLogout = true
      // This action is handled by saga for actual audit logging
    },
    auditLogoutLogsResponse: (state, action: PayloadAction<boolean>) => {
      state.isUserLogout = action.payload
    },
    resetLogoutState: (state) => {
      state.isUserLogout = false
    },
  },
})

export const { auditLogoutLogs, auditLogoutLogsResponse, resetLogoutState } = sessionSlice.actions
export default sessionSlice.reducer
reducerRegistry.register('logoutAuditReducer', sessionSlice.reducer)
