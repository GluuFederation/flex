import { createSlice } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const initialState = {
  showToast: false,
  message: '',
  type: 'success',
}

export const updateToast = (showToast = false, type = 'success', message = '') => ({
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
