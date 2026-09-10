import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import AggregationTab from 'Plugins/fido/components/Metrics/components/AggregationTab'

jest.mock('Plugins/fido/components/Metrics/hooks', () => ({
  useAggregationMetrics: jest.fn(() => ({ data: undefined, isLoading: false, isFetching: false })),
}))

jest.mock('Plugins/fido/components/Metrics/components/ActivityBarChart', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="activity-bar-chart">{title}</div>,
}))

jest.mock('Plugins/fido/components/Metrics/components/DurationHeatmap', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="duration-heatmap">{title}</div>,
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const getAggTrigger = (): HTMLElement => screen.getByRole('button', { expanded: false })

const selectAggType = (name: RegExp) => {
  fireEvent.click(getAggTrigger())
  fireEvent.click(screen.getByRole('option', { name }))
}

describe('AggregationTab', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the aggregation type dropdown', () => {
    render(<AggregationTab filterSheetOpen={false} onFilterSheetClose={jest.fn()} />, {
      wrapper: Wrapper,
    })
    expect(getAggTrigger()).toBeInTheDocument()
  })

  it('has Hourly selected by default', () => {
    render(<AggregationTab filterSheetOpen={false} onFilterSheetClose={jest.fn()} />, {
      wrapper: Wrapper,
    })
    expect(getAggTrigger()).toHaveTextContent(/hourly/i)
  })

  it('renders all aggregation type options', () => {
    render(<AggregationTab filterSheetOpen={false} onFilterSheetClose={jest.fn()} />, {
      wrapper: Wrapper,
    })
    fireEvent.click(getAggTrigger())
    const options = screen.getAllByRole('option').map((o) => o.textContent)
    expect(options).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/hourly/i),
        expect.stringMatching(/daily/i),
        expect.stringMatching(/weekly/i),
        expect.stringMatching(/monthly/i),
      ]),
    )
  })

  it('renders the Apply button', () => {
    render(<AggregationTab filterSheetOpen={false} onFilterSheetClose={jest.fn()} />, {
      wrapper: Wrapper,
    })
    expect(screen.getByText('Apply')).toBeInTheDocument()
  })

  it('renders ActivityBarChart and DurationHeatmap with hourly default applied range', () => {
    render(<AggregationTab filterSheetOpen={false} onFilterSheetClose={jest.fn()} />, {
      wrapper: Wrapper,
    })
    expect(screen.getAllByTestId('activity-bar-chart').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('duration-heatmap').length).toBeGreaterThan(0)
  })

  it('switches to daily view after selecting daily and clicking Apply', () => {
    render(<AggregationTab filterSheetOpen={false} onFilterSheetClose={jest.fn()} />, {
      wrapper: Wrapper,
    })
    selectAggType(/daily/i)
    fireEvent.click(screen.getByText('Apply'))
    const activityChart = screen.getAllByTestId('activity-bar-chart')[0]!
    const heatmap = screen.getAllByTestId('duration-heatmap')[0]!
    expect(activityChart.textContent).toMatch(/daily/i)
    expect(heatmap.textContent).toMatch(/daily/i)
  })

  it('switches to weekly view after selecting weekly and clicking Apply', () => {
    render(<AggregationTab filterSheetOpen={false} onFilterSheetClose={jest.fn()} />, {
      wrapper: Wrapper,
    })
    selectAggType(/weekly/i)
    fireEvent.click(screen.getByText('Apply'))
    const activityChart = screen.getAllByTestId('activity-bar-chart')[0]!
    const heatmap = screen.getAllByTestId('duration-heatmap')[0]!
    expect(activityChart.textContent).toMatch(/weekly/i)
    expect(heatmap.textContent).toMatch(/weekly/i)
  })

  it('switches to monthly view after selecting monthly and clicking Apply', () => {
    render(<AggregationTab filterSheetOpen={false} onFilterSheetClose={jest.fn()} />, {
      wrapper: Wrapper,
    })
    selectAggType(/monthly/i)
    fireEvent.click(screen.getByText('Apply'))
    const activityChart = screen.getAllByTestId('activity-bar-chart')[0]!
    const heatmap = screen.getAllByTestId('duration-heatmap')[0]!
    expect(activityChart.textContent).toMatch(/monthly/i)
    expect(heatmap.textContent).toMatch(/monthly/i)
  })

  it('renders chart data from API entries when available', () => {
    const { useAggregationMetrics } = jest.requireMock('Plugins/fido/components/Metrics/hooks')
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
    render(<AggregationTab filterSheetOpen={false} onFilterSheetClose={jest.fn()} />, {
      wrapper: Wrapper,
    })
    expect(screen.getAllByTestId('activity-bar-chart').length).toBeGreaterThan(0)
  })
})
