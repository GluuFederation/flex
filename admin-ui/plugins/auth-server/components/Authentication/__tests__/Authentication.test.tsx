import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  createAuthenticationTestStore,
  createAuthenticationTestWrapper,
} from './helpers/authenticationTestUtils'
import AuthNPage from '../index'

// Mock all sub-components to isolate the tab container behaviour
jest.mock('../DefaultAcr/DefaultAcr', () => ({
  __esModule: true,
  default: () => <div data-testid="default-acr">DefaultAcr</div>,
}))

jest.mock('../BuiltIn/BuiltIn', () => ({
  __esModule: true,
  default: () => <div data-testid="built-in-list">BuiltIn</div>,
}))

jest.mock('../Acrs/Acrs', () => ({
  __esModule: true,
  default: () => <div data-testid="acr-list">Acrs</div>,
}))

jest.mock('../AgamaFlows/AgamaFlows', () => ({
  __esModule: true,
  default: () => <div data-testid="agama-list">AgamaFlows</div>,
}))

jest.mock('../Aliases/Aliases', () => ({
  __esModule: true,
  default: () => <div data-testid="aliases-list">Aliases</div>,
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ state: null, pathname: '/auth-server/authn' })),
}))

describe('Authentication', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    const store = createAuthenticationTestStore()
    Wrapper = createAuthenticationTestWrapper(store)
  })

  it('renders all five tab labels', () => {
    render(<AuthNPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Default ACR/i)).toBeInTheDocument()
    expect(screen.getByText(/Built-In/i)).toBeInTheDocument()
    expect(screen.getByText(/^ACRs$/i)).toBeInTheDocument()
    expect(screen.getByText(/Aliases/i)).toBeInTheDocument()
    expect(screen.getByText(/Agama Flows/i)).toBeInTheDocument()
  })

  it('renders the Default ACR tab content by default', () => {
    render(<AuthNPage />, { wrapper: Wrapper })
    expect(screen.getByTestId('default-acr')).toBeInTheDocument()
  })

  it('does not show the Add Mapping button on the Default ACR tab', () => {
    render(<AuthNPage />, { wrapper: Wrapper })
    expect(screen.queryByText(/Add Mapping/i)).not.toBeInTheDocument()
  })
})
