import React from 'react';
import { render } from '@testing-library/react';
import GluuAppSidebar from '../GluuAppSidebar';
import { combineReducers, createStore } from 'redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import i18n from '../../../../i18n';
import { I18nextProvider } from 'react-i18next';
import Sidebar from '../../../../../app/components/Sidebar';

jest.spyOn(global.console, 'log').mockImplementation(jest.fn());
jest.spyOn(global.console, 'error').mockImplementation(jest.fn());

const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
];
const INIT_STATE = {
  permissions: permissions,
};

const store = createStore(
  combineReducers({
    authReducer: (state = INIT_STATE) => state,
    noReducer: (state = {}) => state,
  }),
);
const pageConfig = {};
const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Router basename="/admin">
        <Sidebar.MobileFluid pageConfig={pageConfig}>
          <Sidebar.Section fluid cover>
            {children}
          </Sidebar.Section>
        </Sidebar.MobileFluid>
      </Router>
    </Provider>
  </I18nextProvider>
);

it('Should show the sidebar properly', () => {
  const scopes = [];
  render(<GluuAppSidebar scopes={scopes} />, { wrapper: Wrapper });
  expect(true).toBeTruthy();
});
