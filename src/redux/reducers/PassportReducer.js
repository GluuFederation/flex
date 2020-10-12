import {
  ADD_PROVIDER,
  EDIT_PROVIDER,
  DELETE_PROVIDER,
  SHOW_PROVIDERS,
  SEARCH_PROVIDERS
} from "../actions/ActionType";
import getPassportData from "../../data/passport-data";

const usersState = {
  data: getPassportData()
};
const PassportReducer = (state = usersState, action) => {
  switch (action.type) {
    case ADD_PROVIDER:
      return state.providers.concat(action.payload.provider);
    case EDIT_PROVIDER:
      return state;
    case DELETE_PROVIDER:
      return {
        ...state,
        data: state.data.filter(provider => provider.id !== action.provider.id)
      };
    case SHOW_PROVIDERS:
      return state.providers;
    case SEARCH_PROVIDERS:
      return state.providers;
    default:
      return state;
  }
};

export default PassportReducer;
