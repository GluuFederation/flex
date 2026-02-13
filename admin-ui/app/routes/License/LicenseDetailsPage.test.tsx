import React, { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import LicenseDetailsPage from './LicenseDetailsPage'
import AppTestWrapper from '../Apps/Gluu/Tests/Components/AppTestWrapper'

jest.mock('@/cedarling', () => ({
  useCedarling: () => ({
    hasCedarWritePermission: () => true,
    hasCedarReadPermission: () => true,
    authorizeHelper: jest.fn(),
  }),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { License: 'License', Webhooks: 'Webhooks' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: {
    License: [{ permission: 'read', resourceId: 'License' }],
    Webhooks: [],
  },
}))

jest.mock('../Apps/Gluu/GluuCommitDialog', () => ({
  __esModule: true,
  default: function MockGluuCommitDialog() {
    return null
  },
}))

const mockLicense = {
  companyName: 'Gluu',
  customerEmail: 'arnab@gluu.org',
  customerFirstName: 'Arnab',
  customerLastName: 'Dutta',
  licenseActive: true,
  licenseEnabled: true,
  licenseExpired: false,
  licenseKey: 'TEST_LICENSE_KEY',
  licenseType: 'TIME_LIMITED',
  maxActivations: 14,
  productCode: 'adminui001',
  productName: 'Gluu Admin UI',
  validityPeriod: '2022-10-01T00:00Z',
}

jest.mock('./hooks/useLicenseDetails', () => ({
  useLicenseDetails: () => ({
    item: mockLicense,
    loading: false,
    refetch: jest.fn(),
    queryKey: [],
    resetLicense: jest.fn(),
    isResetting: false,
  }),
}))

const store = configureStore({
  reducer: {
    authReducer: (state = { hasSession: true }) => state,
  },
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
