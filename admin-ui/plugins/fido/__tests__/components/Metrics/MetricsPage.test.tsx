import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import MetricsPage from 'Plugins/fido/components/Metrics/MetricsPage'

jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: jest.fn(() => ({ canRead: true, canWrite: false, canDelete: false })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { FIDO: 'FIDO' },
}))

jest.mock('Plugins/fido/components/Metrics/hooks', () => ({
  useAdoptionMetrics: jest.fn(() => ({ isLoading: false, isFetching: false, data: undefined })),
  useErrorsAnalytics: jest.fn(() => ({ isLoading: false, isFetching: false, data: undefined })),
  usePerformanceAnalytics: jest.fn(() => ({
    isLoading: false,
    isFetching: false,
    data: undefined,
  })),
  useAggregationMetrics: jest.fn(() => ({ isLoading: false, isFetching: false, data: undefined })),
}))

jest.mock('Plugins/fido/components/Metrics/components/PasskeyAuthChart', () => ({
  __esModule: true,
  default: () => <div data-testid="passkey-auth-chart">PasskeyAuthChart</div>,
}))

jest.mock('Plugins/fido/components/Metrics/components/PasskeyAdoptionChart', () => ({
  __esModule: true,
  default: () => <div data-testid="passkey-adoption-chart">PasskeyAdoptionChart</div>,
}))

jest.mock('Plugins/fido/components/Metrics/components/OnboardingTimeChart', () => ({
  __esModule: true,
  default: () => <div data-testid="onboarding-time-chart">OnboardingTimeChart</div>,
}))

jest.mock('Plugins/fido/components/Metrics/components/AggregationTab', () => ({
  __esModule: true,
  default: () => <div data-testid="aggregation-tab">AggregationTab</div>,
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('MetricsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { usePermission } = jest.requireMock('@/cedarling/hooks/usePermission')
    usePermission.mockImplementation(() => ({ canRead: true, canWrite: false, canDelete: false }))
  })

  it('renders the General tab with charts by default', () => {
    render(<MetricsPage />, { wrapper: Wrapper })
    expect(screen.getByTestId('passkey-auth-chart')).toBeInTheDocument()
    expect(screen.getByTestId('passkey-adoption-chart')).toBeInTheDocument()
    expect(screen.getByTestId('onboarding-time-chart')).toBeInTheDocument()
  })

  it('renders the Apply button', () => {
    render(<MetricsPage />, { wrapper: Wrapper })
    expect(screen.getByText('Apply')).toBeInTheDocument()
  })

  it('renders both tab labels', () => {
    render(<MetricsPage />, { wrapper: Wrapper })
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Aggregation')).toBeInTheDocument()
  })

  it('shows the Aggregation tab content when clicked', () => {
    render(<MetricsPage />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText('Aggregation'))
    expect(screen.getByTestId('aggregation-tab')).toBeInTheDocument()
  })

  it('shows missing permission message when user lacks read permission', () => {
    const { usePermission } = jest.requireMock('@/cedarling/hooks/usePermission')
    usePermission.mockImplementation(() => ({ canRead: false, canWrite: false, canDelete: false }))
    render(<MetricsPage />, { wrapper: Wrapper })
    expect(screen.queryByTestId('passkey-auth-chart')).not.toBeInTheDocument()
    expect(screen.getByTestId('MISSING')).toBeInTheDocument()
  })
})
