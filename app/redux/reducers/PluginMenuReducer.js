/**
 * Plugin Reducers
 */
import {
	GET_ALL_PLUGIN_MENU,
	GET_ALL_PLUGIN_MENU_RESPONSE,
	  RESET,
	  SET_API_ERROR
} from '../actions/types'

/**
 * initial plugin state
 */
const INIT_STATE = {
		plugins: []
}

export default (state = INIT_STATE, action) => {
	  switch (action.type) {
	    case GET_ALL_PLUGIN_MENU:
	      return {
	        ...state,
	        loading: true
	      };
	    case GET_ALL_PLUGIN_MENU_RESPONSE:
		  localStorage.setItem(
			'plugins', JSON.stringify(action.payload.plugins),)
	      return {
	        ...state,
	        plugins: action.payload.plugins,
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