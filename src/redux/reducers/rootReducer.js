import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import GroupReducer from "./GroupReducer";
import ApplicationReducer from "./ApplicationReducer";
import AttributeReducer from "./AttributeReducer";
import PassportReducer from "./PassportReducer";
import ClientReducer from "./ClientReducer";

const rootReducer = combineReducers({
  users: UserReducer,
  groups: GroupReducer,
  attributes: AttributeReducer,
  providers: PassportReducer,
  clients: ClientReducer,
  application: ApplicationReducer
});

export default rootReducer;
