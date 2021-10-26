import {
  GET_SQL,
  GET_SQL_RESPONSE,
  SET_SQL,
  SET_SQL_RESPONSE,
  PUT_SQL,
  PUT_SQL_RESPONSE,
  DELETE_SQL,
  DELETE_SQL_RESPONSE,
  TEST_SQL,
  TEST_SQL_RESPONSE,
  ADD_SQL,
  ADD_SQL_RESPONSE,
} from './types'

export const getSqlConfig = () => ({
  type: GET_SQL,
})

export const getSqlResponse = (data) => ({
  type: GET_SQL_RESPONSE,
  payload: { data },
})
export const addSql = (data) => ({
  type: ADD_SQL,
  payload: { data },
})
export const addSqlResponse = (data) => ({
  type: ADD_SQL_RESPONSE,
  payload: { data },
})

export const editSql = (data) => ({
  type: PUT_SQL,
  payload: { data },
})
export const editSqlResponse = (data) => ({
  type: PUT_SQL_RESPONSE,
  payload: { data },
})
export const deleteSql = (configId) => ({
  type: DELETE_SQL,
  payload: { configId },
})

export const deleteSqlResponse = (configId) => ({
  type: DELETE_SQL_RESPONSE,
  payload: { configId },
})

export const setCurrentItem = (item) => ({
  type: SET_SQL,
  payload: { item },
})

export const testSql = (data) => ({
  type: TEST_SQL,
  payload: {data},
})

export const testSqlResponse = (data) => ({
  type: TEST_SQL_RESPONSE,
  payload: { data },
})

