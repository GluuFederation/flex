import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import AnomalyBanner from 'Plugins/fido/components/SecurityMonitor/components/AnomalyBanner'
import SecurityKpiStrip from 'Plugins/fido/components/SecurityMonitor/components/SecurityKpiStrip'
import SecurityMonitorHeader from 'Plugins/fido/components/SecurityMonitor/components/SecurityMonitorHeader'
import TopTargetedAccountsChart from 'Plugins/fido/components/SecurityMonitor/components/TopTargetedAccountsChart'
import VelocityWatchHeatmap from 'Plugins/fido/components/SecurityMonitor/components/VelocityWatchHeatmap'
import {
  ANOMALY_KINDS,
  KPI_PERIODS,
  THREAT_LEVELS,
} from 'Plugins/fido/components/SecurityMonitor/constants'
import type {
  AnomalySummary,
  SecurityKpiSummary,
  UserFailureStat,
  VelocityMatrix,
} from 'Plugins/fido/components/SecurityMonitor/types'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const summary: SecurityKpiSummary = {
  failures: {
    [KPI_PERIODS.TODAY]: 1240,
    [KPI_PERIODS.LAST_7_DAYS]: 5300,
    [KPI_PERIODS.THIS_MONTH]: 18340,
  },
  attempts: {
    [KPI_PERIODS.TODAY]: 9000,
    [KPI_PERIODS.LAST_7_DAYS]: 42000,
    [KPI_PERIODS.THIS_MONTH]: 150000,
  },
  successRate: {
    [KPI_PERIODS.TODAY]: 87,
    [KPI_PERIODS.LAST_7_DAYS]: 91,
    [KPI_PERIODS.THIS_MONTH]: 93,
  },
  failureDelta: {
    [KPI_PERIODS.TODAY]: { value: 83, isIncrease: true },
    [KPI_PERIODS.LAST_7_DAYS]: { value: 12, isIncrease: false },
    [KPI_PERIODS.THIS_MONTH]: { value: 18, isIncrease: true },
  },
  successRateDelta: {
    [KPI_PERIODS.TODAY]: { value: 7, isIncrease: false },
    [KPI_PERIODS.LAST_7_DAYS]: { value: 2, isIncrease: true },
    [KPI_PERIODS.THIS_MONTH]: { value: 1, isIncrease: true },
  },
  anomalies: {
    [KPI_PERIODS.TODAY]: 3,
    [KPI_PERIODS.LAST_7_DAYS]: 14,
    [KPI_PERIODS.THIS_MONTH]: 47,
  },
  anomaliesDelta: {
    [KPI_PERIODS.TODAY]: { value: 1, isIncrease: true },
    [KPI_PERIODS.LAST_7_DAYS]: { value: 5, isIncrease: true },
    [KPI_PERIODS.THIS_MONTH]: { value: 12, isIncrease: true },
  },
}

const criticalUser: UserFailureStat = {
  username: 'john',
  failures: 148,
  failed: 100,
  abandoned: 48,
  successes: 0,
  outcomes: 148,
  failureRate: 100,
  lastSeen: 2,
  threatLevel: THREAT_LEVELS.CRITICAL,
}

const warningUser: UserFailureStat = {
  ...criticalUser,
  username: 'berry',
  failures: 60,
  threatLevel: THREAT_LEVELS.MEDIUM,
}

const matrix: VelocityMatrix = {
  rows: ['user_001', 'user_003'],
  cols: ['00-04', '04-08', '08-12', '12-16', '16-20', '20-24'],
  cells: [
    [
      { value: 0, isAnomalous: false },
      { value: 1, isAnomalous: false },
      { value: 3, isAnomalous: false },
      { value: 4, isAnomalous: false },
      { value: 2, isAnomalous: false },
      { value: 1, isAnomalous: false },
    ],
    [
      { value: 0, isAnomalous: false },
      { value: 0, isAnomalous: false },
      { value: 2, isAnomalous: false },
      { value: 3, isAnomalous: false },
      { value: 142, isAnomalous: true },
      { value: 4, isAnomalous: false },
    ],
  ],
  anomalousUsers: 1,
}

const clearAnomalies: AnomalySummary = {
  count: 0,
  chips: [],
}

describe('SecurityMonitorHeader', () => {
  const renderHeader = (
    overrides: Partial<React.ComponentProps<typeof SecurityMonitorHeader>> = {},
  ) =>
    render(
      <SecurityMonitorHeader
        anomalies={clearAnomalies}
        period={KPI_PERIODS.TODAY}
        onPeriodChange={jest.fn()}
        onRefresh={jest.fn()}
        onExport={jest.fn()}
        {...overrides}
      />,
      { wrapper: Wrapper },
    )

  it('renders the period toggle and both actions', () => {
    renderHeader()

    const toggle = screen.getByRole('group', { name: 'Period' })
    expect(within(toggle).getByRole('button', { name: 'Today' })).toBeInTheDocument()
    expect(within(toggle).getByRole('button', { name: 'Last 7 Days' })).toBeInTheDocument()
    expect(within(toggle).getByRole('button', { name: 'This Month' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument()
  })

  it('reports the picked period', () => {
    const onPeriodChange = jest.fn()
    renderHeader({ onPeriodChange })

    fireEvent.click(screen.getByRole('button', { name: 'This Month' }))

    expect(onPeriodChange).toHaveBeenCalledWith(KPI_PERIODS.THIS_MONTH)
  })

  it('fires the refresh and export callbacks', () => {
    const onRefresh = jest.fn()
    const onExport = jest.fn()
    renderHeader({ onRefresh, onExport })

    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    fireEvent.click(screen.getByRole('button', { name: 'Export' }))

    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(onExport).toHaveBeenCalledTimes(1)
  })
})

describe('AnomalyBanner', () => {
  it('renders the count and one chip per anomaly', () => {
    render(
      <AnomalyBanner
        anomalies={{
          count: 3,
          chips: [
            { kind: ANOMALY_KINDS.AUTH_SPIKE, label: 'Auth Spike' },
            { kind: ANOMALY_KINDS.IPS_FLAGGED, label: '2 IPs Flagged' },
            { kind: ANOMALY_KINDS.DROP_OFF, label: 'Drop-off ↑' },
          ],
        }}
      />,
      { wrapper: Wrapper },
    )

    expect(screen.getByText('3 active anomalies in the last 2 hours')).toBeInTheDocument()
    expect(screen.getByText('Auth Spike')).toBeInTheDocument()
    expect(screen.getByText('2 IPs Flagged')).toBeInTheDocument()
  })

  it('renders the clear state without chips', () => {
    render(<AnomalyBanner anomalies={{ count: 0, chips: [] }} />, {
      wrapper: Wrapper,
    })

    expect(screen.getByText('0 active anomalies in the last 2 hours')).toBeInTheDocument()
    expect(screen.queryByText('Auth Spike')).not.toBeInTheDocument()
  })
})

describe('SecurityKpiStrip', () => {
  it('renders the four KPI cards for the shared period', () => {
    render(
      <SecurityKpiStrip
        summary={summary}
        usersUnderSiege={[criticalUser, warningUser]}
        period={KPI_PERIODS.TODAY}
      />,
      { wrapper: Wrapper },
    )

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('1,240')).toBeInTheDocument()
    expect(screen.getByText('87')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('1 critical · 1 warning')).toBeInTheDocument()
  })

  it('shows each delta as a value badge beside its caption', () => {
    render(<SecurityKpiStrip summary={summary} usersUnderSiege={[]} period={KPI_PERIODS.TODAY} />, {
      wrapper: Wrapper,
    })

    expect(screen.getByText('83')).toBeInTheDocument()
    expect(screen.getByText('vs baseline')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getAllByText('vs previous period')).toHaveLength(2)
  })

  it('stays neutral instead of alarming when every metric is zero', () => {
    const quiet: SecurityKpiSummary = {
      ...summary,
      failures: { ...summary.failures, [KPI_PERIODS.TODAY]: 0 },
      anomalies: { ...summary.anomalies, [KPI_PERIODS.TODAY]: 0 },
      failureDelta: {
        ...summary.failureDelta,
        [KPI_PERIODS.TODAY]: { value: 0, isIncrease: true },
      },
      anomaliesDelta: {
        ...summary.anomaliesDelta,
        [KPI_PERIODS.TODAY]: { value: 0, isIncrease: true },
      },
      successRateDelta: {
        ...summary.successRateDelta,
        [KPI_PERIODS.TODAY]: { value: 0, isIncrease: false },
      },
    }

    render(<SecurityKpiStrip summary={quiet} usersUnderSiege={[]} period={KPI_PERIODS.TODAY} />, {
      wrapper: Wrapper,
    })

    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
    expect(screen.queryAllByTestId('TrendingUpIcon')).toHaveLength(0)
    expect(screen.queryAllByTestId('TrendingDownIcon')).toHaveLength(0)
  })

  it('shows the worst-hit account as a chip and folds the rest into a count suffix', () => {
    render(
      <SecurityKpiStrip
        summary={summary}
        usersUnderSiege={[criticalUser, warningUser]}
        period={KPI_PERIODS.TODAY}
      />,
      { wrapper: Wrapper },
    )

    expect(screen.getByText('john +1')).toBeInTheDocument()
    expect(screen.queryByText('berry')).not.toBeInTheDocument()
  })

  it('maps the monthly period onto every card', () => {
    render(
      <SecurityKpiStrip summary={summary} usersUnderSiege={[]} period={KPI_PERIODS.THIS_MONTH} />,
      {
        wrapper: Wrapper,
      },
    )

    expect(screen.getByText('47')).toBeInTheDocument()
    expect(screen.getByText('18,340')).toBeInTheDocument()
    expect(screen.getByText('93')).toBeInTheDocument()
  })

  it('moves the anomaly count with the selected period', () => {
    const { rerender } = render(
      <SecurityKpiStrip summary={summary} usersUnderSiege={[]} period={KPI_PERIODS.TODAY} />,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('3')).toBeInTheDocument()

    rerender(
      <SecurityKpiStrip summary={summary} usersUnderSiege={[]} period={KPI_PERIODS.LAST_7_DAYS} />,
    )
    expect(screen.getByText('14')).toBeInTheDocument()

    rerender(
      <SecurityKpiStrip summary={summary} usersUnderSiege={[]} period={KPI_PERIODS.THIS_MONTH} />,
    )
    expect(screen.getByText('47')).toBeInTheDocument()
  })
})

describe('VelocityWatchHeatmap', () => {
  it('renders four-hour buckets with the attempt counts', () => {
    render(<VelocityWatchHeatmap matrix={matrix} />, { wrapper: Wrapper })

    expect(screen.getByText('00-04')).toBeInTheDocument()
    expect(screen.getByText('20-24')).toBeInTheDocument()
    expect(screen.getByText('142')).toBeInTheDocument()
    expect(screen.getByText('1 user anomalous')).toBeInTheDocument()
  })
})

describe('SecurityKpiStrip delta tooltips', () => {
  it('explains every delta and the siege breakdown', async () => {
    render(
      <SecurityKpiStrip
        summary={summary}
        usersUnderSiege={[criticalUser, warningUser]}
        period={KPI_PERIODS.TODAY}
      />,
      { wrapper: Wrapper },
    )

    fireEvent.mouseOver(screen.getByText('vs baseline'))
    expect(
      await screen.findByText('Failed or abandoned passkey sign-ins vs previous period'),
    ).toBeInTheDocument()

    fireEvent.mouseOver(screen.getByText('1 critical · 1 warning'))
    expect(await screen.findByText('Critical-level accounts vs the rest')).toBeInTheDocument()
  })
})

describe('TopTargetedAccountsChart legend tooltips', () => {
  const criticalPeer: UserFailureStat = { ...criticalUser, username: 'nadia' }

  it('surfaces the bucket breakdown on the matching legend chip', async () => {
    render(<TopTargetedAccountsChart userStats={[criticalUser, criticalPeer, warningUser]} />, {
      wrapper: Wrapper,
    })

    fireEvent.mouseOver(screen.getByText('Critical'))
    expect(await screen.findByText('2 accounts · 200 failed · 96 drop-off')).toBeInTheDocument()

    fireEvent.mouseOver(screen.getByText('Medium'))
    expect(await screen.findByText('1 accounts · 100 failed · 48 drop-off')).toBeInTheDocument()
  })

  it('counts only the accounts the chart actually plots', async () => {
    const manyUsers = Array.from({ length: 12 }, (_, index) => ({
      ...criticalUser,
      username: `user-${index}`,
      failures: 200 - index,
    }))

    render(<TopTargetedAccountsChart userStats={manyUsers} />, { wrapper: Wrapper })

    fireEvent.mouseOver(screen.getByText('Critical'))
    expect(await screen.findByText(/^8 accounts/)).toBeInTheDocument()
  })
})
