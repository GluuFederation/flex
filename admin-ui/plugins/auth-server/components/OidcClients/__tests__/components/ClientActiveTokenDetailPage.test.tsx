import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientActiveTokenDetailPage from 'Plugins/auth-server/components/OidcClients/components/ClientActiveTokenDetailPage'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type { ClientActiveTokenDetailPageProps } from 'Plugins/auth-server/components/OidcClients/types'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const mockRow: ClientActiveTokenDetailPageProps = {
  row: {
    rowData: {
      tokenType: 'Bearer',
      scope: 'openid profile',
      deletable: true,
      creationDate: '2024-01-01T00:00:00.000Z',
      expirationDate: '2024-12-31T23:59:59.000Z',
      attributes: {},
    },
  },
}

it('Should render the token detail page without crashing', () => {
  const { container } = render(<ClientActiveTokenDetailPage {...mockRow} />, { wrapper: Wrapper })
  expect(container).toBeTruthy()
})

it('Should display the token type value', () => {
  render(<ClientActiveTokenDetailPage {...mockRow} />, { wrapper: Wrapper })
  expect(screen.getByText('Bearer')).toBeInTheDocument()
})

it('Should display the scope value', () => {
  render(<ClientActiveTokenDetailPage {...mockRow} />, { wrapper: Wrapper })
  expect(screen.getByText('openid profile')).toBeInTheDocument()
})

it('Should display deletable as true string', () => {
  render(<ClientActiveTokenDetailPage {...mockRow} />, { wrapper: Wrapper })
  expect(screen.getByText('true')).toBeInTheDocument()
})

it('Should render with missing optional fields gracefully', () => {
  const minimalRow: ClientActiveTokenDetailPageProps = {
    row: {
      rowData: {
        deletable: false,
      },
    },
  }
  const { container } = render(<ClientActiveTokenDetailPage {...minimalRow} />, {
    wrapper: Wrapper,
  })
  expect(container).toBeTruthy()
})

it('Should show double-dash placeholder when dates are absent', () => {
  const rowNoDate: ClientActiveTokenDetailPageProps = {
    row: { rowData: { tokenType: 'Bearer', scope: 'openid' } },
  }
  render(<ClientActiveTokenDetailPage {...rowNoDate} />, { wrapper: Wrapper })
  // TWO_DASH_PLACEHOLDER = '--' appears for missing dates
  expect(screen.getAllByText('--').length).toBeGreaterThanOrEqual(1)
})
