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
    getSmtps: (state) => {
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
    updateSmpt: (state, _action: PayloadAction<SmtpUpdatePayload>) => {
      state.loading = true
    },
    updateSmptResponse: (state, action: PayloadAction<SmtpResponsePayload>) => {
      state.loading = false
      if (action.payload?.data) {
        state.smtp = action.payload.data
      }
    },
    testSmtp: (state, _action: PayloadAction<SmtpTestPayload>) => {
      state.loading = true
    },
    testSmtpResponse: (state, action: PayloadAction<SmtpTestResponsePayload>) => {
      state.testStatus = action.payload.data || null
      state.loading = false
      state.openModal = true
    },
    testSmtpResponseFails: (state, _action: PayloadAction<void>) => {
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
  getSmtps,
  setSelectedSmptData,
  getSmptResponse,
  updateSmpt,
  updateSmptResponse,
  testSmtp,
  testSmtpResponse,
  testSmtpResponseFails,
  clearSmtpConfig,
} = smtpSlice.actions

export type { SmtpState }

export { initialState }
export default smtpSlice.reducer
reducerRegistry.register('smtpsReducer', smtpSlice.reducer)
