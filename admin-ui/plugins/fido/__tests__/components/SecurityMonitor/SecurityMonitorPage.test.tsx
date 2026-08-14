import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import SecurityMonitorPage from 'Plugins/fido/components/SecurityMonitor/SecurityMonitorPage'

jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: jest.fn(() => ({ canRead: true, canWrite: false, canDelete: false })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { FIDO: 'FIDO' },
}))

jest.mock('Plugins/fido/components/SecurityMonitor/hooks', () => ({
  ...jest.requireActual('Plugins/fido/components/SecurityMonitor/hooks'),
  useSecurityDashboardData: jest.fn(),
}))

jest.mock('@/utils/fileDownload', () => ({
  downloadTextFile: jest.fn(),
}))

jest.mock('Plugins/fido/components/SecurityMonitor/components', () => ({
  AttackPulseChart: () => <div data-testid="attack-pulse-chart" />,
  DeviceFingerprintChart: () => <div data-testid="device-fingerprint-chart" />,
  SecurityKpiStrip: ({ period }: { period: string }) => <div data-testid="kpi-strip">{period}</div>,
  SecurityMonitorHeader: ({
    anomalies,
    period,
    onPeriodChange,
    onRefresh,
    onExport,
  }: {
    anomalies: { count: number }
    period: string
    onPeriodChange: (period: string) => void
    onRefresh: () => void
    onExport: () => void
  }) => (
    <div data-testid="monitor-header">
      <span data-testid="anomaly-count">{anomalies.count}</span>
      <span data-testid="filter-period">{period}</span>
      <button type="button" onClick={() => onPeriodChange('this_month')}>
        pick period
      </button>
      <button type="button" onClick={onRefresh}>
        refresh
      </button>
      <button type="button" onClick={onExport}>
        export
      </button>
    </div>
  ),
  SessionIntegrityChart: () => <div data-testid="session-integrity-chart" />,
  TopTargetedAccountsChart: () => <div data-testid="top-targeted-accounts-chart" />,
  VelocityWatchHeatmap: () => <div data-testid="velocity-heatmap" />,
}))

const { useSecurityDashboardData } = jest.requireMock(
  'Plugins/fido/components/SecurityMonitor/hooks',
)
const { downloadTextFile } = jest.requireMock('@/utils/fileDownload')

const buildStore = () =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { hasSession: true }) => state,
      toastReducer: (state = { showToast: false, message: '', type: 'success' }) => state,
    }),
  })

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={buildStore()}>
        <AppTestWrapper>{children}</AppTestWrapper>
      </Provider>
    </QueryClientProvider>
  )
}

type DataOverrides = Partial<ReturnType<typeof baseData>>

const baseData = () => ({
  anomalies: { count: 2, chips: [] },
  summary: {
    failures: {},
    attempts: {},
    successRate: {},
    failureDelta: {},
    successRateDelta: {},
    anomalies: {},
    anomaliesDelta: {},
  },
  spikeSeries: [{ label: '14', timestamp: 1, failures: 124, baseline: 15, isSpike: true }],
  dropOffSeries: [],
  ipStats: [{ ipAddress: '192.0.2.10', failures: 24, failureRate: 100 }],
  userStats: [
    {
      username: 'a.morgan',
      failures: 24,
      failed: 20,
      abandoned: 4,
      failureRate: 100,
      threatLevel: 'critical',
    },
  ],
  usersUnderSiege: [],
  suspiciousIps: [],
  errorSlices: [{ category: 'INVALID_CREDENTIAL', count: 45, share: 45, color: '#f13f44' }],
  velocityMatrix: { rows: [], cols: [], cells: [], anomalousUsers: 0 },
  deviceTrend: { points: [], shiftDayLabel: null },
  userIds: ['alice', 'bob'],
  isLoading: false,
  isFetching: false,
})

const buildData = (overrides: DataOverrides = {}) => ({ ...baseData(), ...overrides })

describe('SecurityMonitorPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { usePermission } = jest.requireMock('@/cedarling/hooks/usePermission')
    usePermission.mockImplementation(() => ({ canRead: true, canWrite: false, canDelete: false }))
    useSecurityDashboardData.mockReturnValue(buildData())
  })

  it('renders the header chrome, banner and KPI strip above the tabs', () => {
    render(<SecurityMonitorPage />, { wrapper: Wrapper })

    expect(screen.getByTestId('monitor-header')).toBeInTheDocument()
    expect(screen.getByTestId('anomaly-count')).toHaveTextContent('2')
    expect(screen.getByTestId('kpi-strip')).toBeInTheDocument()
  })

  it('shares the picked period between the header and the KPI strip', () => {
    render(<SecurityMonitorPage />, { wrapper: Wrapper })

    expect(screen.getByTestId('kpi-strip')).toHaveTextContent('today')

    fireEvent.click(screen.getByText('pick period'))

    expect(screen.getByTestId('filter-period')).toHaveTextContent('this_month')
    expect(screen.getByTestId('kpi-strip')).toHaveTextContent('this_month')
  })

  it('shows the Live Threats charts by default', () => {
    render(<SecurityMonitorPage />, { wrapper: Wrapper })

    expect(screen.getByTestId('attack-pulse-chart')).toBeInTheDocument()
    expect(screen.getByTestId('session-integrity-chart')).toBeInTheDocument()
    expect(screen.getByTestId('top-targeted-accounts-chart')).toBeInTheDocument()
  })

  it('puts the anomaly count in the Live Threats tab label', () => {
    render(<SecurityMonitorPage />, { wrapper: Wrapper })

    expect(screen.getByText('Live Threats (2)')).toBeInTheDocument()
  })

  it('does not render an Attack Origins tab', () => {
    render(<SecurityMonitorPage />, { wrapper: Wrapper })

    expect(screen.queryByText('Attack Origins')).not.toBeInTheDocument()
  })

  it('shows the velocity heatmap and device trend on Behavioral Patterns', () => {
    render(<SecurityMonitorPage />, { wrapper: Wrapper })

    fireEvent.click(screen.getByText('Behavioral Patterns'))

    expect(screen.getByTestId('velocity-heatmap')).toBeInTheDocument()
    expect(screen.getByTestId('device-fingerprint-chart')).toBeInTheDocument()
  })

  it('exports the current data as CSV', () => {
    render(<SecurityMonitorPage />, { wrapper: Wrapper })

    fireEvent.click(screen.getByText('export'))

    expect(downloadTextFile).toHaveBeenCalledTimes(1)
    const [csv, fileName, mimeType] = downloadTextFile.mock.calls[0]
    expect(csv).toContain('192.0.2.10')
    expect(csv).toContain('a.morgan')
    expect(csv).toContain('INVALID_CREDENTIAL')
    expect(fileName).toMatch(/^passkey-security-monitor-\d{8}-\d{4}\.csv$/)
    expect(mimeType).toContain('text/csv')
  })

  it('does not download anything when there is no data to export', () => {
    useSecurityDashboardData.mockReturnValue(
      buildData({ spikeSeries: [], ipStats: [], userStats: [], errorSlices: [] }),
    )

    render(<SecurityMonitorPage />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText('export'))

    expect(downloadTextFile).not.toHaveBeenCalled()
  })

  it('re-reads the clock when refreshed', () => {
    render(<SecurityMonitorPage />, { wrapper: Wrapper })
    const firstCallNow = useSecurityDashboardData.mock.calls[0][0]

    fireEvent.click(screen.getByText('refresh'))

    const lastCallNow =
      useSecurityDashboardData.mock.calls[useSecurityDashboardData.mock.calls.length - 1][0]
    expect(lastCallNow).toBeGreaterThanOrEqual(firstCallNow)
  })

  it('hides the dashboard when the user cannot read the FIDO resource', () => {
    const { usePermission } = jest.requireMock('@/cedarling/hooks/usePermission')
    usePermission.mockImplementation(() => ({ canRead: false, canWrite: false, canDelete: false }))

    render(<SecurityMonitorPage />, { wrapper: Wrapper })

    expect(screen.queryByTestId('attack-pulse-chart')).not.toBeInTheDocument()
  })
})
