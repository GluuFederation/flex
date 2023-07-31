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
    const { container } = render(
      <ClientWizardForm scripts={[]} client_data={clients[0]} />,
      {
        wrapper: Wrapper,
      }
    )
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
})
