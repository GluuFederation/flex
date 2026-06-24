import React, { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

jest.mock('Plugins/saml/components/SamlConfigurationForm', () => ({
  __esModule: true,
  default: () => <div data-testid="saml-configuration-form">Configuration Panel</div>,
}))

jest.mock('Plugins/saml/components/WebsiteSsoIdentityBrokeringList', () => ({
  __esModule: true,
  default: () => <div data-testid="saml-idp-list">Identity Brokering Panel</div>,
}))

jest.mock('Plugins/saml/components/WebsiteSsoServiceProviderList', () => ({
  __esModule: true,
  default: () => <div data-testid="saml-sp-list">Service Provider Panel</div>,
}))

import SamlPage from 'Plugins/saml/components/SamlPage'

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { hasSession: true, permissions: [], config: {} }) => state,
    cedarPermissions: (state = { permissions: {}, initialized: true, isInitializing: false }) =>
      state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

const renderPage = async () => {
  let result: ReturnType<typeof render>
  await act(async () => {
    result = render(<SamlPage />, { wrapper: Wrapper })
  })
  return result!
}

describe('SamlPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', async () => {
    await renderPage()
    expect(screen.getByText('Configuration')).toBeInTheDocument()
  })

  it('renders all three tab labels', async () => {
    await renderPage()
    expect(screen.getByText('Configuration')).toBeInTheDocument()
    expect(screen.getByText('Identity Brokering')).toBeInTheDocument()
    expect(screen.getByText('Website SSO')).toBeInTheDocument()
  })

  it('shows the configuration panel by default', async () => {
    await renderPage()
    expect(screen.getByTestId('saml-configuration-form')).toBeInTheDocument()
  })

  it('switches to the identity providers panel when its tab is clicked', async () => {
    await renderPage()
    await act(async () => {
      fireEvent.click(screen.getByText('Identity Brokering'))
    })
    expect(screen.getByTestId('saml-idp-list')).toBeInTheDocument()
  })

  it('switches to the service providers panel when its tab is clicked', async () => {
    await renderPage()
    await act(async () => {
      fireEvent.click(screen.getByText('Website SSO'))
    })
    expect(screen.getByTestId('saml-sp-list')).toBeInTheDocument()
  })
})
