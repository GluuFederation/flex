import { GET_LICENSE_DETAILS, GET_LICENSE_DETAILS_RESPONSE, UPDATE_LICENSE_DETAILS, UPDATE_LICENSE_DETAILS_RESPONSE } from '../actions/types'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
const INIT_STATE = {
  item: {},
  loading: true,
}

const reducerName = 'licenseDetailsReducer'

export default function licenseDetailsReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_LICENSE_DETAILS:
      return {
        ...state,
        loading: true,
      }
    case GET_LICENSE_DETAILS_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          item: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }
    case UPDATE_LICENSE_DETAILS:
      return {
        ...state,
        loading: true,
      }
    case UPDATE_LICENSE_DETAILS_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }
    default:
      return {
        ...state,
      }
  }
}
reducerRegistry.register(reducerName, licenseDetailsReducer)
