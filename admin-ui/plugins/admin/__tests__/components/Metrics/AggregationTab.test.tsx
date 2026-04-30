import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import AggregationTab from 'Plugins/admin/components/Metrics/components/AggregationTab'

jest.mock('Plugins/admin/components/Metrics/hooks', () => ({
  useAggregationMetrics: jest.fn(() => ({ data: undefined, isLoading: false, isFetching: false })),
}))

jest.mock('Plugins/admin/components/Metrics/components/ActivityBarChart', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="activity-bar-chart">{title}</div>,
}))

jest.mock('Plugins/admin/components/Metrics/components/DurationHeatmap', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="duration-heatmap">{title}</div>,
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('AggregationTab', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the aggregation type dropdown', () => {
    render(<AggregationTab />, { wrapper: Wrapper })
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  it('has no aggregation type selected by default (optional field)', () => {
    render(<AggregationTab />, { wrapper: Wrapper })
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('')
  })

  it('renders all aggregation type options including the empty placeholder', () => {
    render(<AggregationTab />, { wrapper: Wrapper })
    const select = screen.getByRole('combobox') as HTMLSelectElement
    const options = Array.from(select.options).map((o) => o.value)
    expect(options).toContain('')
    expect(options).toContain('hourly')
    expect(options).toContain('daily')
    expect(options).toContain('weekly')
    expect(options).toContain('monthly')
  })

  it('renders the Apply button', () => {
    render(<AggregationTab />, { wrapper: Wrapper })
    expect(screen.getByText('Apply')).toBeInTheDocument()
  })

  it('renders ActivityBarChart and DurationHeatmap with hourly default applied range', () => {
    render(<AggregationTab />, { wrapper: Wrapper })
    expect(screen.getAllByTestId('activity-bar-chart').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('duration-heatmap').length).toBeGreaterThan(0)
  })

  it('switches to daily view after selecting daily and clicking Apply', () => {
    render(<AggregationTab />, { wrapper: Wrapper })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'daily' } })
    fireEvent.click(screen.getByText('Apply'))
    expect(screen.getAllByTestId('activity-bar-chart').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('duration-heatmap').length).toBeGreaterThan(0)
  })

  it('switches to weekly view after selecting weekly and clicking Apply', () => {
    render(<AggregationTab />, { wrapper: Wrapper })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'weekly' } })
    fireEvent.click(screen.getByText('Apply'))
    expect(screen.getAllByTestId('activity-bar-chart').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('duration-heatmap').length).toBeGreaterThan(0)
  })

  it('switches to monthly view after selecting monthly and clicking Apply', () => {
    render(<AggregationTab />, { wrapper: Wrapper })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'monthly' } })
    fireEvent.click(screen.getByText('Apply'))
    expect(screen.getAllByTestId('activity-bar-chart').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('duration-heatmap').length).toBeGreaterThan(0)
  })

  it('renders chart data from API entries when available', () => {
    const { useAggregationMetrics } = jest.requireMock('Plugins/admin/components/Metrics/hooks')
    useAggregationMetrics.mockReturnValueOnce({
      data: {
        entries: [
          {
            id: 'e1',
            startTime: '2024-01-01T00:00:00Z',
            registrationSuccesses: 10,
            registrationAttempts: 20,
            authenticationAttempts: 30,
            authenticationSuccesses: 25,
            registrationAvgDuration: 200,
            authenticationAvgDuration: 180,
          },
        ],
      },
      isLoading: false,
      isFetching: false,
    })
    render(<AggregationTab />, { wrapper: Wrapper })
    expect(screen.getAllByTestId('activity-bar-chart').length).toBeGreaterThan(0)
  })
})
