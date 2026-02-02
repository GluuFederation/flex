import React, { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import LicenseDetailsPage from './LicenseDetailsPage'
import { Provider } from 'react-redux'
import AppTestWrapper from '../Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const mockLicense = {
  companyName: 'Gluu',
  customerEmail: 'arnab@gluu.org',
  customerFirstName: 'Arnab',
  customerLastName: 'Dutta',
  licenseActive: true,
  licenseEnable: true,
  licenseEnabled: true,
  licenseKey: 'GFXJ-AB8B-YDJK-L4AD',
  licenseType: 'TIME_LIMITED',
  maxActivations: 14,
  productCode: 'adminui001',
  productName: 'Gluu Admin UI',
  validityPeriod: '2022-10-01T00:00Z',
}

const INIT_LICENSE_DETAIL_STATE = {
  item: mockLicense,
  loading: false,
}

const store = configureStore({
  reducer: combineReducers({
    licenseDetailsReducer: (state = INIT_LICENSE_DETAIL_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: ReactNode }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render the License details page properly', () => {
  render(<LicenseDetailsPage />, { wrapper: Wrapper })
  const key = mockLicense.licenseKey
  expect(screen.getByText(/Product Name/)).toBeInTheDocument()
  expect(screen.getByText(/Product Code/)).toBeInTheDocument()
  expect(screen.getByText(/License Type/)).toBeInTheDocument()
  expect(screen.getByText(/License Key/)).toBeInTheDocument()
  expect(screen.getByText(key)).toBeInTheDocument()
})
