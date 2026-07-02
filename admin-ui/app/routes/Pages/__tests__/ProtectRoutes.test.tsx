import React from 'react'
import { render, screen } from '@testing-library/react'
import ProtectedRoute from '../ProtectRoutes'

type AuthState = { authReducer: { isAuthenticated: boolean } }

const mockSelector = jest.fn()
jest.mock('@/redux/hooks', () => ({
  useAppSelector: <T,>(fn: (s: AuthState) => T) => mockSelector(fn),
}))
jest.mock('@/helpers/navigation', () => ({ ROUTES: { ROOT: '/' } }))
jest.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
}))

const setAuthenticated = (isAuthenticated: boolean) =>
  mockSelector.mockImplementation(<T,>(fn: (s: AuthState) => T) =>
    fn({ authReducer: { isAuthenticated } }),
  )

describe('ProtectedRoute', () => {
  it('renders the protected children when authenticated', () => {
    setAuthenticated(true)
    render(
      <ProtectedRoute>
        <div data-testid="secret">secret</div>
      </ProtectedRoute>,
    )
    expect(screen.getByTestId('secret')).toBeInTheDocument()
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
  })

  it('redirects to the root route when not authenticated', () => {
    setAuthenticated(false)
    render(
      <ProtectedRoute>
        <div data-testid="secret">secret</div>
      </ProtectedRoute>,
    )
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/')
    expect(screen.queryByTestId('secret')).not.toBeInTheDocument()
  })
})
