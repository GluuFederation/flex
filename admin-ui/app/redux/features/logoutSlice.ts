import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_THEME } from '@/context/theme/constants'

const logoutSlice = createSlice({
  initialState: {},
  name: 'logout',
  reducers: {
    logoutUser: (_state) => {
      const userConfig = localStorage.getItem('userConfig')
      localStorage.clear()
      localStorage.setItem('initTheme', DEFAULT_THEME)
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
