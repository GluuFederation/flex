import React from "react";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import AppTestWrapper from "Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test";
import CacheRefreshManagement from "./CacheRefreshManagement";
import { t } from "i18next";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import userEvent from "@testing-library/user-event";

const cachRefreshState = {
  loading: false,
  configuration: {
    updateMethod: null,
    snapshotFolder: null,
    snapshotMaxCount: null,
    ldapSearchSizeLimit: null,
    keepExternalPerson: null,
    cacheRefreshServerIpAddress: null,
    vdsCacheRefreshPollingInterval: null,
    vdsCacheRefreshEnabled: null,
    attributeMapping: [],
    vdsCacheRefreshProblemCount: null,
    vdsCacheRefreshLastUpdateCount: null,
  },
};

const store = createStore(
  combineReducers({
    noReducer: (state = {}) => state,
    cacheRefreshReducer: (state = cachRefreshState) => state,
  })
);

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
);

const pageRenderSetup = () => {
  render(<CacheRefreshManagement />, {
    wrapper: Wrapper,
  });
};

it("Should render cache refresh management page properly", () => {
  render(<CacheRefreshManagement />, {
    wrapper: Wrapper,
  });
  screen.getByText(`${t("menus.cacherefresh")}`);
  const cacheRefreshLink = screen.getByText(`${t("menus.cacherefresh")}`);
  expect(cacheRefreshLink).toBeInTheDocument();

  const customerBackendKeyAttributesLink = screen.getByText(
    `${t("menus.customer_backend_key_attributes")}`
  );
  expect(customerBackendKeyAttributesLink).toBeInTheDocument();

  const inumDbServerLink = screen.getByText(`${t("menus.inum_db_server")}`);
  expect(inumDbServerLink).toBeInTheDocument();

  const sourceBackendLdapServersLink = screen.getByText(
    `${t("menus.source_backend_ldap_servers")}`
  );
  expect(sourceBackendLdapServersLink).toBeInTheDocument();
});

it("Should display change password modal", async () => {
  render(<CacheRefreshManagement />, {
    wrapper: Wrapper,
  });

  const sourceBackendLdapServersLink = screen.getByText(
    `${t("menus.source_backend_ldap_servers")}`
  );
  expect(sourceBackendLdapServersLink).toBeInTheDocument();
  userEvent.click(sourceBackendLdapServersLink);

  await waitFor(async () => {
    const addSourceServerBtn = screen.getByText("Add source LDAP server", {
      exact: false,
    });
    expect(addSourceServerBtn).toBeInTheDocument();
    userEvent.click(addSourceServerBtn);

    await waitFor(async () => {
      const changePasswordBtn = screen.getByText("Change Bind Password", {
        exact: false,
      });
      expect(changePasswordBtn).toBeInTheDocument();
      userEvent.click(changePasswordBtn);
      await waitFor(async () => {
        expect(
          screen.getByTestId("Change Backend Bind Password", {
            exact: false,
          })
        ).toBeInTheDocument();
      });
    });
  });
});
