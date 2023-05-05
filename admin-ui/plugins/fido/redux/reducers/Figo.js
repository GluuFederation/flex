import {
  GET_FIDO_CONFIGURATION,
  PUT_FIDO_CONFIGURATION,
  GET_FIDO_CONFIGURATION_RESPONSE
} from '../actions/types'
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'

const INIT_STATE = {
  fido: {},
  loading:false
}
const reducerName = 'fidoReducer'

export default function fidoReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_FIDO_CONFIGURATION:
      return {
        ...state,
        loading: true
      }

    case PUT_FIDO_CONFIGURATION:
      return {
        ...state,
        loading: true,
      }
    case GET_FIDO_CONFIGURATION_RESPONSE:
      return {
        ...state,
        fido: action.payload ? action.payload : {},
        loading: false
      }

    default:
      return handleDefault()
  }

  function handleDefault() {
    return {
      ...state,
    }
  }
}
reducerRegistry.register(reducerName, fidoReducer)
