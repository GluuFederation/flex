import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GenerateLicenseCard from '@/components/LicenseScreens/GenerateLicenseCard'

type LicenseState = {
  generatingTrialKey: boolean
}

const createStore = (licenseState: LicenseState) =>
  configureStore({
    reducer: combineReducers({
      licenseReducer: (state = licenseState) => state,
    }),
  })

const renderCard = (store: ReturnType<typeof createStore>) =>
  render(
    <AppTestWrapper>
      <Provider store={store}>
        <GenerateLicenseCard />
      </Provider>
    </AppTestWrapper>,
  )

describe('GenerateLicenseCard', () => {
  it('renders the card title and description', () => {
    const store = createStore({ generatingTrialKey: false })
    renderCard(store)

    expect(screen.getByText('Free Trial')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Start your free trial to manage and configure your Auth Server using simplified web interface.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the generate button with the default (idle) label', () => {
    const store = createStore({ generatingTrialKey: false })
    renderCard(store)

    const button = screen.getByRole('button', { name: /Start 30 days trial/i })
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()
  })

  it('dispatches generateTrialLicense when the button is clicked', () => {
    const store = createStore({ generatingTrialKey: false })
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    renderCard(store)

    fireEvent.click(screen.getByRole('button', { name: /Start 30 days trial/i }))

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: expect.stringContaining('generateTrialLicense') }),
    )
  })

  it('disables the button while a trial key is being generated', () => {
    const store = createStore({ generatingTrialKey: true })
    renderCard(store)

    const button = screen.getByRole('button', { name: /Generating please wait/i })
    expect(button).toBeDisabled()
  })

  it('shows the generating label when generatingTrialKey is true', () => {
    const store = createStore({ generatingTrialKey: true })
    renderCard(store)

    expect(screen.getByText('Generating please wait...')).toBeInTheDocument()
    expect(screen.queryByText('Start 30 days trial')).not.toBeInTheDocument()
  })

  it('does not dispatch on render before any interaction', () => {
    const store = createStore({ generatingTrialKey: false })
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    renderCard(store)

    expect(dispatchSpy).not.toHaveBeenCalled()
  })
})
