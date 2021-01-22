/**
 * App Reducers
 */
import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import scopeReducer from "./ScopeReducer";
import attributeReducer from "./AttributeReducer";
import openidClientReducer from "./OpenidClientReducer";

const reducers = combineReducers({
  authReducer,
  scopeReducer,
  attributeReducer,
  openidClientReducer
});

export default reducers;
