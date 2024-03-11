import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  configuration: {},
  loading: true,
  savedForm: false,
}

const jansKcLink = createSlice({
  name: 'jansKcLink',
  initialState: initialState,
  reducers: {
    getConfiguration: (state) => {
      state.loading = true
    },
    getConfigurationResponse: (state, action) => {
      state.configuration = action.payload ? action.payload : {}
      state.loading = false
    },
    putConfiguration: (state) => {
      state.loading = true
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    toggleSavedFormFlag: (state, action) => {
      state.savedForm = action.payload || false
    },
  },
})

export const {
  getConfiguration,
  getConfigurationResponse,
  putConfiguration,
  toggleSavedFormFlag,
  setLoading,
} = jansKcLink.actions

export default jansKcLink.reducer

reducerRegistry.register('jansKcLinkReducer', jansKcLink.reducer)
