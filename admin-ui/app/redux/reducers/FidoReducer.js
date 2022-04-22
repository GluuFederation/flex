import {
  GET_FIDO,
  GET_FIDO_RESPONSE,
  PUT_FIDO,
  PUT_FIDO_RESPONSE,
  RESET,
} from '../actions/types';
import reducerRegistry from './ReducerRegistry';
const INIT_STATE = {
  fido: { fido2Configuration: {} },
  loading: false,
};

const reducerName = 'fidoReducer';

export default function fidoReducer(state = INIT_STATE, action) {
  switch (action.type) {
  case GET_FIDO:
    return handleLoading();
  case GET_FIDO_RESPONSE:
    if (action.payload.data) {
      return {
        ...state,
        fido: action.payload.data,
        loading: false,
      };
    } else {
      return handleDefault();
    }
  case PUT_FIDO:
    return handleLoading();
  case PUT_FIDO_RESPONSE:
    if (action.payload.data) {
      return {
        ...state,
        fido: action.payload.data,
        loading: false,
      };
    } else {
      return handleDefault();
    }

  case RESET:
    return {
      ...state,
      fido: INIT_STATE.fido,
      loading: INIT_STATE.loading,
    };
  default:
    return handleDefault();
  }

  function handleLoading() {
    return {
      ...state,
      loading: true,
    };
  }

  function handleDefault() {
    return {
      ...state,
      loading: false,
    };
  }
}

reducerRegistry.register(reducerName, fidoReducer);
