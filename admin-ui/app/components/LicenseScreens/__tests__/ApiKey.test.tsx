import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import ApiKey from '@/components/LicenseScreens/ApiKey'

type LicenseState = {
  error: string
  isLoading: boolean
  generatingTrialKey: boolean
}

const defaultState: LicenseState = {
  error: '',
  isLoading: false,
  generatingTrialKey: false,
}

const createStore = (licenseState: LicenseState = defaultState) =>
  configureStore({
    reducer: combineReducers({
      licenseReducer: (state = licenseState) => state,
    }),
  })

const renderApiKey = (store: ReturnType<typeof createStore>) =>
  render(
    <AppTestWrapper>
      <Provider store={store}>
        <ApiKey />
      </Provider>
    </AppTestWrapper>,
  )

describe('ApiKey', () => {
  it('renders the welcome title', () => {
    renderApiKey(createStore())

    expect(screen.getByText('Welcome to Admin UI')).toBeInTheDocument()
  })

  it('renders the logo image', () => {
    renderApiKey(createStore())

    const logo = screen.getByAltText('Logo')
    expect(logo).toBeInTheDocument()
    expect(logo.tagName).toBe('IMG')
  })

  it('renders the embedded GenerateLicenseCard with its trial button', () => {
    renderApiKey(createStore())

    expect(screen.getByText('Free Trial')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start 30 days trial/i })).toBeInTheDocument()
  })

  it('displays the server error message when present', () => {
    renderApiKey(createStore({ ...defaultState, error: 'Invalid license key' }))

    expect(screen.getByText('Invalid license key')).toBeInTheDocument()
  })

  it('does not show an error message when error is empty', () => {
    renderApiKey(createStore())

    expect(screen.queryByText('Invalid license key')).not.toBeInTheDocument()
  })

  it('blocks the loader while isLoading is true', () => {
    renderApiKey(createStore({ ...defaultState, isLoading: true }))

    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument()
  })

  it('blocks the loader while generatingTrialKey is true', () => {
    renderApiKey(createStore({ ...defaultState, generatingTrialKey: true }))

    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument()
  })

  it('does not block the loader in the idle state', () => {
    renderApiKey(createStore())

    expect(document.querySelector('[aria-busy="true"]')).not.toBeInTheDocument()
  })
})
