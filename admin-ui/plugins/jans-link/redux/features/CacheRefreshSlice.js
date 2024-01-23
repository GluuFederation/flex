import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  configuration: {},
  loading: true,
  savedForm: false,
}

const cacheRefreshSlice = createSlice({
  name: 'cacheRefresh',
  initialState: initialState,
  reducers: {
    getCacheRefreshConfiguration: (state) => {
      state.loading = true
    },
    getCacheRefreshConfigurationResponse: (state, action) => {
      state.configuration = action.payload ? action.payload : {}
      state.loading = false
    },
    putCacheRefreshConfiguration: (state) => {
      state.loading = true
    },
    toggleSavedFormFlag: (state, action) => {
      state.savedForm = action.payload || false
    }
  }
})

export const {
  getCacheRefreshConfiguration,
  getCacheRefreshConfigurationResponse,
  putCacheRefreshConfiguration,
  toggleSavedFormFlag
} = cacheRefreshSlice.actions

export default cacheRefreshSlice.reducer

reducerRegistry.register('cacheRefreshReducer', cacheRefreshSlice.reducer);
