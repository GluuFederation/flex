import type React from 'react'
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

export interface PieChartLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
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

export interface DashboardChartProps {
  statData: MauStatEntry[]
  startMonth: string
  endMonth: string
  textColor?: string
  gridColor?: string
  tooltipBackgroundColor?: string
  tooltipTextColor?: string
  isDark?: boolean
}

export interface TooltipPayloadItem {
  dataKey?: string | number
  value?: number
  payload?: Record<string, unknown>
  color?: string
  name?: string
}

export interface TooltipDesignProps {
  payload?: TooltipPayloadItem[]
  active?: boolean
  backgroundColor?: string
  textColor?: string
  isDark?: boolean
}

export type ChartDataKey =
  | 'client_credentials_access_token_count'
  | 'authz_code_access_token_count'
  | 'authz_code_idtoken_count'

export type DashboardClient = Pick<Client, 'inum' | 'clientName' | 'disabled'>

export type DashboardAttribute = Pick<JansAttribute, 'dn' | 'name' | 'status'>
