/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import authReducer from './AuthReducer';

const reducers = combineReducers({
  authReducer,
});

export default reducers;
