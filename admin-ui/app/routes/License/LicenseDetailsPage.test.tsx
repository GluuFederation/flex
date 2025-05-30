// @ts-nocheck
import React from 'react'
import { render, screen } from '@testing-library/react'
import LicenseDetailsPage from './LicenseDetailsPage' 
import { Provider } from 'react-redux'
import i18n from '../../i18n'
import { I18nextProvider } from 'react-i18next'
import license from "./license"
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const INIT_LICENSE_DETAIL_STATE = {
  item: license,
  loading: false,
}

const store = configureStore({
  reducer: combineReducers({
    licenseDetailsReducer: (state = INIT_LICENSE_DETAIL_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render the Custom Script add page properly', () => {
  render(<LicenseDetailsPage item={license} loading={false} />, { wrapper: Wrapper })
  const key = license.licenseKey
  screen.getByText(/Product Name/)
  screen.getByText(/Product Code/)
  screen.getByText(/License Type/)
  screen.getByText(/License Key/)
  screen.getByText(key)
})
