import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import ClientWizardForm from 'Plugins/auth-server/components/Clients/ClientWizardForm'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import clients from './clients.test'
import { reducer as scopeReducer } from 'Plugins/auth-server/redux/features/scopeSlice'
import oidcDiscoveryReducer from 'Redux/features/oidcDiscoverySlice'
import { t } from 'i18next'

const initReducer = {
  scripts: [],
}

const store = configureStore({
  reducer: combineReducers({
    initReducer: (state = initReducer) => state,
    scopeReducer: scopeReducer,
    oidcDiscoveryReducer: oidcDiscoveryReducer,
  }),
})

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

function hasInputValue(e, inputValue) {
  return screen.getByDisplayValue(inputValue) === e
}

describe('Should render client add/edit form properly', () => {
  test('render and update input fields', async () => {
    const { container } = render(<ClientWizardForm scripts={[]} client_data={clients[0]} />, {
      wrapper: Wrapper,
    })

    screen.debug(container, Infinity)
    const clientNameInput = screen.getByTestId('clientName')
    fireEvent.change(clientNameInput, { target: { value: 'test' } })
    expect(hasInputValue(clientNameInput, 'test')).toBe(true)

    const applicationType = screen.getByTestId('applicationType')
    fireEvent.change(applicationType, { target: { value: 'web' } })
    expect(hasInputValue(applicationType, 'web')).toBe(true)

    const redirectUris = screen.getByTestId('new_entry')
    fireEvent.change(redirectUris, { target: { value: 'www.gluu.org' } })
    const addButton = screen.getByTestId(t('actions.add'))
    fireEvent.click(addButton)
    screen.debug(await screen.findByText('www.gluu.org'), Infinity)

    fireEvent.change(redirectUris, { target: { value: 'www.google.com' } })
    fireEvent.click(addButton)
    screen.debug(await screen.findByText('www.google.com'), Infinity)
  })

  test('should display tokens tab input fields', async () => {
    //* By Default Basic Tab is Active
    const { container } = render(<ClientWizardForm scripts={[]} client_data={clients[0]} />, {
      wrapper: Wrapper,
    })

    screen.debug(container, Infinity)
    const tokensTab = screen.getByTestId('Tokens')
    fireEvent.click(tokensTab)

    expect(await screen.findByText(/Access token type/i)).toBeVisible()
    expect(await screen.findByText(/Default max authn age/i)).toBeVisible()
  })

  test('persist input values if tabs are switched', async () => {
    render(<ClientWizardForm scripts={[]} client_data={clients[0]} />, {
      wrapper: Wrapper,
    })

    const tokensTab = screen.getByTestId('Tokens')
    // Switch to Tokens Tab
    fireEvent.click(tokensTab)

    const accessTokenLifetimeInput = screen.getByTestId('refreshTokenLifetime')
    // Change value of Access token lifetime field on Tokens Tab
    fireEvent.change(accessTokenLifetimeInput, { target: { value: 22 } })
    expect(await screen.getByDisplayValue('22')).toBeVisible()

    const logoutTab = screen.getByTestId('Logout')
    // Switch to Logout Tab
    fireEvent.click(logoutTab)

    const cibaParUmaTab = screen.getByTestId('CIBA/PAR/UMA')
    // Switch to CIBA / PAR / UMA Tab
    fireEvent.click(cibaParUmaTab)

    const claimsRedirectUris = screen.getByTestId('new_entry')
    fireEvent.change(claimsRedirectUris, { target: { value: 'www.claims_gluu.org' } })
    // Update value of Claims redirect URI field under UMA
    const addButton = screen.getByTestId(t('actions.add'))
    fireEvent.click(addButton)
    screen.debug(await screen.findByText('www.claims_gluu.org'), Infinity)

    // Switch back to Tokens Tab & checks if the modified value exists
    fireEvent.click(tokensTab)
    expect(await screen.getByDisplayValue('22')).toBeVisible()

    // Switch back to CIBA / PAR / UMA Tab & checks if the modified value exists
    fireEvent.click(cibaParUmaTab)
    expect(await screen.getByText('www.claims_gluu.org')).toBeInTheDocument()
  })
})
