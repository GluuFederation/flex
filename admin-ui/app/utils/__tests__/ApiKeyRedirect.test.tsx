import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import ApiKeyRedirect from '../ApiKeyRedirect'
import authReducer from '@/redux/features/authSlice'
import licenseReducer from '@/redux/features/licenseSlice'
import { reducer as initReducer } from '@/redux/features/initSlice'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const rootReducer = combineReducers({ authReducer, licenseReducer, initReducer })

const buildStore = (
  overrides: Partial<{ authReducer: object; licenseReducer: object; initReducer: object }> = {},
) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      authReducer: {
        config: {},
        backendStatus: { active: true, errorMessage: null, statusCode: null },
      },
      licenseReducer: {
        isValidatingFlow: false,
        isNoValidLicenseKeyFound: false,
        isUnderThresholdLimit: true,
      },
      initReducer: { isTimeout: false },
      ...overrides,
    } as never,
  })

const renderWith = (props: React.ComponentProps<typeof ApiKeyRedirect>, store = buildStore()) =>
  render(
    <Provider store={store}>
      <AppTestWrapper>
        <ApiKeyRedirect {...props} />
      </AppTestWrapper>
    </Provider>,
  )

describe('ApiKeyRedirect', () => {
  it('shows the redirecting loader while the config result is unresolved', () => {
    const { container } = renderWith({
      isLicenseValid: false,
      islicenseCheckResultLoaded: false,
      roleNotFound: false,
      isConfigValid: null,
    })

    const loader = container.querySelector('[aria-live="polite"]')
    expect(loader).toBeInTheDocument()
    expect(loader).toHaveAttribute('aria-busy', 'true')
  })

  it('does not show the redirecting loader after an API timeout with a valid license', () => {
    const store = buildStore({ initReducer: { isTimeout: true } })
    const { container } = renderWith(
      {
        isLicenseValid: true,
        islicenseCheckResultLoaded: true,
        roleNotFound: false,
        isConfigValid: true,
      },
      store,
    )

    expect(container.querySelector('[aria-live="polite"]')).not.toBeInTheDocument()
  })

  it('renders the service-down modal when the backend is inactive', () => {
    const store = buildStore({
      authReducer: {
        config: {},
        backendStatus: { active: false, errorMessage: 'Service unavailable', statusCode: 503 },
      },
    })

    renderWith(
      {
        isLicenseValid: false,
        islicenseCheckResultLoaded: true,
        roleNotFound: false,
        isConfigValid: false,
      },
      store,
    )

    expect(screen.getByText('Service unavailable')).toBeInTheDocument()
  })
})
