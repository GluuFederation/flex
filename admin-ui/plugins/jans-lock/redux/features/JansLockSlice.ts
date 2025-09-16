import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { JansLockConfiguration, JansLockState } from '../../types/JansLockApiTypes'

const initialState: JansLockState = {
  configuration: {},
  loading: true,
}

const jansLockSlice = createSlice({
  name: 'jansLock',
  initialState,
  reducers: {
    getJansLockConfiguration: (state) => {
      state.loading = true
    },
    getJansLockConfigurationResponse: (state, action: PayloadAction<JansLockConfiguration>) => {
      state.configuration = action.payload ? action.payload : {}
      state.loading = false
    },
    putJansLockConfiguration: (state, _action: PayloadAction<{ action: unknown }>) => {
      state.loading = true
    },
  },
})

export const {
  getJansLockConfiguration,
  getJansLockConfigurationResponse,
  putJansLockConfiguration,
} = jansLockSlice.actions

export type { JansLockState, JansLockConfiguration }
export { initialState }
export default jansLockSlice.reducer

reducerRegistry.register('jansLockReducer', jansLockSlice.reducer)
