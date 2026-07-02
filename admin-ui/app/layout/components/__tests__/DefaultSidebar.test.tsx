import React, { type PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { DefaultSidebar } from '../DefaultSidebar'

type CedarState = { initialized: boolean; cedarFailedStatusAfterMaxTries: boolean }
type SidebarState = { cedarPermissions: CedarState }
type Selector = (state: SidebarState) => CedarState

// Drive the cedarPermissions slice directly so the three loader branches can be
// exercised in isolation from the real store wiring.
const mockSelector = jest.fn()
jest.mock('@/redux/hooks', () => ({
  useAppSelector: (fn: Selector) => mockSelector(fn),
}))

// Children have their own suites; stub to markers so the branch under test is
// unambiguous and no downstream provider is required.
jest.mock('Components', () => ({
  Sidebar: ({ children }: PropsWithChildren) => <div data-testid="sidebar">{children}</div>,
}))
jest.mock('Routes/components/LogoThemed/LogoThemed', () => ({
  LogoThemed: () => <div data-testid="logo" />,
}))
jest.mock('@/routes/Apps/Gluu/GluuText', () => ({
  __esModule: true,
  default: ({ children }: PropsWithChildren) => <div data-testid="gluu-text">{children}</div>,
}))
jest.mock('Routes/Apps/Gluu/GluuAppSidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="app-sidebar" />,
}))
jest.mock('@/components/GluuSpinner', () => ({ GluuSpinner: () => <div data-testid="spinner" /> }))
jest.mock('react-router-dom', () => ({
  Link: ({ children }: PropsWithChildren) => <a>{children}</a>,
}))
jest.mock('../DefaultSidebar.style', () => ({
  useStyles: () => ({
    classes: { cedarMessageRoot: 'cedarMessageRoot', sidebarLoaderRoot: 'sidebarLoaderRoot' },
  }),
}))
jest.mock('@/helpers/navigation', () => ({ ROUTES: { ROOT: '/' } }))
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

const setCedarState = (state: CedarState) => {
  mockSelector.mockImplementation((fn: Selector) => fn({ cedarPermissions: state }))
}

describe('DefaultSidebar', () => {
  it('always renders the branded logo header', () => {
    setCedarState({ initialized: true, cedarFailedStatusAfterMaxTries: false })
    render(<DefaultSidebar />)
    expect(screen.getByTestId('logo')).toBeInTheDocument()
  })

  it('renders the app sidebar once permissions are initialized', () => {
    setCedarState({ initialized: true, cedarFailedStatusAfterMaxTries: false })
    render(<DefaultSidebar />)
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument()
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
  })

  it('shows the spinner while permissions are still loading', () => {
    setCedarState({ initialized: false, cedarFailedStatusAfterMaxTries: false })
    render(<DefaultSidebar />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
    expect(screen.queryByTestId('app-sidebar')).not.toBeInTheDocument()
  })

  it('shows the missing-permission message when cedar fails before initializing', () => {
    setCedarState({ initialized: false, cedarFailedStatusAfterMaxTries: true })
    render(<DefaultSidebar />)
    expect(screen.getByTestId('gluu-text')).toHaveTextContent(
      'messages.missing_required_permission',
    )
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    expect(screen.queryByTestId('app-sidebar')).not.toBeInTheDocument()
  })

  it('prefers the app sidebar over the failure message once initialized', () => {
    setCedarState({ initialized: true, cedarFailedStatusAfterMaxTries: true })
    render(<DefaultSidebar />)
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument()
    expect(screen.queryByTestId('gluu-text')).not.toBeInTheDocument()
  })
})
