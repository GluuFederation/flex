import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import RolePermissionMappingPage from 'Plugins/admin/components/Mapping/RolePermissionMappingPage'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Security: 'security' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { security: [] },
}))

jest.mock('Plugins/admin/components/Mapping/hooks', () => ({
  useMappingData: jest.fn(() => ({
    mapping: [
      {
        role: 'api-admin',
        permissions: ['https://jans.io/oauth/config/read-all'],
      },
    ],
    permissions: [{ permission: 'https://jans.io/oauth/config/read-all' }],
    isLoading: false,
    isError: false,
  })),
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('RolePermissionMappingPage', () => {
  it('renders the role-permission mapping page', () => {
    render(<RolePermissionMappingPage />, { wrapper: Wrapper })
    expect(screen.getByText(/api-admin/i)).toBeInTheDocument()
  })

  it('shows the info description text', () => {
    render(<RolePermissionMappingPage />, { wrapper: Wrapper })
    const cedarlingLinks = screen.getAllByText(/Cedarling/i)
    expect(cedarlingLinks.length).toBeGreaterThan(0)
  })
})
