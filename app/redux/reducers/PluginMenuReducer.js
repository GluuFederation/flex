/**
 * Plugin Reducers
 */
import {
  GET_ALL_PLUGIN_MENU,
  GET_ALL_PLUGIN_MENU_RESPONSE,
  RESET,
} from '../actions/types'

/**
 * initial plugin state
 */
const INIT_STATE = {
  plugins: [],
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ALL_PLUGIN_MENU:
      return {
        ...state,
        loading: true,
      }
    case GET_ALL_PLUGIN_MENU_RESPONSE:
      return {
        ...state,
        plugins: action.payload.plugins,
        loading: false,
      }
    case RESET:
      return {
        ...state,
        items: INIT_STATE.items,
        loading: INIT_STATE.loading,
      }
    default:
      return {
        ...state,
      }
  }
}
