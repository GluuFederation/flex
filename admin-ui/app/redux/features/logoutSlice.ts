import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'
import clearAppStorage from '@/utils/clearAppStorage'

const logoutSlice = createSlice({
  initialState: {},
  name: 'logout',
  reducers: {
    logoutUser: (_state) => {
      clearAppStorage()
    },
  },
})

export const { logoutUser } = logoutSlice.actions
export default logoutSlice.reducer
reducerRegistry.register('logoutReducer', logoutSlice.reducer)
