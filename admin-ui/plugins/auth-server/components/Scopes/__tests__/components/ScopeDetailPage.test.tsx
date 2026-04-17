import React from 'react'
import { render, screen } from '@testing-library/react'
import { ScopeDetailPage } from 'Plugins/auth-server/components/Scopes'
import scopes from '../fixtures/mockScopes'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type { Scope } from 'Plugins/auth-server/components/Scopes/types'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const scope = scopes[0] as Scope

it('Should render the scope detail page properly', () => {
  render(<ScopeDetailPage row={scope} />, {
    wrapper: Wrapper,
  })
  expect(screen.getByText(/Display Name/)).toBeInTheDocument()
  expect(screen.getByText(/Description/)).toBeInTheDocument()
  expect(screen.getByText(/Default Scope/)).toBeInTheDocument()
  expect(screen.getByText(/Attributes/)).toBeInTheDocument()
})
