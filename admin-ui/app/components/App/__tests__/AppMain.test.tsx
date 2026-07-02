import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'

// Router and the route selector are covered by their own suites; stub them so
// this test targets AppMain's composition and error wiring.
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: PropsWithChildren<{ basename?: string }>) => (
    <div data-testid="router">{children}</div>
  ),
}))

jest.mock('../AuthenticatedRouteSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="route-selector">routes</div>,
}))

jest.mock('Routes/Apps/Gluu/GluuErrorScreen', () => ({
  __esModule: true,
  default: () => <div data-testid="error-screen">error</div>,
}))

type ErrorBoundaryProps = PropsWithChildren<{
  FallbackComponent: React.ComponentType
  // Loosely typed so a test can pass a non-Error value through the onError path.
  onError: (error: Error | string, info: { componentStack: string }) => void
}>

// Capture the ErrorBoundary props so we can assert AppMain's onError forwarding.
let capturedProps: ErrorBoundaryProps | null = null
jest.mock('react-error-boundary', () => ({
  ErrorBoundary: (props: ErrorBoundaryProps) => {
    capturedProps = props
    return <div data-testid="error-boundary">{props.children}</div>
  },
}))

const mockLogUiCrash = jest.fn()
jest.mock('@/utils/logUiCrash', () => ({
  __esModule: true,
  default: (error: Error, stack?: string | null) => mockLogUiCrash(error, stack),
}))

import AppMain from '../AppMain'

beforeEach(() => {
  capturedProps = null
  mockLogUiCrash.mockReset()
})

describe('AppMain', () => {
  it('nests the route selector inside the router and error boundary', () => {
    render(<AppMain />)
    expect(screen.getByTestId('router')).toBeInTheDocument()
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('route-selector')).toBeInTheDocument()
  })

  it('wires GluuErrorScreen as the fallback component', () => {
    render(<AppMain />)
    const Fallback = capturedProps?.FallbackComponent as React.ComponentType
    render(<Fallback />)
    expect(screen.getByTestId('error-screen')).toBeInTheDocument()
  })

  it('logs a thrown Error through logUiCrash with the component stack', () => {
    render(<AppMain />)
    const err = new Error('boom')
    capturedProps?.onError(err, { componentStack: 'at <X>' })
    expect(mockLogUiCrash).toHaveBeenCalledWith(err, 'at <X>')
  })

  it('coerces a non-Error value into an Error before logging', () => {
    render(<AppMain />)
    capturedProps?.onError('string failure', { componentStack: 'at <Y>' })
    const [loggedError, stack] = mockLogUiCrash.mock.calls[0]
    expect(loggedError).toBeInstanceOf(Error)
    expect((loggedError as Error).message).toBe('string failure')
    expect(stack).toBe('at <Y>')
  })
})
