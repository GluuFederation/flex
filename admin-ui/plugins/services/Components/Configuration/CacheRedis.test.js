import React from "react";
import { render, screen } from "@testing-library/react";
import CacheRedis from "./CacheRedis";
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

it("Cache redis page render", () => {
  const config = {
    connectionTimeout: 3000,
    defaultPutExpiration: 60,
    maxIdleConnections: 10,
    maxRetryAttempts: 5,
    maxTotalConnections: 500,
    redisProviderType: "STANDALONE",
    servers: "localhost:6379",
    soTimeout: 3000,
    useSSL: false,
  };
  render(<CacheRedis config={config} formik={(t) => console.log(t)} />, {
    wrapper: Wrapper,
  });
  expect(screen.getByTestId("password")).toBeInTheDocument();
  expect(screen.getByTestId("sentinelMasterGroupName")).toBeInTheDocument();
  expect(screen.getByTestId("sslTrustStoreFilePath")).toBeInTheDocument();
  expect(screen.getByTestId("redisDefaultPutExpiration")).toBeInTheDocument();
  expect(screen.getByTestId("maxRetryAttempts")).toBeInTheDocument();
  expect(screen.getByTestId("soTimeout")).toBeInTheDocument();
  expect(screen.getByTestId("maxIdleConnections")).toBeInTheDocument();
  expect(screen.getByTestId("maxTotalConnections")).toBeInTheDocument();
  expect(screen.getByTestId("connectionTimeout")).toBeInTheDocument();
});
