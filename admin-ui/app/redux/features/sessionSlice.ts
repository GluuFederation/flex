import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

interface SessionState {
  landingPath: string | null
  logoutRequested: boolean
}

const initialState: SessionState = {
  landingPath: null,
  logoutRequested: false,
}

const auditLogoutLogs = createAction<{ message: string }>('session/auditLogoutLogs')

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setLandingPath: (state, action: PayloadAction<string | null>) => {
      state.landingPath = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(auditLogoutLogs, (state) => {
      state.logoutRequested = true
    })
  },
})

const { setLandingPath } = sessionSlice.actions

reducerRegistry.register('sessionReducer', sessionSlice.reducer)

export { auditLogoutLogs, setLandingPath }
export default sessionSlice.reducer
