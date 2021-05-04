import {
  GET_ACR_AUTH_SCRIPT,
  GET_ACR_AUTH_SCRIPT_RESPONSE,
} from '../actions/types'
import reducerRegistry from './ReducerRegistry';
const INIT_STATE = {
  scripts: [],
}

const reducerName = 'initReducer';

export default function initReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_ACR_AUTH_SCRIPT:
      return {
        ...state,
      }
    case GET_ACR_AUTH_SCRIPT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          scripts: action.payload.data,
        }
      } else {
        return {
          ...state,
        }
      }

    default:
      return {
        ...state,
      }
  }
}
reducerRegistry.register(reducerName, initReducer);