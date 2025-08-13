import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import {
  SmtpState,
  SmtpResponsePayload,
  SmtpTestResponsePayload,
  SmtpTestPayload,
  SmtpUpdatePayload,
  SmtpConfiguration,
} from '../types/SmtpApi.type'

const initialState: SmtpState = {
  smtp: {},
  loading: true,
  testStatus: null,
  openModal: false,
}

const smtpSlice = createSlice({
  name: 'smtps',
  initialState,
  reducers: {
    getSmpts: (state, action: PayloadAction<void>) => {
      console.trace('getSmpts', action)
      state.smtp = {}
      state.loading = true
    },
    setSelectedSmptData: (state, action: PayloadAction<SmtpConfiguration>) => {
      state.smtp = action.payload
    },
    getSmptResponse: (state, action: PayloadAction<SmtpResponsePayload>) => {
      state.loading = false
      state.smtp = action.payload?.data || {}
    },
    updateSmpt: (state, action: PayloadAction<SmtpUpdatePayload>) => {
      console.trace('updateSmpt', action.payload.smtpConfiguration.host)
      state.loading = true
    },
    updateSmptResponse: (state, action: PayloadAction<SmtpResponsePayload>) => {
      state.loading = false
      if (action.payload?.data) {
        state.smtp = action.payload.data
      }
    },
    testSmtp: (state, action: PayloadAction<SmtpTestPayload>) => {
      console.trace('testSmtp', action.payload.payload.smtpTest?.message)
      state.loading = true
    },
    testSmtpResponse: (state, action: PayloadAction<SmtpTestResponsePayload>) => {
      state.testStatus = action.payload.data || null
      state.loading = false
      state.openModal = true
    },
    testSmtpResponseFails: (state, action: PayloadAction<void>) => {
      console.trace('testSmtpResponseFails', action)
      state.loading = false
      state.openModal = false
    },
    clearSmtpConfig: (state) => {
      state.openModal = false
      state.testStatus = null
    },
  },
})

export const {
  getSmpts,
  setSelectedSmptData,
  getSmptResponse,
  updateSmpt,
  updateSmptResponse,
  testSmtp,
  testSmtpResponse,
  testSmtpResponseFails,
  clearSmtpConfig,
} = smtpSlice.actions

// Export types for use in other files
export type { SmtpState }

export { initialState }
export default smtpSlice.reducer
reducerRegistry.register('smtpsReducer', smtpSlice.reducer)
