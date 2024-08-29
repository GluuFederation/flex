import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  configuration: {},
  loading: true,
}

const jansLockSlice = createSlice({
  name: 'jansLock',
  initialState: initialState,
  reducers: {
    getJansLockConfiguration: (state) => {
      state.loading = true
    },
    getJansLockConfigurationResponse: (state, action) => {
      state.configuration = action.payload ? action.payload : {}
      state.loading = false
    },
    putJansLockConfiguration: (state) => {
      state.loading = true
    },
  },
})

export const {
  getJansLockConfiguration,
  getJansLockConfigurationResponse,
  putJansLockConfiguration,
} = jansLockSlice.actions

export default jansLockSlice.reducer

reducerRegistry.register('jansLockReducer', jansLockSlice.reducer)
