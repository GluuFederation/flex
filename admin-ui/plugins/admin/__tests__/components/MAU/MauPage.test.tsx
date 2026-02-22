import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import MauPage from 'Plugins/admin/components/MAU/MauPage'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('Plugins/admin/components/MAU/hooks', () => ({
  useMauStats: jest.fn(() => ({
    data: [],
    summary: {
      totalMau: 0,
      totalTokens: 0,
      clientCredentialsTokens: 0,
      authCodeTokens: 0,
    },
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  })),
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { MAU: 'mau' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { mau: [] },
}))

describe('MauPage', () => {
  it('renders the MAU dashboard page', () => {
    render(<MauPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Usage & Token Analytics/i)).toBeInTheDocument()
  })
})
