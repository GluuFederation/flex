import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import ActivityBarChart from 'Plugins/admin/components/Metrics/components/ActivityBarChart'
import type { ActivityDataPoint } from 'Plugins/admin/components/Metrics/components/ActivityBarChart'

jest.mock('recharts', () => {
  const actual = jest.requireActual('recharts')
  const reactLib = jest.requireActual('react') as typeof import('react')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) =>
      reactLib.cloneElement(children, { width: 800, height: 400 }),
  }
})

const mockData: ActivityDataPoint[] = [
  { label: 'Feb 01', regSuccess: 80, regAttempts: 120, authAttempts: 150, authSuccess: 100 },
  { label: 'Feb 08', regSuccess: 90, regAttempts: 130, authAttempts: 160, authSuccess: 110 },
]

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('ActivityBarChart', () => {
  it('renders the chart title', () => {
    render(<ActivityBarChart title="Hourly Activity" data={mockData} />, { wrapper: Wrapper })
    expect(screen.getByText('Hourly Activity')).toBeInTheDocument()
  })

  it('renders with empty data without crashing', () => {
    render(<ActivityBarChart title="Empty Chart" data={[]} />, { wrapper: Wrapper })
    expect(screen.getByText('Empty Chart')).toBeInTheDocument()
  })

  it('renders a custom title', () => {
    render(<ActivityBarChart title="Monthly Activity Overview" data={mockData} />, {
      wrapper: Wrapper,
    })
    expect(screen.getByText('Monthly Activity Overview')).toBeInTheDocument()
  })

  it('renders multi-line tick labels split on "\\n"', () => {
    const multiLineData: ActivityDataPoint[] = [
      {
        label: 'Feb 01\nH12',
        regSuccess: 55,
        regAttempts: 100,
        authAttempts: 120,
        authSuccess: 80,
      },
    ]
    render(<ActivityBarChart title="Hourly Activity" data={multiLineData} />, { wrapper: Wrapper })
    expect(screen.getByText('Hourly Activity')).toBeInTheDocument()
    expect(screen.getByText('Feb 01')).toBeInTheDocument()
    expect(screen.getByText('H12')).toBeInTheDocument()
  })

  it('accepts optional barSize and barCategoryGap props', () => {
    render(
      <ActivityBarChart
        title="Monthly Activity"
        data={mockData}
        barSize={18}
        barCategoryGap="35%"
      />,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('Monthly Activity')).toBeInTheDocument()
  })
})
