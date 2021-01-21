/**
 * App Reducers
 */
import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import scopeReducer from "./ScopeReducer";
import attributeReducer from "./AttributeReducer";

const reducers = combineReducers({
  authReducer,
  scopeReducer,
  attributeReducer
});

export default reducers;
