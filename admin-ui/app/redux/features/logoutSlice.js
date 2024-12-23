import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const logoutSlice = createSlice({
  initialState: {},
  name: 'logout',
  reducers: {
    logoutUser: (state, action) => {
      console.log('Inside logoutUser ...');
      const userConfig = localStorage.getItem('userConfig')
      localStorage.clear()
      sessionStorage.clear();
      localStorage.setItem('initTheme', 'darkBlack')
      localStorage.setItem('initLang', 'en')

      if (userConfig && userConfig !== 'null') {
        localStorage.setItem('userConfig', userConfig)
      }
    }
  }
})

export const { logoutUser } = logoutSlice.actions
export default logoutSlice.reducer
reducerRegistry.register('logoutReducer', logoutSlice.reducer)
