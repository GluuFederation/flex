import {
  GET_ACRS,
  GET_ACRS_RESPONSE,
  PUT_ACRS,
  PUT_ACRS_RESPONSE,
} from '../actions/types'

const INIT_STATE = {
  acrs: {},
  scripts: [],
  loading: true,
  isSuccess: false,
  isError: false,
}

const reducerName = 'acrReducer'

export default function acrReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_ACRS:
      return {
        ...state,
        loading: true,
      }
    case GET_ACRS_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          acrs: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case PUT_ACRS:
      return {
        ...state,
        loading: true,
        isSuccess: false,
        isError: false,
      }
    case PUT_ACRS_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          acrs: action.payload.data,
          loading: false,
          isSuccess: true,
        }
      } else {
        return handleDefault({ isError: true, isSuccess: false })
      }
    default:
      return handleDefault()
  }

  function handleDefault(additionalParams) {
    return {
      ...state,
      ...additionalParams,
      loading: false,
    }
  }
}
