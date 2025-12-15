import type { LicenseResponse, Client, JansAttribute } from 'JansConfigApi'
import type { MauStatEntry, MauDateRange } from 'Plugins/admin/components/MAU/types'

export type { LicenseResponse, MauStatEntry, MauDateRange }

export interface LockStatEntry {
  monthly_active_users?: number
  monthly_active_clients?: number
  month?: string
}

export interface ReportCardData {
  name: string
  value: number
}

export interface ReportCardProps {
  title: string
  data: ReportCardData[]
  upValue: number
  downValue: number
}

export interface ReportPiChartItemProps {
  data: ReportCardData[]
}

export interface DashboardSummaryItem {
  title: string
  value: number | string
  icon: React.ComponentType
  color?: string
}

export type ServiceStatusValue = 'up' | 'down' | 'degraded' | 'unknown'

export interface ServiceHealth {
  name: string
  status: ServiceStatusValue
  lastChecked?: Date
}

export interface DashboardDateRange {
  startDate: Date
  endDate: Date
}

export interface DateRangeProps {
  startDate: Date
  endDate: Date
  onStartDateChange: (date: Date) => void
  onEndDateChange: (date: Date) => void
}

export interface DashboardChartProps {
  statData: MauStatEntry[]
  startMonth: string
  endMonth: string
}

export interface TooltipPayloadItem {
  dataKey: string
  value: number
  payload: Record<string, number | string>
  color?: string
  name?: string
}

export interface TooltipDesignProps {
  payload?: TooltipPayloadItem[]
  active?: boolean
}

export type DashboardClient = Pick<Client, 'inum' | 'clientName' | 'disabled'>

export type DashboardAttribute = Pick<JansAttribute, 'dn' | 'name' | 'status'>
