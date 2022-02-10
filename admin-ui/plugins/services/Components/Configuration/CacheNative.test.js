import React from "react";
import { render, screen } from "@testing-library/react";
import CacheNative from "./CacheNative";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import i18n from "../../../../app/i18n";
import { I18nextProvider } from "react-i18next";

const permissions = [
  "https://jans.io/oauth/config/attributes.readonly",
  "https://jans.io/oauth/config/attributes.write",
  "https://jans.io/oauth/config/attributes.delete",
];
const INIT_STATE = {
  permissions: permissions,
};
const INIT_OIDC_STATE = {
  loading: false,
};
const store = createStore(
  combineReducers({
    authReducer: (state = INIT_STATE) => state,
    oidcReducer: (state = INIT_OIDC_STATE) => state,
    noReducer: (state = {}) => state,
  })
);

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>{children}</Provider>
  </I18nextProvider>
);

it("Cache native persistence page render", () => {
  const config = {
    defaultCleanupBatchSize: 10000,
    defaultPutExpiration: 60,
    deleteExpiredOnGetRequest: false,
  };
  render(<CacheNative config={config} formik={(t) => console.log(t)} />, {
    wrapper: Wrapper,
  });
  expect(screen.getByTestId("nativeDefaultPutExpiration")).toBeInTheDocument();
  expect(screen.getByTestId("defaultCleanupBatchSize")).toBeInTheDocument();
});
