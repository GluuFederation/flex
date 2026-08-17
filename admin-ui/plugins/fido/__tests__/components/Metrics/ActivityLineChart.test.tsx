import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import ActivityLineChart from 'Plugins/fido/components/Metrics/components/ActivityLineChart'
import type { ActivityDataPoint } from 'Plugins/fido/components/Metrics/types'

jest.mock('recharts', () => {
  const actual = jest.requireActual('recharts')
  const reactLib = jest.requireActual('react') as typeof import('react')
  return {
    ...actual,
    ResponsiveContainer: ({
      children,
    }: {
      children: React.ReactElement<{ width?: number; height?: number }>
    }) => reactLib.cloneElement(children, { width: 800, height: 400 }),
  }
})

const mockData: ActivityDataPoint[] = [
  { label: 'Feb 01', regSuccess: 80, regAttempts: 120, authAttempts: 150, authSuccess: 100 },
  { label: 'Feb 08', regSuccess: 90, regAttempts: 130, authAttempts: 160, authSuccess: 110 },
]

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('ActivityLineChart', () => {
  it('renders the chart title', () => {
    render(<ActivityLineChart title="Hourly Trend" data={mockData} />, { wrapper: Wrapper })

    expect(screen.getByText('Hourly Trend')).toBeInTheDocument()
  })

  it('draws one line per activity series', () => {
    const { container } = render(<ActivityLineChart title="Hourly Trend" data={mockData} />, {
      wrapper: Wrapper,
    })

    expect(container.querySelectorAll('.recharts-line')).toHaveLength(4)
  })

  it('renders with empty data without crashing', () => {
    render(<ActivityLineChart title="Empty Trend" data={[]} />, { wrapper: Wrapper })

    expect(screen.getByText('Empty Trend')).toBeInTheDocument()
  })

  it('splits multi-line tick labels the same way the bar chart does', () => {
    render(
      <ActivityLineChart
        title="Hourly Trend"
        data={[
          {
            label: 'Feb 01\nH12',
            regSuccess: 55,
            regAttempts: 100,
            authAttempts: 120,
            authSuccess: 80,
          },
        ]}
      />,
      { wrapper: Wrapper },
    )

    expect(screen.getByText('Feb 01')).toBeInTheDocument()
    expect(screen.getByText('H12')).toBeInTheDocument()
  })
})

describe('ActivityLineChart density', () => {
  const bucket = (i: number): ActivityDataPoint => ({
    label: `B${i}`,
    regSuccess: i % 3,
    regAttempts: i % 4,
    authAttempts: i % 5,
    authSuccess: i % 2,
  })

  it('marks every point while the buckets stay readable', () => {
    const { container } = render(
      <ActivityLineChart
        title="Daily Trend"
        data={Array.from({ length: 14 }, (_, i) => bucket(i))}
      />,
      { wrapper: Wrapper },
    )

    expect(container.querySelectorAll('.recharts-line-dots circle').length).toBeGreaterThan(0)
  })

  it('drops the markers once they would merge into a band', () => {
    const { container } = render(
      <ActivityLineChart
        title="Hourly Trend"
        data={Array.from({ length: 400 }, (_, i) => bucket(i))}
      />,
      { wrapper: Wrapper },
    )

    expect(container.querySelectorAll('.recharts-line-dots circle')).toHaveLength(0)
    expect(container.querySelectorAll('.recharts-line')).toHaveLength(4)
  })
})
