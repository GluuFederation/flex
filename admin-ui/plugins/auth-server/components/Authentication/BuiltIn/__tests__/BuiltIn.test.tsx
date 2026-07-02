import { render, screen } from '@testing-library/react'

// Acrs has its own suite; stub it to a marker that echoes the isBuiltIn prop so
// this test asserts BuiltIn wires the built-in filter through.
jest.mock('../../Acrs/Acrs', () => ({
  __esModule: true,
  default: ({ isBuiltIn }: { isBuiltIn?: boolean }) => (
    <div data-testid="acrs" data-built-in={String(!!isBuiltIn)} />
  ),
}))

import BuiltIn from '../BuiltIn'

describe('BuiltIn', () => {
  it('renders the ACR list filtered to built-in methods', () => {
    render(<BuiltIn />)
    const acrs = screen.getByTestId('acrs')
    expect(acrs).toBeInTheDocument()
    expect(acrs).toHaveAttribute('data-built-in', 'true')
  })
})
