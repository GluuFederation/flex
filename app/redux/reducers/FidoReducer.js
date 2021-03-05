import {
  GET_FIDO,
  GET_FIDO_RESPONSE,
  PUT_FIDO,
  PUT_FIDO_RESPONSE,
  RESET,
} from '../actions/types'

const INIT_STATE = {
  fido: {},
  loading: false,
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_FIDO:
      return {
        ...state,
        loading: true,
      }
    case GET_FIDO_RESPONSE:
      //console.log('=Fido config: ' + JSON.stringify(action.payload.data))
      if (action.payload.data) {
        return {
          ...state,
          fido: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          fido: INIT_STATE.fido,
          loading: false,
        }
      }
    case PUT_FIDO:
      return {
        ...state,
        loading: true,
      }
    case PUT_FIDO_RESPONSE:
      return {
        ...state,
        fido: state.fido,
        loading: false,
      }

    case RESET:
      return {
        ...state,
        fido: INIT_STATE.fido,
        loading: INIT_STATE.loading,
      }
    default:
      return {
        ...state,
      }
  }
}
