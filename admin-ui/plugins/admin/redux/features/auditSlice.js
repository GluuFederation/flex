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
      console.log('Audit logs fetched successfully', action.payload)
      state.audits = action.payload?.data || []
    },
  },
})

export const { getAuditLogs, getAuditLogsResponse } = auditSlice.actions
export const { actions, reducer, state } = auditSlice
reducerRegistry.register('auditReducer', reducer)
