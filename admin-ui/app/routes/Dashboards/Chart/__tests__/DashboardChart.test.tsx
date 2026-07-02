import React, { type PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import DashboardChart from '../DashboardChart'
import { CHART_CONSTANTS } from '../DashboardChart.style'
import type { MauStatEntry } from '../../types'

// Recharts renders to canvas-like SVG that jsdom can't measure; stub the pieces
// down to markers that expose the computed data/axis props so the assertions
// target this component's month-gap-filling and tick math, not recharts itself.
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: PropsWithChildren) => (
    <div data-testid="chart">{children}</div>
  ),
  AreaChart: ({ data, children }: PropsWithChildren<{ data: MauStatEntry[] }>) => (
    <div data-testid="area-chart" data-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Area: ({ dataKey }: { dataKey: string }) => <div data-testid="area" data-key={dataKey} />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: ({ domain, ticks }: { domain: number[]; ticks: number[] }) => (
    <div
      data-testid="yaxis"
      data-domain={JSON.stringify(domain)}
      data-ticks={JSON.stringify(ticks)}
    />
  ),
  Tooltip: () => <div data-testid="tooltip" />,
  CartesianGrid: () => <div data-testid="grid" />,
}))

jest.mock('../TooltipDesign', () => ({ __esModule: true, default: () => null }))
jest.mock('@mui/material', () => ({ GlobalStyles: () => null }))
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

const entry = (month: number, over: Partial<MauStatEntry> = {}): MauStatEntry =>
  ({
    month,
    mau: 0,
    client_credentials_access_token_count: 0,
    authz_code_access_token_count: 0,
    authz_code_idtoken_count: 0,
    ...over,
  }) as MauStatEntry

const renderChart = (props: Partial<React.ComponentProps<typeof DashboardChart>>) =>
  render(
    <DashboardChart
      statData={props.statData ?? []}
      startMonth={props.startMonth ?? '202401'}
      endMonth={props.endMonth ?? '202401'}
      {...props}
    />,
  )

const getData = () => JSON.parse(screen.getByTestId('area-chart').getAttribute('data-data') || '[]')
const getTicks = () => JSON.parse(screen.getByTestId('yaxis').getAttribute('data-ticks') || '[]')
const getDomain = () => JSON.parse(screen.getByTestId('yaxis').getAttribute('data-domain') || '[]')

describe('DashboardChart', () => {
  it('renders no data points when statData is null', () => {
    // The component guards against a null feed even though the prop type is non-null.
    const nullStatData = null as MauStatEntry[] | null as MauStatEntry[]
    renderChart({ statData: nullStatData })
    expect(getData()).toEqual([])
  })

  it('renders no data points when the start month is after the end month', () => {
    renderChart({ statData: [entry(202401)], startMonth: '202403', endMonth: '202401' })
    expect(getData()).toEqual([])
  })

  it('produces one point per month across the inclusive range', () => {
    renderChart({ startMonth: '202401', endMonth: '202403', statData: [] })
    expect(getData()).toHaveLength(3)
  })

  it('fills months with no matching entry with zeroed counts', () => {
    renderChart({ startMonth: '202401', endMonth: '202402', statData: [entry(202402, { mau: 5 })] })
    const data = getData()
    expect(data[0]).toMatchObject({ month: 202401, mau: 0 })
    expect(data[1]).toMatchObject({ month: 202402, mau: 5 })
  })

  it('carries a formatted month label onto each point', () => {
    renderChart({ startMonth: '202401', endMonth: '202401', statData: [entry(202401)] })
    expect(getData()[0].monthLabel).toBe('2024 01')
  })

  it('rounds the Y max up to the next tick interval above the summed token counts', () => {
    // Sum of the three token counts = 1500 -> already a multiple of 300, so 1500.
    renderChart({
      startMonth: '202401',
      endMonth: '202401',
      statData: [
        entry(202401, {
          authz_code_idtoken_count: 500,
          authz_code_access_token_count: 500,
          client_credentials_access_token_count: 500,
        }),
      ],
    })
    expect(getDomain()).toEqual([0, 1500])
  })

  it('never drops the Y max below the configured minimum', () => {
    renderChart({
      startMonth: '202401',
      endMonth: '202401',
      statData: [entry(202401, { mau: 10 })],
    })
    expect(getDomain()[1]).toBe(CHART_CONSTANTS.MIN_MAX)
  })

  it('generates ticks at the configured interval up to the max', () => {
    renderChart({ startMonth: '202401', endMonth: '202401', statData: [] })
    const ticks = getTicks()
    expect(ticks[0]).toBe(0)
    expect(ticks[1]).toBe(CHART_CONSTANTS.TICK_INTERVAL)
    expect(ticks[ticks.length - 1]).toBe(CHART_CONSTANTS.MIN_MAX)
  })

  it('renders one Area per legend series', () => {
    renderChart({ startMonth: '202401', endMonth: '202401', statData: [] })
    expect(screen.getAllByTestId('area')).toHaveLength(3)
  })
})
