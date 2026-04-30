import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import PasskeyAuthChart from 'Plugins/admin/components/Metrics/components/PasskeyAuthChart'
import type { MetricsDateRange } from 'Plugins/admin/components/Metrics/types'
import dayjs from 'dayjs'

jest.mock('Plugins/admin/components/Metrics/hooks', () => ({
  useErrorsAnalytics: jest.fn(() => ({ data: undefined, isLoading: false })),
}))

const mockDateRange: MetricsDateRange = {
  startDate: dayjs('2024-01-01'),
  endDate: dayjs('2024-01-31'),
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('PasskeyAuthChart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the chart title', () => {
    render(<PasskeyAuthChart dateRange={null} />, { wrapper: Wrapper })
    expect(screen.getByText('Passkey Authentication')).toBeInTheDocument()
  })

  it('renders mock legend items when no API data', () => {
    render(<PasskeyAuthChart dateRange={null} />, { wrapper: Wrapper })
    expect(screen.getByText(/Success Rate/i)).toBeInTheDocument()
    expect(screen.getByText(/Error Rate/i)).toBeInTheDocument()
    expect(screen.getByText(/Drop Off Rate/i)).toBeInTheDocument()
  })

  it('renders with a date range prop without crashing', () => {
    render(<PasskeyAuthChart dateRange={mockDateRange} />, { wrapper: Wrapper })
    expect(screen.getByText('Passkey Authentication')).toBeInTheDocument()
  })

  it('renders API-driven legend items when data is available', () => {
    const { useErrorsAnalytics } = jest.requireMock('Plugins/admin/components/Metrics/hooks')
    useErrorsAnalytics.mockReturnValueOnce({
      data: { successRate: 0.8, failureRate: 0.1, dropOffRate: 0.1 },
      isLoading: false,
    })
    render(<PasskeyAuthChart dateRange={mockDateRange} />, { wrapper: Wrapper })
    expect(screen.getByText(/Success Rate/i)).toBeInTheDocument()
    expect(screen.getByText(/Error Rate/i)).toBeInTheDocument()
    expect(screen.getByText(/Drop Off Rate/i)).toBeInTheDocument()
  })
})
