import type { Dayjs } from 'dayjs'

export interface MauStatEntry {
  month: number
  mau: number
  client_credentials_access_token_count: number
  authz_code_access_token_count: number
  authz_code_idtoken_count: number
}

export interface RawStatEntry {
  month?: number
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

export interface MauDateRange {
  startDate: Dayjs
  endDate: Dayjs
}

export interface MauSummary {
  totalMau: number
  totalTokens: number
  clientCredentialsTokens: number
  authCodeTokens: number
  mauChange: number
  tokenChange: number
}

export interface MauSummaryCardProps {
  title: string
  value: number
  change: number
  color: string
}

export interface DateRangePreset {
  labelKey: string
  months: number
}

export interface TokenDistributionData {
  name: string
  value: number
  color: string
}

export interface MauChartProps {
  data: MauStatEntry[]
}

export interface DateRangeSelectorProps {
  startDate: Dayjs
  endDate: Dayjs
  selectedPreset: number | null
  onStartDateChange: (date: Dayjs | null) => void
  onEndDateChange: (date: Dayjs | null) => void
  onPresetSelect: (months: number) => void
  onApply: () => void
  isLoading?: boolean
}
