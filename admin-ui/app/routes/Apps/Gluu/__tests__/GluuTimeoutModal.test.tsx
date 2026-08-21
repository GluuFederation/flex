import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuTimeoutModal, { buildAdminUrl } from 'Routes/Apps/Gluu/GluuTimeoutModal'
import { reducer as initReducer } from 'Redux/features/initSlice'

const createTestStore = (isTimeout: boolean, authServerHost = ''): Store =>
  configureStore({
    reducer: combineReducers({
      initReducer,
      authReducer: (state = { config: { authServerHost } }) => state,
    }),
    preloadedState: { initReducer: { isTimeout, isSessionExpired: false } },
  })

const renderModal = (isTimeout: boolean, authServerHost = '') => {
  const store = createTestStore(isTimeout, authServerHost)
  const result = render(
    <Provider store={store}>
      <AppTestWrapper>
        <GluuTimeoutModal />
      </AppTestWrapper>
    </Provider>,
  )
  return { store, ...result }
}

describe('GluuTimeoutModal', () => {
  it('renders the timeout dialog when isTimeout is true', () => {
    renderModal(true)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Request Timeout')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument()
  })

  it('renders nothing when isTimeout is false', () => {
    renderModal(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Request Timeout')).not.toBeInTheDocument()
  })

  it('clears the timeout state when the close button is clicked', () => {
    const { store } = renderModal(true)
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    fireEvent.click(closeButtons[0])
    expect(store.getState().initReducer.isTimeout).toBe(false)
  })

  it('clears the timeout state when Refresh is clicked', () => {
    const { store } = renderModal(true, '')
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    expect(store.getState().initReducer.isTimeout).toBe(false)
  })
})

// A dead session and a slow request are different problems with different remedies, so the modal
// must not tell an expired user to go check their network connection.
describe('GluuTimeoutModal session expiry', () => {
  const renderExpired = (authServerHost = '') => {
    const store = configureStore({
      reducer: combineReducers({
        initReducer,
        authReducer: (state = { config: { authServerHost } }) => state,
      }),
      preloadedState: { initReducer: { isTimeout: false, isSessionExpired: true } },
    })
    return render(
      <Provider store={store}>
        <AppTestWrapper>
          <GluuTimeoutModal />
        </AppTestWrapper>
      </Provider>,
    )
  }

  it('shows the session-expired copy, not the request-timeout copy', () => {
    renderExpired()

    expect(screen.getByText(/session has expired/i)).toBeInTheDocument()
    expect(screen.queryByText(/no response from the server/i)).not.toBeInTheDocument()
  })

  it('stays hidden when neither state is set', () => {
    const store = configureStore({
      reducer: combineReducers({
        initReducer,
        authReducer: (state = { config: { authServerHost: '' } }) => state,
      }),
      preloadedState: { initReducer: { isTimeout: false, isSessionExpired: false } },
    })
    const { container } = render(
      <Provider store={store}>
        <AppTestWrapper>
          <GluuTimeoutModal />
        </AppTestWrapper>
      </Provider>,
    )

    expect(container).toBeEmptyDOMElement()
  })
})

// jsdom forbids stubbing window.location, so the redirect target is asserted through the URL
// builder while the two exit paths are asserted by the state they clear.
describe('GluuTimeoutModal session-expiry redirect', () => {
  it('targets the admin root with a trailing slash', () => {
    expect(buildAdminUrl('https://auth.example.org')).toBe('https://auth.example.org/admin/')
  })

  it('falls back to a reload when no auth server host is configured', () => {
    expect(buildAdminUrl('')).toBeNull()
    expect(buildAdminUrl(undefined)).toBeNull()
  })

  // Proves the path comes from the app's configured base rather than a hardcoded '/admin/'.
  it('takes the base path from the app configuration', async () => {
    const original = process.env.BASE_PATH
    process.env.BASE_PATH = '/custom-base/'
    jest.resetModules()

    try {
      const reimported = await import('Routes/Apps/Gluu/GluuTimeoutModal')
      expect(reimported.buildAdminUrl('https://auth.example.org')).toBe(
        'https://auth.example.org/custom-base/',
      )
    } finally {
      if (original === undefined) {
        delete process.env.BASE_PATH
      } else {
        process.env.BASE_PATH = original
      }
      jest.resetModules()
    }
  })

  it('normalises a configured base path that omits the trailing slash', async () => {
    const original = process.env.BASE_PATH
    process.env.BASE_PATH = '/custom-base'
    jest.resetModules()

    try {
      const reimported = await import('Routes/Apps/Gluu/GluuTimeoutModal')
      expect(reimported.buildAdminUrl('https://auth.example.org')).toBe(
        'https://auth.example.org/custom-base/',
      )
    } finally {
      if (original === undefined) {
        delete process.env.BASE_PATH
      } else {
        process.env.BASE_PATH = original
      }
      jest.resetModules()
    }
  })

  const renderExpired = (authServerHost: string) => {
    const store = configureStore({
      reducer: combineReducers({
        initReducer,
        authReducer: (state = { config: { authServerHost } }) => state,
      }),
      preloadedState: { initReducer: { isTimeout: false, isSessionExpired: true } },
    })
    render(
      <Provider store={store}>
        <AppTestWrapper>
          <GluuTimeoutModal />
        </AppTestWrapper>
      </Provider>,
    )
    return store
  }

  it.each([
    ['Refresh', () => screen.getByRole('button', { name: 'Refresh' })],
    ['dismissal', () => screen.getAllByRole('button', { name: /close/i })[0]],
  ])('clears the expired state through %s so the redirect can run', (_label, getTrigger) => {
    const store = renderExpired('https://auth.example.org')

    fireEvent.click(getTrigger()!)

    expect(store.getState().initReducer.isSessionExpired).toBe(false)
  })
})
