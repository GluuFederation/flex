import {
  ADD_GROUP,
  EDIT_GROUP,
  DELETE_GROUP,
  SHOW_GROUPS,
  SEARCH_GROUPS
} from "../actions/ActionType";
import getGroupsData from "../../data/groups-data";

const groupsState = {
  data: getGroupsData()
};
const GroupReducer = (state = groupsState, action) => {
  switch (action.type) {
    case ADD_GROUP:
      return state.users.concat(action.payload.user);
    case EDIT_GROUP:
      return state;
    case DELETE_GROUP:
      return {
        ...state,
        data: state.data.filter(group => group.id !== action.group.id)
      };
    case SHOW_GROUPS:
      return state.users;
    case SEARCH_GROUPS:
      return state.users;
    default:
      return state;
  }
};

export default GroupReducer;
