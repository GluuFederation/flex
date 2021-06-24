import {
  GET_SQL,
  GET_SQL_RESPONSE,
  SET_SQL,
  SET_SQL_RESPONSE,
  PUT_SQL,
  PUT_SQL_RESPONSE,
  RESET,
} from '../actions/types'

const INIT_STATE = {
  sql: [],
  loading: false,
}

const reducerName = 'sqlReducer';

export default function sqlReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_SQL:
      return {
        ...state,
        loading: true,
      }
    case GET_SQL_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          SQL: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case SET_SQL:
      return {
        ...state,
        loading: true,
      }
    case SET_SQL_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          sql: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case PUT_SQL:
      return {
        ...state,
        loading: true,
      }
    case PUT_SQL_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          sql: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }
    case RESET:
      return {
        ...state,
        sql: INIT_STATE.sql,
        loading: INIT_STATE.loading,
      }
    default:
      return {
        ...state,
      }
  }
}
