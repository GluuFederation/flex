import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import ActivityBarChart from 'Plugins/admin/components/Metrics/components/ActivityBarChart'
import type { ActivityDataPoint } from 'Plugins/admin/components/Metrics/types'

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

  it('applies barSize and barCategoryGap props to the rendered bars', () => {
    const { container } = render(
      <ActivityBarChart
        title="Monthly Activity"
        data={mockData}
        barSize={18}
        barCategoryGap="35%"
      />,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('Monthly Activity')).toBeInTheDocument()

    const barRects = container.querySelectorAll<SVGRectElement>(
      '.recharts-bar-rectangle path, .recharts-rectangle',
    )
    expect(barRects.length).toBeGreaterThan(0)

    const widths = Array.from(barRects)
      .map((node) => {
        const widthAttr = node.getAttribute('width')
        if (widthAttr) return Number(widthAttr)
        const d = node.getAttribute('d')
        if (!d) return NaN
        const match = d.match(/h\s?(-?\d+(?:\.\d+)?)/)
        return match ? Math.abs(Number(match[1])) : NaN
      })
      .filter((w) => Number.isFinite(w) && w > 0)

    expect(widths.length).toBeGreaterThan(0)
    widths.forEach((w) => expect(w).toBe(18))

    const xs = Array.from(barRects)
      .map((node) => {
        const xAttr = node.getAttribute('x')
        if (xAttr) return Number(xAttr)
        const d = node.getAttribute('d')
        const match = d?.match(/M\s?(-?\d+(?:\.\d+)?)/)
        return match ? Number(match[1]) : NaN
      })
      .filter((x) => Number.isFinite(x))
      .sort((a, b) => a - b)

    const uniqueXs = Array.from(new Set(xs))
    expect(uniqueXs.length).toBeGreaterThanOrEqual(2)
    const adjacentGap = uniqueXs[1]! - uniqueXs[0]!
    expect(adjacentGap).toBeGreaterThan(0)
  })
})
