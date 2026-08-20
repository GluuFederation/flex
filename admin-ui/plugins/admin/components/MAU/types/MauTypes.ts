import type { ReactNode } from 'react'
import type { Dayjs } from 'dayjs'

export type MauStatEntry = {
  month: number
  mau: number
  client_credentials_access_token_count: number
  authz_code_access_token_count: number
  authz_code_idtoken_count: number
}

export type RawStatEntry = {
  month?: string | number
  monthly_active_users?: number
  token_count_per_granttype?: {
    client_credentials?: {
      access_token?: number
    }
    authorization_code?: {
      access_token?: number
      id_token?: number
    }
  }
}

export type MauDateRange = {
  startDate: Dayjs
  endDate: Dayjs
}

export type MauSummary = {
  totalMau: number
  totalTokens: number
  clientCredentialsTokens: number
  authCodeTokens: number
  mauChange: number
  tokenChange: number
}

export type DateRangePreset = {
  labelKey: string
  value: number
}

export type MauChartProps = {
  data: MauStatEntry[]
}

export type DateRangeSelectorProps = {
  startDate: Dayjs
  endDate: Dayjs
  selectedPreset: number | null
  onStartDateChange: (date: Dayjs | null) => void
  onEndDateChange: (date: Dayjs | null) => void
  onPresetSelect: (value: number) => void
  onApply: () => void
  isLoading?: boolean
  // Heading and presets are overridable so other dashboards can mount the same control surface.
  // `value` is deliberately unitless: MAU reads it as months, callers with shorter retention read
  // it as days, and the selector itself never needs to know which.
  headingKey?: string
  presets?: readonly DateRangePreset[]
  applyLabelKey?: string
  // Hung under one preset button rather than beside the group, so a control that qualifies the
  // chosen range appears against the segment that set it. Anchored by preset value; nothing is
  // rendered when the anchor matches no preset, which is how the menu stays closed.
  presetMenu?: ReactNode
  presetMenuAnchor?: number | null
}
