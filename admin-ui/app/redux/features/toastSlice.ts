import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const initialState = {
  showToast: false,
  message: '',
  type: 'success',
  onCloseRedirectUrl: '',
}

export const updateToast = (
  showToast = false,
  type = 'success',
  message = '',
  onCloseRedirectUrl = '',
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
    updateToast: (state, action) => {
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
