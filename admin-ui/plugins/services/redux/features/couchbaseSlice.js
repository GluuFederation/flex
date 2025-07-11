import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  couchbase: [],
  loading: false,
}

const couchbaseSlice = createSlice({
  name: 'couchbase',
  initialState,
  reducers: {
    getCouchBaseConfig: (state) => {
      state.loading = true
    },
    getCouchBaseResponse: (state, action) => {
      state.couchbase = action.payload?.data || {}
      state.loading = false
    },
    addCouchBase: (state) => {
      state.loading = true
    },
    addCouchBaseResponse: (state, action) => {
      state.couchbase = action.payload?.data || {}
      state.loading = false
    },
    editCouchBase: (state) => {
      state.loading = true
    },
    editCouchBaseResponse: (state, action) => {
      state.couchbase = action.payload?.data || {}
      state.loading = false
    },
  },
})

export const {
  getCouchBaseConfig,
  getCouchBaseResponse,
  addCouchBase,
  addCouchBaseResponse,
  editCouchBase,
  editCouchBaseResponse,
} = couchbaseSlice.actions
export const { actions, reducer } = couchbaseSlice
