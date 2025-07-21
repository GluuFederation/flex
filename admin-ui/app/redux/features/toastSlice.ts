import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import type { ToastState, ToastType } from './types/toastTypes'

const initialState: ToastState = {
  showToast: false,
  message: '',
  type: 'success',
}

export const updateToast = (showToast = false, type: ToastType = 'success', message = '') => ({
  type: 'toast/updateToast',
  payload: {
    showToast: showToast,
    message: message,
    type: type,
  },
})

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    updateToast: (state, action) => {
      const { showToast, type, message } = action.payload
      state.showToast = showToast
      state.type = type
      state.message = message
    },
  },
})

export default toastSlice.reducer
reducerRegistry.register('toastReducer', toastSlice.reducer)
