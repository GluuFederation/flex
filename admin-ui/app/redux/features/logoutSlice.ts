import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const logoutSlice = createSlice({
  initialState: {},
  name: 'logout',
  reducers: {
    logoutUser: (state, action) => {
      const userConfig = localStorage.getItem('userConfig')
      localStorage.clear()
      localStorage.setItem('initTheme', 'light')
      localStorage.setItem('initLang', 'en')

      if (userConfig && userConfig !== 'null') {
        localStorage.setItem('userConfig', userConfig)
      }
    },
  },
})

export const { logoutUser } = logoutSlice.actions
export default logoutSlice.reducer
reducerRegistry.register('logoutReducer', logoutSlice.reducer)
