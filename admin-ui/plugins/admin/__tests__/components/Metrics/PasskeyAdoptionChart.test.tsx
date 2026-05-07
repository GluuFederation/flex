import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import PasskeyAdoptionChart from 'Plugins/admin/components/Metrics/components/PasskeyAdoptionChart'
import type { MetricsDateRange } from 'Plugins/admin/components/Metrics/types'
import dayjs from 'dayjs'

jest.mock('Plugins/admin/components/Metrics/hooks', () => ({
  useAdoptionMetrics: jest.fn(() => ({ data: undefined, isLoading: false })),
}))

const mockDateRange: MetricsDateRange = {
  startDate: dayjs('2024-01-01'),
  endDate: dayjs('2024-01-31'),
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('PasskeyAdoptionChart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the chart title', () => {
    render(<PasskeyAdoptionChart dateRange={null} />, { wrapper: Wrapper })
    expect(screen.getByText('Passkey Adoption Rate')).toBeInTheDocument()
  })

  it('renders mock stats labels when no API data', () => {
    render(<PasskeyAdoptionChart dateRange={null} />, { wrapper: Wrapper })
    expect(screen.getByText(/New Registered Users/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Registered Users/i)).toBeInTheDocument()
    expect(screen.getByText(/Adoption Passkey Rate/i)).toBeInTheDocument()
  })

  it('renders with a date range without crashing', () => {
    render(<PasskeyAdoptionChart dateRange={mockDateRange} />, { wrapper: Wrapper })
    expect(screen.getByText('Passkey Adoption Rate')).toBeInTheDocument()
  })

  it('uses API values when adoption data is available', () => {
    const { useAdoptionMetrics } = jest.requireMock('Plugins/admin/components/Metrics/hooks')
    useAdoptionMetrics.mockReturnValueOnce({
      data: { newUsers: 5, totalUniqueUsers: 20, adoptionRate: 25 },
      isLoading: false,
    })
    render(<PasskeyAdoptionChart dateRange={mockDateRange} />, { wrapper: Wrapper })
    expect(screen.getByText(/New Registered Users/i)).toBeInTheDocument()
  })

  it('falls back to mock values when API returns zeros', () => {
    const { useAdoptionMetrics } = jest.requireMock('Plugins/admin/components/Metrics/hooks')
    useAdoptionMetrics.mockReturnValueOnce({
      data: { newUsers: 0, totalUniqueUsers: 0, adoptionRate: 0 },
      isLoading: false,
    })
    render(<PasskeyAdoptionChart dateRange={mockDateRange} />, { wrapper: Wrapper })
    expect(screen.getByText('Adoption Rate')).toBeInTheDocument()
  })
})
