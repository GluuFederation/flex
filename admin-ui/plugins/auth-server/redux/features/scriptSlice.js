import reducerRegistry from 'Redux/reducers/ReducerRegistry'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  scripts: [],
  script: {},
  loading: false,
  scriptTypes: [],
}

const scriptSlice = createSlice({
  name: 'scripts',
  initialState,
  reducers: {
    getScripts: (state) => {
      state.loading = true
    },
    getScriptsResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.scripts = action.payload.data.entries || action.payload.data || []
      } else {
        state.scripts = []
      }
    },
    getScriptsByType: (state) => {
      state.loading = true
    },
    getScriptsByTypeResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.scripts = action.payload.data.entries || action.payload.data || []
      } else {
        state.scripts = []
      }
    },
    getScript: (state) => {
      state.loading = true
    },
    getScriptResponse: (state, action) => {
      state.loading = false
      if (action.payload?.data) {
        state.script = action.payload.data
      } else {
        state.script = {}
      }
    },
  },
})

export const {
  getScripts,
  getScriptsResponse,
  getScriptsByType,
  getScriptsByTypeResponse,
  getScript,
  getScriptResponse,
} = scriptSlice.actions

export const { actions, reducer } = scriptSlice
reducerRegistry.register('scriptReducer', reducer)
