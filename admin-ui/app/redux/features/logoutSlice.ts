import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { STORAGE_KEYS, DEFAULT_LANG } from '@/constants'
import { storage } from '@/utils/storage'

const logoutSlice = createSlice({
  initialState: {},
  name: 'logout',
  reducers: {
    logoutUser: (_state) => {
      const userConfig = storage.get(STORAGE_KEYS.USER_CONFIG)
      storage.clear()
      storage.set(STORAGE_KEYS.INIT_THEME, DEFAULT_THEME)
      storage.set(STORAGE_KEYS.INIT_LANG, DEFAULT_LANG)

      if (userConfig && userConfig !== 'null') {
        storage.set(STORAGE_KEYS.USER_CONFIG, userConfig)
      }
    },
  },
})

export const { logoutUser } = logoutSlice.actions
export default logoutSlice.reducer
reducerRegistry.register('logoutReducer', logoutSlice.reducer)
