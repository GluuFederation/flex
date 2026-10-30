import { render, screen, waitFor } from '@testing-library/react'
import RouteGuard from '../RouteGuard'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_ACTIONS, CEDARLING_BYPASS } from '@/cedarling/constants'

type GuardState = {
  cedarPermissions: { initialized: boolean; permissions: Record<string, boolean> }
}

// jest hoists mock factories above imports; factory-closed variables must be `mock`-prefixed.
const mockState: GuardState = { cedarPermissions: { initialized: true, permissions: {} } }
jest.mock('@/redux/hooks', () => ({
  useAppSelector: <T,>(fn: (s: GuardState) => T) => fn(mockState),
}))

const mockAuthorizeHelper = jest.fn()
jest.mock('@/cedarling/hooks/useCedarling', () => ({
  useCedarling: () => ({ authorizeHelper: mockAuthorizeHelper }),
}))

jest.mock('Routes/Apps/Gluu/GluuViewWrapper', () => ({
  __esModule: true,
  default: ({ canShow }: { canShow?: boolean | null }) => (
    <div data-testid={canShow == null ? 'LOADING' : 'MISSING'} />
  ),
}))

const CLIENTS = ADMIN_UI_RESOURCES.Clients

const renderGuard = (props: Parameters<typeof RouteGuard>[0]) => render(<RouteGuard {...props} />)
const page = <div data-testid="PAGE" />

describe('RouteGuard', () => {
  beforeEach(() => {
    mockAuthorizeHelper.mockReset()
    mockAuthorizeHelper.mockReturnValue(new Promise(() => {}))
    mockState.cedarPermissions = { initialized: true, permissions: {} }
  })

  it('renders the page when the cached decision allows the route', () => {
    mockState.cedarPermissions.permissions = { 'Clients::write': true }
    renderGuard({ resourceKey: CLIENTS, action: CEDAR_ACTIONS.WRITE, children: page })
    expect(screen.getByTestId('PAGE')).toBeInTheDocument()
    expect(mockAuthorizeHelper).not.toHaveBeenCalled()
  })

  it('shows the missing-permission view when the decision denies the route', () => {
    mockState.cedarPermissions.permissions = { 'Clients::read': true, 'Clients::write': false }
    renderGuard({ resourceKey: CLIENTS, action: CEDAR_ACTIONS.WRITE, children: page })
    expect(screen.getByTestId('MISSING')).toBeInTheDocument()
    expect(screen.queryByTestId('PAGE')).not.toBeInTheDocument()
  })

  it('waits and asks Cedarling when there is no decision yet', () => {
    renderGuard({ resourceKey: CLIENTS, action: CEDAR_ACTIONS.READ, children: page })
    expect(screen.getByTestId('LOADING')).toBeInTheDocument()
    expect(mockAuthorizeHelper).toHaveBeenCalledWith([
      { resourceId: CLIENTS, action: CEDAR_ACTIONS.READ },
    ])
  })

  it('shows the missing-permission view when Cedarling fails and stores no decision', async () => {
    mockAuthorizeHelper.mockResolvedValue([{ isAuthorized: false, error: 'boom' }])
    renderGuard({ resourceKey: CLIENTS, action: CEDAR_ACTIONS.READ, children: page })
    expect(screen.getByTestId('LOADING')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByTestId('MISSING')).toBeInTheDocument())
    expect(screen.queryByTestId('PAGE')).not.toBeInTheDocument()
  })

  it('does not ask Cedarling before it is initialized', () => {
    mockState.cedarPermissions.initialized = false
    renderGuard({ resourceKey: CLIENTS, action: CEDAR_ACTIONS.READ, children: page })
    expect(screen.getByTestId('LOADING')).toBeInTheDocument()
    expect(mockAuthorizeHelper).not.toHaveBeenCalled()
  })

  it('renders bypassed routes without a decision', () => {
    renderGuard({ resourceKey: CEDARLING_BYPASS, action: CEDAR_ACTIONS.READ, children: page })
    expect(screen.getByTestId('PAGE')).toBeInTheDocument()
    expect(mockAuthorizeHelper).not.toHaveBeenCalled()
  })

  it('denies a route that declares no permission', () => {
    renderGuard({ children: page })
    expect(screen.getByTestId('MISSING')).toBeInTheDocument()
    expect(mockAuthorizeHelper).not.toHaveBeenCalled()
  })
})
