import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import OnboardingTimeChart from 'Plugins/admin/components/Metrics/components/OnboardingTimeChart'
import type { MetricsDateRange } from 'Plugins/admin/components/Metrics/types'
import dayjs from 'dayjs'

jest.mock('Plugins/admin/components/Metrics/hooks', () => ({
  usePerformanceAnalytics: jest.fn(() => ({ data: undefined, isLoading: false })),
}))

jest.mock('recharts', () => {
  const actual = jest.requireActual('recharts')
  const reactLib = jest.requireActual('react') as typeof import('react')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) =>
      reactLib.cloneElement(children, { width: 800, height: 320 }),
  }
})

const mockDateRange: MetricsDateRange = {
  startDate: dayjs('2024-01-01'),
  endDate: dayjs('2024-01-31'),
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('OnboardingTimeChart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the chart title', () => {
    render(<OnboardingTimeChart dateRange={null} />, { wrapper: Wrapper })
    expect(screen.getByText('Onboarding Time Graph')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<OnboardingTimeChart dateRange={null} />, { wrapper: Wrapper })
    expect(
      screen.getByText(/Authentication vs Registration: Time Performance/i),
    ).toBeInTheDocument()
  })

  it('renders without crashing when given a date range', () => {
    render(<OnboardingTimeChart dateRange={mockDateRange} />, { wrapper: Wrapper })
    expect(screen.getByText('Onboarding Time Graph')).toBeInTheDocument()
  })

  it('uses API performance data when available', () => {
    const { usePerformanceAnalytics } = jest.requireMock('Plugins/admin/components/Metrics/hooks')
    usePerformanceAnalytics.mockReturnValueOnce({
      data: {
        authenticationMinDuration: 50,
        authenticationAvgDuration: 150,
        authenticationMaxDuration: 300,
        registrationMinDuration: 80,
        registrationAvgDuration: 200,
        registrationMaxDuration: 450,
      },
      isLoading: false,
    })
    render(<OnboardingTimeChart dateRange={mockDateRange} />, { wrapper: Wrapper })
    expect(screen.getByText('Onboarding Time Graph')).toBeInTheDocument()
    expect(screen.getAllByText('150').length).toBeGreaterThan(0)
  })
})
