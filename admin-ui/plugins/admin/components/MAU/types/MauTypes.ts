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
  months: number
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
  onPresetSelect: (months: number) => void
  onApply: () => void
  isLoading?: boolean
}
