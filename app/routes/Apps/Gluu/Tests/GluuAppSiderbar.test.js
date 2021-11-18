import React from 'react'
import { render } from '@testing-library/react'
import GluuAppSidebar from '../GluuAppSidebar'
import { combineReducers } from 'redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'
import authReducer from '../../../../redux/reducers/AuthReducer'
import Sidebar from '../../../../../app/components/Sidebar'

jest.spyOn(global.console, 'log').mockImplementation(jest.fn())
jest.spyOn(global.console, 'error').mockImplementation(jest.fn())

const store = createStore(
  combineReducers({
    authReducer,
    noReducer: (state = {}) => state,
  }),
)
const pageConfig = {}
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
})
