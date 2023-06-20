import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Fido from '../presentation/pages/Fido'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const INIT_STATE = {
  fido: {},
}

const store = configureStore({
  reducer: combineReducers({
    fidoReducer: (state = INIT_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render fido config tabs', () => {
  render(<Fido />, {
    wrapper: Wrapper,
  })

  screen.getByText('Dynamic Configuration', { exact: false })
  screen.getByText('Static Configuration', { exact: false })
})

it('Should render dynamic config form fields', async () => {
  render(<Fido />, {
    wrapper: Wrapper,
  })

  const inputFields = [
    'Issuer',
    'Base Endpoint',
    'Clean Service Interval',
    'Clean Service Batch Chunk',
    'Use Local Cache',
    'Disable JDK Logger',
    'Logging Level',
    'Logging Layout',
    'External Logger Configuration',
    'Metric Reporter Interval',
    'Metric Reporter Keep Data Days',
    'Metric Reporter Enabled',
    'Person Custom Object Classes',
    'Enable Super Gluu',
  ]
  const dynamicConfigurationTab = screen.getByTestId(`Dynamic Configuration`)

  fireEvent.click(dynamicConfigurationTab)

  await waitFor(() => {
    for (const field of inputFields) {
      expect(screen.getByText(field, { exact: false })).toBeInTheDocument()
    }
  })
})

it('Should render static config form fields', async () => {
  render(<Fido />, {
    wrapper: Wrapper,
  })

  const inputFields = [
    'Authenticator Certificates Folder',
    'MDS Access Token',
    'MDS TOC Certificates Folder',
    'MDS TOC Files Folder',
    'Check U2F Attestations',
    'Unfinished Request Expiration',
    'Authentication History Expiration',
    'Server Metadata Folder',
    'User Auto Enrollment',
    'Requested Credential Types',
    'Requested Parties Name',
  ]

  const staticConfigurationTab = screen.getByTestId(`Static Configuration`)

  fireEvent.click(staticConfigurationTab)

  await waitFor(() => {
    for (const field of inputFields) {
      expect(screen.getByText(field, { exact: false })).toBeInTheDocument()
    }
  })
})
