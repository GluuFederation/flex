import { USER_LOGGED_OUT } from '../actions/types';
import reducerRegistry from './ReducerRegistry';

const reducerName = 'logoutReducer';

const INIT_STATE = {};

export default function logoutReducer(state = INIT_STATE, action) {
  if (action.type === USER_LOGGED_OUT) {
    localStorage.clear();
  }
  return state;
}

reducerRegistry.register(reducerName, logoutReducer);