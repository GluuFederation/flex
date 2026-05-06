import React from 'react'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import DurationHeatmap from 'Plugins/admin/components/Metrics/components/DurationHeatmap'
import type { HeatmapData } from 'Plugins/admin/components/Metrics/types'

const mockHeatmapData: HeatmapData = {
  rows: ['Registration', 'Authentication'],
  cols: ['Feb 02', 'Feb 08', 'Feb 09'],
  data: [
    [150, 225, 250],
    [170, 200, 165],
  ],
  minVal: 100,
  maxVal: 300,
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('DurationHeatmap', () => {
  it('renders the chart title', () => {
    render(<DurationHeatmap title="Daily Duration Heatmap" heatmapData={mockHeatmapData} />, {
      wrapper: Wrapper,
    })
    expect(screen.getByText('Daily Duration Heatmap')).toBeInTheDocument()
  })

  it('renders row labels', () => {
    render(<DurationHeatmap title="Heatmap" heatmapData={mockHeatmapData} />, { wrapper: Wrapper })
    expect(screen.getByText('Registration')).toBeInTheDocument()
    expect(screen.getByText('Authentication')).toBeInTheDocument()
  })

  it('renders column labels', () => {
    render(<DurationHeatmap title="Heatmap" heatmapData={mockHeatmapData} />, { wrapper: Wrapper })
    expect(screen.getAllByText('Feb 02').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Feb 08').length).toBeGreaterThan(0)
  })

  it('renders an optional caption', () => {
    render(
      <DurationHeatmap
        title="Heatmap"
        heatmapData={mockHeatmapData}
        caption="Avg duration per period"
      />,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('Avg duration per period')).toBeInTheDocument()
  })

  it('renders an x-axis label when provided', () => {
    render(
      <DurationHeatmap title="Heatmap" heatmapData={mockHeatmapData} xAxisLabel="Time (hours)" />,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('Time (hours)')).toBeInTheDocument()
  })

  it('renders a y-axis label when provided', () => {
    render(<DurationHeatmap title="Heatmap" heatmapData={mockHeatmapData} yAxisLabel="Metrics" />, {
      wrapper: Wrapper,
    })
    expect(screen.getByText('Metrics')).toBeInTheDocument()
  })

  it('renders cell values', () => {
    render(<DurationHeatmap title="Heatmap" heatmapData={mockHeatmapData} />, { wrapper: Wrapper })
    expect(screen.getAllByText('150').length).toBeGreaterThan(0)
    expect(screen.getAllByText('170').length).toBeGreaterThan(0)
  })

  it('renders in compact mode without crashing', () => {
    render(<DurationHeatmap title="Compact Heatmap" heatmapData={mockHeatmapData} compact />, {
      wrapper: Wrapper,
    })
    expect(screen.getByText('Compact Heatmap')).toBeInTheDocument()
  })

  it('renders with colLabelsBottom without crashing', () => {
    render(<DurationHeatmap title="Heatmap" heatmapData={mockHeatmapData} colLabelsBottom />, {
      wrapper: Wrapper,
    })
    expect(screen.getByText('Heatmap')).toBeInTheDocument()
  })

  it('renders with colsSub labels', () => {
    const dataWithSubs: HeatmapData = {
      ...mockHeatmapData,
      cols: ['Week 1', 'Week 2'],
      colsSub: ['Feb-02', 'Feb-09'],
      data: [
        [188, 243],
        [185, 190],
      ],
    }
    render(<DurationHeatmap title="Weekly Heatmap" heatmapData={dataWithSubs} />, {
      wrapper: Wrapper,
    })
    expect(screen.getAllByText('Week 1').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Feb-02').length).toBeGreaterThan(0)
  })
})
