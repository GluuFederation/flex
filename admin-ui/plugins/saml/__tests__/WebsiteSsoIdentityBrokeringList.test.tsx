import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

type IdpQueryParams = { startIndex: number; limit: number; pattern?: string }

const mockState: {
  entries: { inum: string; displayName: string; enabled: boolean }[]
  canRead: boolean
  lastQueryParams: IdpQueryParams | null
} = {
  entries: [
    { inum: 'IDP-1', displayName: 'Google IdP', enabled: true },
    { inum: 'IDP-2', displayName: 'Okta IdP', enabled: false },
  ],
  canRead: true,
  lastQueryParams: null,
}

jest.mock('Plugins/saml/components/hooks', () => ({
  useIdentityProviders: (params: IdpQueryParams) => {
    mockState.lastQueryParams = params
    return {
      data: { entries: mockState.entries, totalEntriesCount: mockState.entries.length },
      isLoading: false,
      isFetching: false,
    }
  },
  useDeleteIdentityProvider: () => ({ mutateAsync: jest.fn(), isPending: false }),
}))

jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: () => ({
    canRead: mockState.canRead,
    canWrite: true,
    canDelete: true,
  }),
}))

jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: () => ({ navigateToRoute: jest.fn() }),
  ROUTES: { SAML_IDP_EDIT: 'saml-idp-edit', SAML_IDP_ADD: 'saml-idp-add' },
}))

jest.mock('Routes/Apps/Gluu/GluuDialog', () => ({
  __esModule: true,
  default: () => null,
}))

import WebsiteSsoIdentityBrokeringList from 'Plugins/saml/components/WebsiteSsoIdentityBrokeringList'

const renderList = () =>
  render(
    <AppTestWrapper>
      <WebsiteSsoIdentityBrokeringList />
    </AppTestWrapper>,
  )

describe('WebsiteSsoIdentityBrokeringList', () => {
  beforeEach(() => {
    mockState.canRead = true
    mockState.lastQueryParams = null
  })

  it('renders rows from the identity providers data', () => {
    renderList()
    expect(screen.getByText('IDP-1')).toBeInTheDocument()
    expect(screen.getByText('Google IdP')).toBeInTheDocument()
    expect(screen.getByText('IDP-2')).toBeInTheDocument()
    expect(screen.getByText('Okta IdP')).toBeInTheDocument()
  })

  it('renders the inum column header', () => {
    renderList()
    expect(screen.getByText(/inum/i)).toBeInTheDocument()
  })

  it('queries identity providers with the initial paging params', () => {
    renderList()
    expect(mockState.lastQueryParams).toEqual(expect.objectContaining({ startIndex: 0 }))
  })

  it('does not render the rows when the user lacks read permission', () => {
    mockState.canRead = false
    renderList()
    expect(screen.queryByText('Google IdP')).not.toBeInTheDocument()
  })
})
