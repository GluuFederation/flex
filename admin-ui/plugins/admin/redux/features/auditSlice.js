import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  audits: [],
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
      state.audits = action.payload?.data || []
    },
  },
})
reducerRegistry.register('auditReducer', auditSlice.reducer)

export const { getAuditLogs, getAuditLogsResponse } = auditSlice.actions
export default auditSlice.reducer
