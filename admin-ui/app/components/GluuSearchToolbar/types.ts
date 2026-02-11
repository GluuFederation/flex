import type { ReactNode } from 'react'
import type { Dayjs } from '@/utils/dayjsUtils'

export interface FilterOption {
  label: string
  value: string
}

export interface FilterDef {
  key: string
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  width?: string | number
}

export interface DateInputDef {
  key: string
  label: string
  value: string
  onChange: (value: string) => void
  max?: string
  min?: string
  width?: string | number
}

export interface PrimaryActionDef {
  label: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
}

export interface GluuSearchToolbarProps {
  searchPlaceholder?: string
  searchLabel?: string
  searchValue?: string
  onSearch: (value: string) => void
  onSearchSubmit?: (value: string) => void
  filters?: FilterDef[]
  dateInputs?: DateInputDef[]

  dateRange?: {
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
  }
  dateRangeSlot?: ReactNode
  onRefresh?: () => void
  primaryAction?: PrimaryActionDef
  refreshLoading?: boolean
  refreshButtonVariant?: 'primary' | 'outlined'
}
