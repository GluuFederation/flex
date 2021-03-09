/**
 * HealthCheck Reducers
 */
import {
	GET_HEALTH_CHECK,
	GET_HEALTH_CHECK_RESPONSE,
	RESET,
	SET_API_ERROR
} from '../types'

/**
 * initial plugin state
 */
const INIT_STATE = {
		components: []
}

export default (state = INIT_STATE, action) => {
	  switch (action.type) {
	    case GET_HEALTH_CHECK:
	      return {
	        ...state,
	        loading: true
	      };
	    case GET_HEALTH_CHECK_RESPONSE:
	      return {
	        ...state,
	        components: action.payload.components,
	        loading: false,
	        hasApiError: false
	      };
	    case SET_API_ERROR:
	      return { ...state, loading: false, hasApiError: true };
	    case RESET:
	      return {
	        ...state,
	        items: INIT_STATE.items,
	        loading: INIT_STATE.loading,
	        hasApiError: INIT_STATE.hasApiError
	      };
	    default:
	      return {
	        ...state
	      };
	  }
	};