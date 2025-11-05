import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeDetailPage from './ScopeDetailPage'
import scopes from './scopes.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import type { Scope } from './types'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const scope = scopes[0] as Scope

it('Should render the scope detail page properly', () => {
  render(<ScopeDetailPage row={scope} />, {
    wrapper: Wrapper,
  })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Default Scope/)
  screen.getByText(/Attributes/)
})
