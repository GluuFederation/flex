import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import AuditListPage from 'Plugins/admin/components/Audit/AuditListPage'
import { useGetAuditData } from 'JansConfigApi'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { AuditLogs: 'auditlogs' },
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

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AppTestWrapper>{children}</AppTestWrapper>
    </QueryClientProvider>
  )
}

describe('AuditListPage', () => {
  it('renders the audit log page with search toolbar', async () => {
    render(<AuditListPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Search pattern/i)).toBeInTheDocument()
    // the date fields arrive with the lazily loaded picker
    expect(await screen.findByText(/Start Date/i)).toBeInTheDocument()
  })

  it('shows no data message when entries are empty', () => {
    render(<AuditListPage />, { wrapper: Wrapper })
    expect(screen.getByText(/No data/i)).toBeInTheDocument()
  })

  it('refetches on every visit and includes entries from the current minute', () => {
    render(<AuditListPage />, { wrapper: Wrapper })
    const [params, options] = jest.mocked(useGetAuditData).mock.calls[0]
    expect(params?.end_date).toMatch(/T\d{2}:\d{2}:59$/)
    expect(options?.query?.refetchOnMount).toBe('always')
  })
})
