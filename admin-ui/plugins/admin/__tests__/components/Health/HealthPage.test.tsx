import React from 'react'
import { render, screen } from '@testing-library/react'
import { AxiosError, AxiosHeaders } from 'axios'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import HealthPage from 'Plugins/admin/components/Health/HealthPage'

const mockRefetch = jest.fn()
const mockUseFido2HealthStatus = jest.fn()

jest.mock('Plugins/admin/components/Health/hooks', () => ({
  useHealthStatus: jest.fn(() => ({
    services: [
      { name: 'jans-auth', status: 'up' as const, lastChecked: new Date() },
      { name: 'jans-config-api', status: 'up' as const, lastChecked: new Date() },
    ],
    allServices: [],
    healthyCount: 2,
    totalCount: 2,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: mockRefetch,
  })),
  useFido2HealthStatus: () => mockUseFido2HealthStatus(),
}))

const fido2Up = {
  data: { name: 'fido2-metrics', status: 'up' as const, lastChecked: new Date() },
  isLoading: false,
  isFetching: false,
  isError: false,
  error: null,
  refetch: jest.fn(),
}

const fido2Failed = (status: number) => ({
  data: undefined,
  isLoading: false,
  isFetching: false,
  isError: true,
  error: new AxiosError(
    `Request failed with status code ${status}`,
    undefined,
    undefined,
    undefined,
    {
      status,
      statusText: '',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: '',
    },
  ),
  refetch: jest.fn(),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('HealthPage', () => {
  beforeEach(() => {
    mockUseFido2HealthStatus.mockReturnValue(fido2Up)
  })

  it('renders services health status', () => {
    render(<HealthPage />, { wrapper: Wrapper })
    expect(screen.getByText('Jans Auth')).toBeInTheDocument()
    expect(screen.getByText('Jans Config Api')).toBeInTheDocument()
  })

  it('shows active status badges', () => {
    render(<HealthPage />, { wrapper: Wrapper })
    const badges = screen.getAllByText('Active')
    expect(badges).toHaveLength(3)
  })

  it('hides the FIDO2 metrics card when the role is not allowed to check it', () => {
    mockUseFido2HealthStatus.mockReturnValue(fido2Failed(401))
    render(<HealthPage />, { wrapper: Wrapper })
    expect(screen.queryByText('Fido2 Metrics')).not.toBeInTheDocument()
    expect(screen.queryByText('Inactive')).not.toBeInTheDocument()
    expect(screen.getByText('2 of 2 services healthy')).toBeInTheDocument()
  })

  it('shows the FIDO2 metrics card as inactive when the check fails for another reason', () => {
    mockUseFido2HealthStatus.mockReturnValue(fido2Failed(500))
    render(<HealthPage />, { wrapper: Wrapper })
    expect(screen.getByText('Fido2 Metrics')).toBeInTheDocument()
    expect(screen.getByText('Inactive')).toBeInTheDocument()
    expect(screen.getByText('2 of 3 services healthy')).toBeInTheDocument()
  })
})
