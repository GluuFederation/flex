import type { ReactNode } from 'react'
import type { ThemeConfig } from '@/context/theme/config'
import type { MetricsDateRange } from '../../Metrics/types'
import type {
  ANOMALY_GRANULARITIES,
  ANOMALY_KINDS,
  ATTACK_PATTERNS,
  KPI_PERIODS,
  THREAT_LEVELS,
} from '../constants'

type SecurityTranslate = (key: string, options?: Record<string, string | number>) => string

type ThreatLevel = (typeof THREAT_LEVELS)[keyof typeof THREAT_LEVELS]

type AttackPattern = (typeof ATTACK_PATTERNS)[keyof typeof ATTACK_PATTERNS]

type KpiPeriod = (typeof KPI_PERIODS)[keyof typeof KPI_PERIODS]

type AnomalyGranularity = (typeof ANOMALY_GRANULARITIES)[keyof typeof ANOMALY_GRANULARITIES]

type AnomalyKind = (typeof ANOMALY_KINDS)[keyof typeof ANOMALY_KINDS]

type FailureSpikePoint = {
  label: string
  timestamp: number
  failures: number
  baseline: number
  isSpike: boolean
}

type IpFailureStat = {
  ipAddress: string
  failures: number
  successes: number
  attempts: number
  failureRate: number
  targetedUsers: number
  firstSeen: number
  lastSeen: number
  threatLevel: ThreatLevel
  pattern: AttackPattern
}

type DropOffPoint = {
  label: string
  successRate: number
  failureRate: number
  dropOffRate: number
}

type ErrorCategorySlice = {
  category: string
  count: number
  share: number
  color: string
}

type VelocityCell = {
  value: number
  isAnomalous: boolean
}

type VelocityMatrix = {
  rows: readonly string[]
  cols: readonly string[]
  cells: readonly (readonly VelocityCell[])[]
  anomalousUsers: number
}

type DeviceTrendPoint = {
  label: string
  platform: number
  crossPlatform: number
}

type DeviceTrend = {
  points: readonly DeviceTrendPoint[]
  shiftDayLabel: string | null
}

type PeriodTotals = {
  attempts: number
  successes: number
  failures: number
}

type KpiDelta = {
  value: number
  isIncrease: boolean
}

type SecurityKpiSummary = {
  failures: Record<KpiPeriod, number>
  attempts: Record<KpiPeriod, number>
  successRate: Record<KpiPeriod, number>
  failureDelta: Record<KpiPeriod, KpiDelta>
  successRateDelta: Record<KpiPeriod, KpiDelta>
  anomalies: Record<AnomalyGranularity, number>
  anomaliesDelta: Record<AnomalyGranularity, KpiDelta>
}

type AnomalyChip = {
  kind: AnomalyKind
  label: string
}

type AnomalySummary = {
  count: number
  chips: readonly AnomalyChip[]
}

type SecurityStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

type SecurityChartColors = {
  failures: string
  baseline: string
  success: string
  failureBand: string
  dropOff: string
  attempts: string
  suspicious: string
  platform: string
  crossPlatform: string
}

type VelocityCellColors = {
  empty: string
  normal: string
  anomalous: string
}

type SecurityPalette = {
  chart: SecurityChartColors
  threatLevels: Record<ThreatLevel, string>
  velocityCells: VelocityCellColors
  errorCategories: readonly string[]
  statusBg: { active: string; inactive: string }
  status: { active: string; inactive: string }
}

type SecurityPaletteSource = Pick<ThemeConfig, 'badges' | 'chart' | 'textMuted' | 'warningColor'>

type SecurityLegendItem = {
  label: string
  color: string
}

type SecurityChartCardProps = {
  title: string
  subtitle?: string
  statusLabel?: string
  statusColor?: string
  legend?: readonly SecurityLegendItem[]
  isEmpty?: boolean
  emptyLabel?: string
  accentColor?: string
  headerExtra?: ReactNode
  children?: ReactNode
}

type PeriodToggleOption = {
  value: string
  label: string
}

type PeriodToggleProps = {
  options: readonly PeriodToggleOption[]
  value: string
  onChange: (value: string) => void
  ariaLabel: string
}

type SecurityMonitorHeaderProps = {
  anomalies: AnomalySummary
  period: KpiPeriod
  onPeriodChange: (period: KpiPeriod) => void
  isFetching: boolean
  onRefresh: () => void
  onExport: () => void
}

type AnomalyBannerProps = {
  anomalies: AnomalySummary
}

type KpiDeltaLabelProps = {
  delta: KpiDelta
  label: string
  increaseIsGood?: boolean
}

type SecurityKpiStripProps = {
  summary: SecurityKpiSummary
  suspiciousIps: readonly IpFailureStat[]
  period: KpiPeriod
}

type FailureSpikeTimelineProps = {
  series: readonly FailureSpikePoint[]
}

type DropOffChartProps = {
  series: readonly DropOffPoint[]
}

type FailureBurstByIpProps = {
  ipStats: readonly IpFailureStat[]
}

type ErrorCategoryChartProps = {
  slices: readonly ErrorCategorySlice[]
}

type VelocityHeatmapProps = {
  matrix: VelocityMatrix
  userIds: readonly string[]
  selectedUserId: string
  onSelectUser: (userId: string) => void
}

type DeviceShiftChartProps = {
  trend: DeviceTrend
}

type SecurityDashboardData = {
  anomalies: AnomalySummary
  summary: SecurityKpiSummary
  spikeSeries: readonly FailureSpikePoint[]
  dropOffSeries: readonly DropOffPoint[]
  ipStats: readonly IpFailureStat[]
  suspiciousIps: readonly IpFailureStat[]
  errorSlices: readonly ErrorCategorySlice[]
  velocityMatrix: VelocityMatrix
  deviceTrend: DeviceTrend
  userIds: readonly string[]
  isLoading: boolean
  isFetching: boolean
}

type SecurityRanges = {
  hourlyWithBaseline: MetricsDateRange
  today: MetricsDateRange
  lastSevenDays: MetricsDateRange
  deviceTrend: MetricsDateRange
  monthWithPrevious: MetricsDateRange
  lastTwelveMonths: MetricsDateRange
  ipWindow: MetricsDateRange
}

export type {
  AnomalyBannerProps,
  AnomalyChip,
  AnomalyGranularity,
  AnomalySummary,
  AttackPattern,
  DeviceShiftChartProps,
  DeviceTrend,
  DeviceTrendPoint,
  DropOffChartProps,
  DropOffPoint,
  ErrorCategoryChartProps,
  ErrorCategorySlice,
  FailureBurstByIpProps,
  FailureSpikePoint,
  FailureSpikeTimelineProps,
  IpFailureStat,
  KpiDelta,
  KpiDeltaLabelProps,
  KpiPeriod,
  PeriodToggleProps,
  PeriodTotals,
  SecurityChartCardProps,
  SecurityChartColors,
  SecurityDashboardData,
  SecurityKpiStripProps,
  SecurityKpiSummary,
  SecurityMonitorHeaderProps,
  SecurityPalette,
  SecurityPaletteSource,
  SecurityRanges,
  SecurityStylesParams,
  SecurityTranslate,
  ThreatLevel,
  VelocityCell,
  VelocityHeatmapProps,
  VelocityMatrix,
}
