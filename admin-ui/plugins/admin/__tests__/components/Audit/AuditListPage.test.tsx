import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import AuditListPage from 'Plugins/admin/components/Audit/AuditListPage'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { AuditLogs: 'auditlogs' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { auditlogs: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetAuditData: jest.fn(() => ({
    data: { totalEntriesCount: 0, entries: [] },
    isLoading: false,
    isFetching: false,
    isError: false,
  })),
  GetAuditDataParams: {},
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('AuditListPage', () => {
  it('renders the audit log page with search toolbar', () => {
    render(<AuditListPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Search pattern/i)).toBeInTheDocument()
    expect(screen.getByText(/Start Date/i)).toBeInTheDocument()
  })

  it('shows no data message when entries are empty', () => {
    render(<AuditListPage />, { wrapper: Wrapper })
    expect(screen.getByText(/No data/i)).toBeInTheDocument()
  })
})
