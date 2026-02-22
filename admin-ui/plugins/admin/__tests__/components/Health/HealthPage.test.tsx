import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import HealthPage from 'Plugins/admin/components/Health/HealthPage'

const mockRefetch = jest.fn()

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
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('HealthPage', () => {
  it('renders services health status', () => {
    render(<HealthPage />, { wrapper: Wrapper })
    expect(screen.getByText('Jans Auth')).toBeInTheDocument()
    expect(screen.getByText('Jans Config Api')).toBeInTheDocument()
  })

  it('shows active status badges', () => {
    render(<HealthPage />, { wrapper: Wrapper })
    const badges = screen.getAllByText('Active')
    expect(badges.length).toBe(2)
  })
})
