import {
  ADD_ATTRIBUTE,
  EDIT_ATTRIBUTE,
  DELETE_ATTRIBUTE,
  SHOW_ATTRIBUTES,
  SEARCH_ATTRIBUTES
} from "../actions/ActionType";
import getAttributeData from "../../data/attributes-data";

const attributesState = {
  data: getAttributeData()
};
const AttributeReducer = (state = attributesState, action) => {
  switch (action.type) {
    case ADD_ATTRIBUTE:
      return state.attributes.concat(action.payload.attribute);
    case EDIT_ATTRIBUTE:
      return state;
    case DELETE_ATTRIBUTE:
      return {
        ...state,
        data: state.data.filter(
          attribute => attribute.id !== action.attribute.id
        )
      };
    case SHOW_ATTRIBUTES:
      return state.attributes;
    case SEARCH_ATTRIBUTES:
      return state.attributes;
    default:
      return state;
  }
};

export default AttributeReducer;
