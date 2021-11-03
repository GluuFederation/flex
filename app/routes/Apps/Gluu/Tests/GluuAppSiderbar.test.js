import React from 'react'
import { render, screen } from '@testing-library/react'
import GluuAppSidebar from '../GluuAppSidebar'
import { combineReducers } from 'redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'
import reducerRegistry from '../../../../redux/reducers/ReducerRegistry'
//import store from '../../../../redux/store'
import appReducers from '../../../../redux/reducers'
import authReducer from '../../../../redux/reducers/AuthReducer'
import Sidebar from '../../../../../app/components/Sidebar'

jest.spyOn(global.console, 'log').mockImplementation(jest.fn());
jest.spyOn(global.console, 'error').mockImplementation(jest.fn());

const combine = (reducers) => {
  const reducerNames = Object.keys(reducers)
  Object.keys(appReducers).forEach((item) => {
    if (reducerNames.indexOf(item) === -1) {
      reducers[item] = (state = null) => state
    }
  })
  return combineReducers(reducers)
}
const reducers = combine(reducerRegistry.getReducers())

const INIT_STATE = {
  isAuthenticated: false,
  userinfo: null,
  userinfo_jwt: null,
  token: null,
  issuer: null,
  permissions: [],
  location: {},
  config: {},
  backendIsUp: true,
}

//const store1 = createStore(reducers, INIT_STATE)
const store = createStore(
  combineReducers({
    authReducer,
    noReducer: (state = {}) => state,
  }),
)
 const pageConfig ={}
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
)

it('Should show the sidebar properly', () => {
  const scopes = []
  render(<GluuAppSidebar scopes={scopes} />, { wrapper: Wrapper })

  // screen.getByText('Sign out')
})
