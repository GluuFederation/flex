import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  audits: [],
  entries: [],
  totalEntriesCount: 0,
  entriesCount: 0,
  start: 0,
  loading: false,
}

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    getAuditLogs: (state) => {
      state.loading = true
    },
    getAuditLogsResponse: (state, action) => {
      state.loading = false
      const responseData = action.payload?.data || {}

      // Handle both data structures
      if (responseData.entries) {
        state.entries = responseData.entries
        state.totalEntriesCount = responseData.totalEntriesCount || 0
        state.entriesCount = responseData.entriesCount || 0
        state.start = responseData.start || 0
        state.audits = responseData.entries // Keep backward compatibility
      } else if (Array.isArray(responseData)) {
        state.audits = responseData
        state.entries = responseData
      } else {
        state.audits = []
        state.entries = []
      }
    },
    failedAuditLogsResponse: (state) => {
      state.loading = false
      state.audits = []
      state.entries = []
      state.totalEntriesCount = 0
      state.entriesCount = 0
      state.start = 0
    },
  },
})
reducerRegistry.register('auditReducer', auditSlice.reducer)

export const { getAuditLogs, getAuditLogsResponse, failedAuditLogsResponse } = auditSlice.actions
export default auditSlice.reducer
