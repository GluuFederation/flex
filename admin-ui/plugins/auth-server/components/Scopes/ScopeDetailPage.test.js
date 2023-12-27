import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeDetailPage from './ScopeDetailPage'
import scopes from './scopes.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'

const Wrapper = ({ children }) => <AppTestWrapper>{children}</AppTestWrapper>
const permissions = [
  'https://jans.io/oauth/config/scopes.readonly',
  'https://jans.io/oauth/config/scopes.write',
  'https://jans.io/oauth/config/scopes.delete',
]
const scope = scopes[0]

it('Should render the scope detail page properly', () => {
  render(<ScopeDetailPage row={scope} permissions={permissions} />, {
    wrapper: Wrapper,
  })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Default Scope/)
  screen.getByText(/Attributes/)
})
