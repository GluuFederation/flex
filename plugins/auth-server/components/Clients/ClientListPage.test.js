import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from "redux";
import ClientListPage from './ClientListPage'
import oidcReducer from '../../redux/reducers/OIDCReducer'
import { screen, render } from "@testing-library/react";

const initialState = {
};
const store = createStore(oidcReducer, initialState);

const Wrapper = ({ children }) => (
	<Provider store={store}>{children}</Provider>
);

describe("List OpenId Connect Clients", () => {
    it("First test", async () => {
      render(<ClientListPage />, { wrapper: Wrapper });
      const userName = await screen.findByText("mock name");
      expect(userName).toBeTruthy();
    });

  });
