import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const initialState = {
  smtp: {},
  loading: true,
  testStatus: null,
  openModal: false,
}

const smtpSlice = createSlice({
  name: 'smtps',
  initialState,
  reducers: {
    getSmpts: (state, action) => {
      state.loading = true
    },
    setSelectedSmptData: (state, action) => {},
    getSmptResponse: (state, action) => {
      state.loading = false
      state.smtp = action.payload?.data || {}
    },
    updateSmpt: (state, action) => {
      state.loading = true
    },
    updateSmptResponse: (state, action) => {
      state.loading = false
    },
    testSmtp: (state, action) => {
      state.loading = true
    },
    testSmtpResponse: (state, action) => {
      state.testStatus = action.payload.data || null
      state.loading = false
      state.openModal = true
    },
    testSmtpResponseFails: (state) => {
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
export { initialState }
export default smtpSlice.reducer
reducerRegistry.register('smtpsReducer', smtpSlice.reducer)
