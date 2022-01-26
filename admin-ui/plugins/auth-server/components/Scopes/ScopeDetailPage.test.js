import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeDetailPage from './ScopeDetailPage'
import i18n from '../../../../app/i18n'
import scopes from './scopes'
import { I18nextProvider } from 'react-i18next'

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)
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
  screen.getByText(/attributes/)
})
