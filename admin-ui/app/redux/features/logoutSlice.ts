import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { STORAGE_KEYS, DEFAULT_LANG } from '@/constants'

const logoutSlice = createSlice({
  initialState: {},
  name: 'logout',
  reducers: {
    logoutUser: (_state) => {
      const userConfig = localStorage.getItem(STORAGE_KEYS.USER_CONFIG)
      localStorage.clear()
      localStorage.setItem(STORAGE_KEYS.INIT_THEME, DEFAULT_THEME)
      localStorage.setItem(STORAGE_KEYS.INIT_LANG, DEFAULT_LANG)

      if (userConfig && userConfig !== 'null') {
        localStorage.setItem(STORAGE_KEYS.USER_CONFIG, userConfig)
      }
    },
  },
})

export const { logoutUser } = logoutSlice.actions
export default logoutSlice.reducer
reducerRegistry.register('logoutReducer', logoutSlice.reducer)
