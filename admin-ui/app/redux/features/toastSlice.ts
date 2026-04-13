import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

import type { ToastMessage, ToastState, ToastType, UpdateToastPayload } from '../types'

const initialState: ToastState = {
  showToast: false,
  message: '',
  type: 'success',
  onCloseRedirectUrl: '',
}

export const updateToast = (
  showToast = false,
  type: ToastType = 'success',
  message: ToastMessage = '',
  onCloseRedirectUrl: string = '',
) => ({
  type: 'toast/updateToast',
  payload: {
    showToast,
    message,
    type,
    onCloseRedirectUrl,
  },
})

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    updateToast: (state, action: { payload: UpdateToastPayload }) => {
      const { showToast, type, message, onCloseRedirectUrl = '' } = action.payload
      state.showToast = showToast
      state.type = type
      state.message = message
      state.onCloseRedirectUrl = onCloseRedirectUrl
    },
  },
})

export default toastSlice.reducer
reducerRegistry.register('toastReducer', toastSlice.reducer)
