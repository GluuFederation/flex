/**
 * App Reducers
 */
import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import scopeReducer from "./ScopeReducer";

const reducers = combineReducers({
  authReducer,
  scopeReducer
});

export default reducers;
