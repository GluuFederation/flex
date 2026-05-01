import type React from 'react'
import type { LicenseResponse, Client, JansAttribute } from 'JansConfigApi'
import type { MauStatEntry, MauDateRange } from 'Plugins/admin/components/MAU/types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { ServiceStatusValue } from '@/constants'

export type { LicenseResponse, MauStatEntry, MauDateRange }

export type LockStatEntry = {
  monthly_active_users?: number
  monthly_active_clients?: number
  month?: string
}

export type ReportCardData = {
  name: string
  value: number
}

export type ReportCardProps = {
  title: string
  data: ReportCardData[]
  upValue: number
  downValue: number
}

export type ReportPiChartItemProps = {
  data: ReportCardData[]
}

export type PieChartLabelProps = {
  cx?: number
  cy?: number
  midAngle?: number
  innerRadius?: number
  outerRadius?: number
  percent?: number
}

export type DashboardSummaryItem = {
  title: string
  value: number | string
  icon: React.ComponentType
  color?: string
}

export type { ServiceStatusValue }

export type ServiceHealth = {
  name: string
  status: ServiceStatusValue
  lastChecked?: Date
}

export type DashboardChartProps = {
  statData: MauStatEntry[]
  startMonth: string
  endMonth: string
  textColor?: string
  gridColor?: string
  tooltipBackgroundColor?: string
  tooltipTextColor?: string
  isDark?: boolean
}

export type TooltipPayloadItem = {
  dataKey?:
    | string
    | number
    | ((obj: Record<string, string | number | boolean | null>) => string | number | boolean | null)
  value?: number | string | readonly (string | number)[]
  payload?: Record<string, string | number | boolean | null>
  color?: string
  name?: string | number
}

export type TooltipDesignProps = {
  payload?: ReadonlyArray<TooltipPayloadItem>
  active?: boolean
  backgroundColor?: string
  textColor?: string
  isDark?: boolean
  formatter?: (value: JsonValue) => string
}

export type ChartDataKey =
  | 'client_credentials_access_token_count'
  | 'authz_code_access_token_count'
  | 'authz_code_idtoken_count'

export type DashboardClient = Pick<Client, 'inum' | 'clientName' | 'disabled'>

export type DashboardAttribute = Pick<JansAttribute, 'dn' | 'name' | 'status'>
