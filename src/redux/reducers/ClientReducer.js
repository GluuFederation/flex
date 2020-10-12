import {
  ADD_CLIENT,
  EDIT_CLIENT,
  DELETE_CLIENT,
  SHOW_CLIENTS,
  SEARCH_CLIENTS
} from "../actions/ActionType";
import getClientsData from "../../data/clients-data";

const clientsState = {
  data: getClientsData()
};
const ClientReducer = (state = clientsState, action) => {
  switch (action.type) {
    case ADD_CLIENT:
      return state.users.concat(action.payload.client);
    case EDIT_CLIENT:
      return state;
    case DELETE_CLIENT:
      return {
        ...state,
        data: state.data.filter(client => client.id !== action.client.id)
      };
    case SHOW_CLIENTS:
      return state.clients;
    case SEARCH_CLIENTS:
      return state.clients;
    default:
      return state;
  }
};

export default ClientReducer;
