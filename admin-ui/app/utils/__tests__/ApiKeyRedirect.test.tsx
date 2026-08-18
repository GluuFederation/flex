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
      initReducer: { isTimeout: false, isSessionExpired: false },
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
    const store = buildStore({ initReducer: { isTimeout: false, isSessionExpired: true } })
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

// Every screen this component can arbitrate between. The timeout branch was added last and must
// not shadow any of the pre-existing states, so each one is pinned with isTimeout left false.
describe('ApiKeyRedirect screen arbitration', () => {
  const loaderOf = (container: HTMLElement) => container.querySelector('[aria-busy="true"]')

  it('prompts for an SSA upload when the config is genuinely invalid', async () => {
    const { container } = renderWith({
      isLicenseValid: false,
      islicenseCheckResultLoaded: true,
      roleNotFound: false,
      isConfigValid: false,
    })

    // Asserted after the lazy chunk resolves, so the Suspense fallback is not mistaken for the
    // redirecting loader — both carry aria-busy.
    expect(await screen.findByText(/upload ssa here/i)).toBeInTheDocument()
    expect(loaderOf(container)).not.toBeInTheDocument()
  })

  it('offers the API key screen when no valid license key is found', () => {
    const store = buildStore({
      licenseReducer: {
        isValidatingFlow: false,
        isNoValidLicenseKeyFound: true,
        isUnderThresholdLimit: true,
      },
    })

    const { container } = renderWith(
      {
        isLicenseValid: false,
        islicenseCheckResultLoaded: true,
        roleNotFound: false,
        isConfigValid: true,
      },
      store,
    )

    expect(loaderOf(container)).not.toBeInTheDocument()
    expect(screen.queryByText(/upload ssa here/i)).not.toBeInTheDocument()
  })

  it('surfaces the role error alongside whatever else is showing', () => {
    renderWith({
      isLicenseValid: true,
      islicenseCheckResultLoaded: true,
      roleNotFound: true,
      isConfigValid: true,
    })

    expect(screen.getByText('Unauthorized User')).toBeInTheDocument()
  })

  it('keeps the SSA screen hidden when the session timed out', () => {
    const store = buildStore({ initReducer: { isTimeout: false, isSessionExpired: true } })
    const { container } = renderWith(
      {
        isLicenseValid: false,
        islicenseCheckResultLoaded: false,
        roleNotFound: false,
        isConfigValid: null,
      },
      store,
    )

    expect(screen.queryByText(/upload ssa here/i)).not.toBeInTheDocument()
    expect(loaderOf(container)).not.toBeInTheDocument()
  })

  it('does not stack the service-down modal on top of a timeout', () => {
    const store = buildStore({
      authReducer: {
        config: {},
        backendStatus: { active: false, errorMessage: 'Service unavailable', statusCode: 503 },
      },
      initReducer: { isTimeout: false, isSessionExpired: true },
    })

    renderWith(
      {
        isLicenseValid: false,
        islicenseCheckResultLoaded: true,
        roleNotFound: false,
        isConfigValid: null,
      },
      store,
    )

    expect(screen.queryByText('Service unavailable')).not.toBeInTheDocument()
  })
})
