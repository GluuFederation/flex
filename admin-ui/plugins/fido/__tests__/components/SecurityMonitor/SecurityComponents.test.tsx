import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import AnomalyBanner from 'Plugins/fido/components/SecurityMonitor/components/AnomalyBanner'
import SecurityKpiStrip from 'Plugins/fido/components/SecurityMonitor/components/SecurityKpiStrip'
import SecurityMonitorHeader from 'Plugins/fido/components/SecurityMonitor/components/SecurityMonitorHeader'
import VelocityWatchHeatmap from 'Plugins/fido/components/SecurityMonitor/components/VelocityWatchHeatmap'
import {
  ALL_USERS_OPTION,
  ANOMALY_GRANULARITIES,
  ANOMALY_KINDS,
  ATTACK_PATTERNS,
  KPI_PERIODS,
  THREAT_LEVELS,
} from 'Plugins/fido/components/SecurityMonitor/constants'
import type {
  AnomalySummary,
  IpFailureStat,
  SecurityKpiSummary,
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
    [ANOMALY_GRANULARITIES.HOURLY]: 3,
    [ANOMALY_GRANULARITIES.DAILY]: 14,
    [ANOMALY_GRANULARITIES.MONTHLY]: 47,
  },
  anomaliesDelta: {
    [ANOMALY_GRANULARITIES.HOURLY]: { value: 1, isIncrease: true },
    [ANOMALY_GRANULARITIES.DAILY]: { value: 5, isIncrease: true },
    [ANOMALY_GRANULARITIES.MONTHLY]: { value: 12, isIncrease: true },
  },
}

const criticalIp: IpFailureStat = {
  ipAddress: '192.168.1.142',
  failures: 148,
  successes: 0,
  attempts: 148,
  failureRate: 100,
  targetedUsers: 6,
  firstSeen: 1,
  lastSeen: 2,
  threatLevel: THREAT_LEVELS.CRITICAL,
  pattern: ATTACK_PATTERNS.PASSWORD_SPRAYING,
}

const warningIp: IpFailureStat = {
  ...criticalIp,
  ipAddress: '172.16.0.33',
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

    expect(screen.getByText('3 active anomalies')).toBeInTheDocument()
    expect(screen.getByText('Auth Spike')).toBeInTheDocument()
    expect(screen.getByText('2 IPs Flagged')).toBeInTheDocument()
  })

  it('renders the clear state without chips', () => {
    render(<AnomalyBanner anomalies={{ count: 0, chips: [] }} />, {
      wrapper: Wrapper,
    })

    expect(screen.getByText('0 active anomalies')).toBeInTheDocument()
    expect(screen.queryByText('Auth Spike')).not.toBeInTheDocument()
  })
})

describe('SecurityKpiStrip', () => {
  it('renders the four KPI cards for the shared period', () => {
    render(
      <SecurityKpiStrip
        summary={summary}
        suspiciousIps={[criticalIp, warningIp]}
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
    render(<SecurityKpiStrip summary={summary} suspiciousIps={[]} period={KPI_PERIODS.TODAY} />, {
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
      anomalies: { ...summary.anomalies, [ANOMALY_GRANULARITIES.HOURLY]: 0 },
      failureDelta: {
        ...summary.failureDelta,
        [KPI_PERIODS.TODAY]: { value: 0, isIncrease: true },
      },
      anomaliesDelta: {
        ...summary.anomaliesDelta,
        [ANOMALY_GRANULARITIES.HOURLY]: { value: 0, isIncrease: true },
      },
    }

    render(<SecurityKpiStrip summary={quiet} suspiciousIps={[]} period={KPI_PERIODS.TODAY} />, {
      wrapper: Wrapper,
    })

    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('TrendingUpIcon').length).toBeGreaterThan(0)
  })

  it('lists the flagged IP addresses as chips', () => {
    render(
      <SecurityKpiStrip
        summary={summary}
        suspiciousIps={[criticalIp, warningIp]}
        period={KPI_PERIODS.TODAY}
      />,
      { wrapper: Wrapper },
    )

    expect(screen.getByText('192.168.1.142')).toBeInTheDocument()
    expect(screen.getByText('172.16.0.33')).toBeInTheDocument()
  })

  it('maps the monthly period onto every card', () => {
    render(
      <SecurityKpiStrip summary={summary} suspiciousIps={[]} period={KPI_PERIODS.THIS_MONTH} />,
      {
        wrapper: Wrapper,
      },
    )

    expect(screen.getByText('47')).toBeInTheDocument()
    expect(screen.getByText('18,340')).toBeInTheDocument()
    expect(screen.getByText('93')).toBeInTheDocument()
  })
})

describe('VelocityWatchHeatmap', () => {
  it('renders four-hour buckets with the attempt counts', () => {
    render(
      <VelocityWatchHeatmap
        matrix={matrix}
        userIds={['user_001', 'user_003']}
        selectedUserId={ALL_USERS_OPTION}
        onSelectUser={jest.fn()}
      />,
      { wrapper: Wrapper },
    )

    expect(screen.getByText('00-04')).toBeInTheDocument()
    expect(screen.getByText('20-24')).toBeInTheDocument()
    expect(screen.getByText('142')).toBeInTheDocument()
    expect(screen.getByText('1 user anomalous')).toBeInTheDocument()
  })

  it('offers an all-users option plus every seen user', () => {
    render(
      <VelocityWatchHeatmap
        matrix={matrix}
        userIds={['user_001', 'user_003']}
        selectedUserId={ALL_USERS_OPTION}
        onSelectUser={jest.fn()}
      />,
      { wrapper: Wrapper },
    )

    expect(screen.getByRole('button', { name: 'User' })).toHaveTextContent('All users')
  })
})
