import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sql: [],
  item: {},
  loading: false,
  testStatus: false,
}

const sqlSlice = createSlice({
  name: 'sql',
  initialState,
  reducers: {
    getSqlConfig: (state) => {
      state.loading = true
    },
    getSqlResponse: (state, action) => {
      state.sql = action.payload?.data || {}
      state.loading = false
    },
    addSql: (state) => {
      state.loading = true
    },
    addSqlResponse: (state, action) => {
      if (action.payload?.data) {
        state.sql = [...state.sql, action.payload.data]
      }
      state.loading = false
    },
    editSql: (state) => {
      state.loading = true
    },
    editSqlResponse: (state, action) => {
      state.sql = action.payload?.data || {}
      state.loading = false
    },
    deleteSql: (state) => {
      state.loading = true
    },
    deleteSqlResponse: (state, action) => {
      if (action.payload?.configId) {
        state.sql = state.sql.filter((i) => i.configId !== action.payload.configId)
      }
      state.loading = false
    },
    setCurrentItem: (state, action) => {
      state.item = action.payload?.item
      state.loading = false
    },
    testSql: (state) => {
      state.loading = true
    },
    testSqlResponse: (state, action) => {
      state.loading = false
    },
  },
})

export const {
  getSqlConfig,
  getSqlResponse,
  addSql,
  addSqlResponse,
  editSql,
  editSqlResponse,
  deleteSql,
  deleteSqlResponse,
  setCurrentItem,
  testSql,
  testSqlResponse,
} = sqlSlice.actions

export const { actions, reducer } = sqlSlice
