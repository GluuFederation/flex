import reducerRegistry from "../../../../app/redux/reducers/ReducerRegistry";
import {
  GET_CACHE_REFRESH_CONFIGURATION,
  GET_CACHE_REFRESH_CONFIGURATION_RESPONSE,
  PUT_CACHE_REFRESH_CONFIGURATION
} from "../actions/types";

const INIT_STATE = {
  configuration: {},
  loading: false,
};

export default function cacheRefreshReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_CACHE_REFRESH_CONFIGURATION:
      return {
        ...state,
        loading: true,
      };

    case GET_CACHE_REFRESH_CONFIGURATION_RESPONSE:
      return {
        ...state,
        configuration: action.payload ? action.payload : {},
        loading: false,
      };
    case PUT_CACHE_REFRESH_CONFIGURATION:
      return {
        ...state,
        loading: true
      }

    default:
      return handleDefault();
  }

  function handleDefault() {
    return {
      ...state,
    };
  }
}

reducerRegistry.register('cacheRefreshReducer', cacheRefreshReducer);
