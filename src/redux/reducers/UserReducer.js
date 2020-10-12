import {
  ADD_USER,
  EDIT_USER,
  DELETE_USER,
  SHOW_USERS,
  SEARCH_USERS
} from "../actions/ActionType";
import getUserData from "../../data/users-data";

const usersState = {
  data: getUserData()
};
const UserReducer = (state = usersState, action) => {
  switch (action.type) {
    case ADD_USER:
      return state.users.concat(action.payload.user);
    case EDIT_USER:
      return state;
    case DELETE_USER:
      return {
        ...state,
        data: state.data.filter(user => user.id !== action.user.id)
      };
    case SHOW_USERS:
      return state.users;
    case SEARCH_USERS:
      return state.users;
    default:
      return state;
  }
};

export default UserReducer;
