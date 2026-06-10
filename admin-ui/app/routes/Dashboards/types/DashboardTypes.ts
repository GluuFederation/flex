import type { MauStatEntry } from 'Plugins/admin/components/MAU/types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { DATE_RANGE_TYPE } from '../constants'

export type { MauStatEntry }

export type DateRangeType = (typeof DATE_RANGE_TYPE)[keyof typeof DATE_RANGE_TYPE]

export type LockStatEntry = {
  monthly_active_users?: number
  monthly_active_clients?: number
  month?: string
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
