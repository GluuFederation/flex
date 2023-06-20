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

  const dynamicConfigurationTab = screen.getByTestId(`Dynamic Configuration`)

  fireEvent.click(dynamicConfigurationTab)

  await waitFor(() => {
    expect(screen.getByText('Issuer', { exact: false })).toBeInTheDocument()
    expect(
      screen.getByText('Base Endpoint', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Clean Service Interval', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Clean Service Batch Chunk', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Use Local Cache', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Disable JDK Logger', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Logging Level', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Logging Layout', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('External Logger Configuration', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Metric Reporter Interval', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Metric Reporter Keep Data Days', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Metric Reporter Enabled', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Person Custom Object Classes', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Enable Super Gluu', { exact: false })
    ).toBeInTheDocument()
  })
})

it('Should render static config form fields', async () => {
  render(<Fido />, {
    wrapper: Wrapper,
  })

  const staticConfigurationTab = screen.getByTestId(`Static Configuration`)

  fireEvent.click(staticConfigurationTab)

  await waitFor(() => {
    expect(
      screen.getByText('Authenticator Certificates Folder', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('MDS Access Token', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('MDS TOC Certificates Folder', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('MDS TOC Files Folder', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Check U2F Attestations', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Unfinished Request Expiration', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Authentication History Expiration', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Server Metadata Folder', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('User Auto Enrollment', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Requested Credential Types', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Requested Parties Name', { exact: false })
    ).toBeInTheDocument()
  })
})
