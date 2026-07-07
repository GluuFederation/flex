import { render, screen, fireEvent, within } from '@testing-library/react'

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

jest.mock('@/context/theme/themeContext', () => ({
  useTheme: () => ({ state: { theme: 'light' } }),
}))
jest.mock('@/context/theme/config', () => ({
  __esModule: true,
  default: () => ({
    navbar: { background: '#fff', border: '#eee' },
    fontColor: '#0a2540',
    textMuted: '#425466',
    lightBackground: '#f5f5f5',
  }),
}))

let mockPathname = '/home/dashboard'
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: mockPathname }),
}))

jest.mock('../sheetIcons', () => ({
  SHEET_ICON_BY_KEY: new Proxy(
    {},
    { get: (_t, key) => <span data-testid={`icon-${String(key)}`} /> },
  ),
}))

import MobileNavSheet from '../MobileNavSheet'

const noop = () => {}

beforeEach(() => {
  mockPathname = '/home/dashboard'
})

describe('MobileNavSheet', () => {
  it('renders nothing when no sheet is open', () => {
    const { container } = render(<MobileNavSheet openKey={null} onClose={noop} onSelect={noop} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the All Category grid with the 8 tiles for the More sheet', () => {
    render(<MobileNavSheet openKey="more" onClose={noop} onSelect={noop} />)
    expect(screen.getByTestId('mobile-nav-sheet-title')).toHaveTextContent('menus.allCategory')
    for (const label of [
      'menus.scripts',
      'menus.user_claims',
      'menus.services',
      'menus.smtp',
      'menus.scim',
      'menus.fido',
      'menus.jans_lock',
      'menus.notification',
    ]) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('drills a tile with children (FIDO) into its sub-list instead of navigating', () => {
    const onSelect = jest.fn()
    render(<MobileNavSheet openKey="more" onClose={noop} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: 'menus.fido' }))
    expect(screen.getByTestId('mobile-nav-sheet-title')).toHaveTextContent('menus.fido')
    expect(screen.getByRole('button', { name: 'menus.configuration' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'menus.metrics' })).toBeInTheDocument()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('navigates on a drilled child tap and offers a back button to the grid', () => {
    const onSelect = jest.fn()
    render(<MobileNavSheet openKey="more" onClose={noop} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: 'menus.services' }))
    const back = screen.getByRole('button', { name: 'actions.back' })
    fireEvent.click(back)
    expect(screen.getByTestId('mobile-nav-sheet-title')).toHaveTextContent('menus.allCategory')
    fireEvent.click(screen.getByRole('button', { name: 'menus.services' }))
    fireEvent.click(screen.getByRole('button', { name: 'menus.cache' }))
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ path: '/config/cache' }))
  })

  it('opens the More sheet pre-drilled into the tile holding the current route', () => {
    mockPathname = '/fido/metrics'
    render(<MobileNavSheet openKey="more" onClose={noop} onSelect={noop} />)
    expect(screen.getByTestId('mobile-nav-sheet-title')).toHaveTextContent('menus.fido')
    expect(screen.getByRole('button', { name: 'menus.metrics' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('marks the grid tile active when one of its child routes is current', () => {
    mockPathname = '/config/persistence'
    render(<MobileNavSheet openKey="more" onClose={noop} onSelect={noop} />)
    fireEvent.click(screen.getByRole('button', { name: 'actions.back' }))
    expect(screen.getByRole('button', { name: 'menus.services' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('button', { name: 'menus.scim' })).not.toHaveAttribute('aria-current')
  })

  it('renders the section list for a primary tab and marks the active route bold', () => {
    mockPathname = '/home/dashboard'
    render(<MobileNavSheet openKey="home" onClose={noop} onSelect={noop} />)
    expect(screen.getByTestId('mobile-nav-sheet-title')).toHaveTextContent('menus.home')
    expect(screen.getByRole('button', { name: 'menus.dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('button', { name: 'menus.health' })).not.toHaveAttribute('aria-current')
  })

  it('calls onSelect with the tapped item', () => {
    const onSelect = jest.fn()
    render(<MobileNavSheet openKey="home" onClose={noop} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: 'menus.health' }))
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ path: '/home/health' }))
  })

  it('renders Security as a collapsed expandable row (children hidden, does not navigate)', () => {
    const onSelect = jest.fn()
    render(<MobileNavSheet openKey="home" onClose={noop} onSelect={onSelect} />)
    const security = screen.getByRole('button', { name: /menus.security/ })
    expect(security).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('button', { name: 'menus.securityDropdown.mapping' }),
    ).not.toBeInTheDocument()
    fireEvent.click(security)
    expect(security).toHaveAttribute('aria-expanded', 'true')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('reveals Security children on expand and selects a child on tap', () => {
    const onSelect = jest.fn()
    render(<MobileNavSheet openKey="home" onClose={noop} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /menus.security/ }))
    const child = screen.getByRole('button', { name: 'menus.securityDropdown.mapping' })
    expect(child).toBeInTheDocument()
    fireEvent.click(child)
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ path: '/home/mapping' }))
  })

  it('opens with Security pre-expanded and the active child highlighted when on its route', () => {
    mockPathname = '/home/cedarlingconfig'
    render(<MobileNavSheet openKey="home" onClose={noop} onSelect={noop} />)
    expect(screen.getByRole('button', { name: 'menus.security' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    const child = screen.getByRole('button', {
      name: 'menus.securityDropdown.cedarlingConfig',
    })
    expect(child).toHaveAttribute('aria-current', 'page')
  })

  it('keeps the Notification tile enabled but inert, staying on the modal when tapped', () => {
    const onSelect = jest.fn()
    const onClose = jest.fn()
    render(<MobileNavSheet openKey="more" onClose={onClose} onSelect={onSelect} />)
    const tile = screen.getByRole('button', { name: 'menus.notification' })
    expect(tile).toBeEnabled()
    fireEvent.click(tile)
    expect(onSelect).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByTestId('mobile-nav-sheet')).toBeInTheDocument()
  })

  it('closes via the close button and the scrim', () => {
    const onClose = jest.fn()
    render(<MobileNavSheet openKey="more" onClose={onClose} onSelect={noop} />)
    const closeButtons = screen.getAllByRole('button', { name: 'actions.close' })
    fireEvent.click(closeButtons[0])
    expect(onClose).toHaveBeenCalled()
  })

  it('closes on Escape', () => {
    const onClose = jest.fn()
    render(<MobileNavSheet openKey="more" onClose={onClose} onSelect={noop} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('moves focus into the dialog (onto the header close button) when it opens', () => {
    render(<MobileNavSheet openKey="more" onClose={noop} onSelect={noop} />)
    const headerClose = within(screen.getByTestId('mobile-nav-sheet')).getByRole('button', {
      name: 'actions.close',
    })
    expect(headerClose).toHaveFocus()
  })
})
