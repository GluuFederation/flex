import {
  GET_OIDC_DISCOVERY,
  GET_OIDC_DISCOVERY_RESPONSE,
} from '../actions/types';
import reducerRegistry from './ReducerRegistry';

const INIT_STATE = {
  configuration: {},
  loading: false,
};

const reducerName = 'oidcDiscoveryReducer';

export default function oidcDiscoveryReducer(state = INIT_STATE, action) {
  switch (action.type) {
  case GET_OIDC_DISCOVERY:
    return {
      ...state,
      loading: false,
    };
  case GET_OIDC_DISCOVERY_RESPONSE:
    if (action.payload.configuration) {
      return {
        ...state,
        configuration: action.payload.configuration,
        loading: true,
      };
    } else {
      return {
        ...state,
      };
    }

  default:
    return {
      ...state,
    };
  }
}
reducerRegistry.register(reducerName, oidcDiscoveryReducer);
