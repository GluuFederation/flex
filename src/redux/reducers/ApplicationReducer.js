import { CHANGE_LANGUAGE } from "../actions/ActionType";

const appState = {
  pageSizeOptions: [5, 10, 15, 20, 25, 30],
  lang: "en"
};

const ApplicationReducer = (state = appState, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE:
        console.log("====================");
        console.log("============"+JSON.stringify(action.lang));
      return { ...state, lang: action.lang };
    default:
      return state;
  }
};

export default ApplicationReducer;
