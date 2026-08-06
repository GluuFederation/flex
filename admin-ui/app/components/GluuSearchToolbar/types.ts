import type { ReactNode } from 'react'
import type { Dayjs } from '@/utils/dayjsUtils'

export type FilterOption = {
  label: string
  value: string
}

export type FilterDef = {
  key: string
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  width?: string | number
  /** Value the sheet's Cancel resets this filter to. When omitted, Cancel only discards edits. */
  defaultValue?: string
}

type DateInputDef = {
  key: string
  label: string
  value: string
  onChange: (value: string) => void
  max?: string
  min?: string
  width?: string | number
}

type PrimaryActionDef = {
  label: string
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
}

type DateRangeConfig = {
  startDate: Dayjs | null
  endDate: Dayjs | null
  onStartDateChange: (date: Dayjs | null) => void
  onEndDateChange: (date: Dayjs | null) => void
  onStartDateAccept?: (date: Dayjs | null) => void
  onEndDateAccept?: (date: Dayjs | null) => void
  dateFormat?: string
  layout?: 'grid' | 'row'
  labelAsTitle?: boolean
  inputHeight?: number
  showTime?: boolean
}

type GluuSearchToolbarBaseProps = {
  searchPlaceholder?: string
  searchLabel?: string
  searchFieldWidth?: number | string
  searchOnType?: boolean
  searchDebounceMs?: number
  onSearch?: (value: string) => void
  onSearchSubmit?: (value: string) => void
  filters?: FilterDef[]
  dateInputs?: DateInputDef[]
  dateRange?: DateRangeConfig
  dateRangeSlot?: ReactNode
  onRefresh?: () => void
  primaryAction?: PrimaryActionDef
  actionsLabel?: string
  refreshLoading?: boolean
  refreshButtonVariant?: 'primary' | 'outlined'
  compactActionLabels?: boolean
  disabled?: boolean
  /** Optional class on the toolbar root, for page-specific layout overrides. */
  className?: string
}

type GluuSearchToolbarInputProps = GluuSearchToolbarBaseProps & {
  selectOptions?: undefined
  onSelectChange?: undefined
  selectPlaceholder?: undefined
  searchValue?: string
}

type GluuSearchToolbarSelectProps = GluuSearchToolbarBaseProps & {
  selectOptions: FilterOption[]
  searchValue: string
  onSelectChange: (value: string) => void
  selectPlaceholder?: string
}

export type GluuSearchToolbarProps = GluuSearchToolbarInputProps | GluuSearchToolbarSelectProps

export type GluuRefreshButtonProps = {
  onClick: () => void
  disabled?: boolean
  label?: string
  loading?: boolean
  className?: string
  icon?: ReactNode
  variant?: 'primary' | 'outlined'
  minHeight?: number
  size?: 'sm' | 'md' | 'lg'
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  useOpacityOnHover?: boolean
}
