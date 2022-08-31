import React from 'react'
import { render, screen } from '@testing-library/react'
import LicenseDetailsPage from './LicenseDetailsPage'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../i18n'
import { I18nextProvider } from 'react-i18next'
import license from "./license"

const INIT_LICENSE_DETAIL_STATE = {
  item: license,
  loading: false,
}
const store = createStore(
  combineReducers({
    licenseDetailsReducer: (state = INIT_LICENSE_DETAIL_STATE) => state,
    noReducer: (state = {}) => state,
  }),
)

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>{children}</Provider>
  </I18nextProvider>
)

it('Should render the Custom Script add page properly', () => {
  render(<LicenseDetailsPage />, { wrapper: Wrapper })
  const key = license.licenseKey
  screen.getByText(/Product Name/)
  screen.getByText(/Product Code/)
  screen.getByText(/License Type/)
  screen.getByText(/License Key/)
  screen.getByText(key)
})
